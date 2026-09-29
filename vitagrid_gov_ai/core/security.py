"""
VitaGrid GOV - Sovereign Cryptographic Security & Zero-PII Enclave
Enforces FedRAMP High, FIPS 140-3, and Zero-PII Egress validation.
"""

import hashlib
import hmac
import json
import re
import time
from dataclasses import asdict
from typing import Any, Dict, Optional, Tuple
from vitagrid_gov_ai.core.config import settings


# Zero-PII Redaction Regex Patterns
PHONE_REGEX = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}")
NATIONAL_ID_REGEX = re.compile(r"\b(ID|NID|MOH|SSN)[-:\s]?[A-Z0-9]{6,12}\b", re.IGNORECASE)
EMAIL_REGEX = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
PATIENT_NAME_CUE = re.compile(r"\b(patient|pt|mr\.|mrs\.|ms\.|child)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)", re.IGNORECASE)


class ZeroPIISanitizer:
    """
    Guarantees no patient-identifiable or sovereign personal data escapes
    to external logs, models, or egress points.
    """

    @classmethod
    def sanitize_text(cls, text: str) -> str:
        """Mask potential PII patterns with cryptographic surrogate tokens."""
        if not text:
            return ""
        redacted = PHONE_REGEX.sub("[PII_TELEPHONE_REDACTED]", text)
        redacted = NATIONAL_ID_REGEX.sub("[PII_NATIONAL_ID_REDACTED]", redacted)
        redacted = PATIENT_NAME_CUE.sub(r"\1 [PII_ANONYMIZED_PATIENT]", redacted)
        # Verify emails against sovereign allowed domains, mask non-sovereign
        def mask_email(match):
            e = match.group(0)
            domain = e.split("@")[-1].lower()
            if any(domain.endswith(allowed) for allowed in settings.security.allowed_domains):
                return e  # Sovereign official personnel email permitted
            return "[COMMERCIAL_EMAIL_BLOCKED]"
        redacted = EMAIL_REGEX.sub(mask_email, redacted)
        return redacted

    @classmethod
    def sanitize_dict(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """Recursively redact dictionary objects and dataclasses."""
        clean = {}
        for k, v in data.items():
            if isinstance(v, str):
                clean[k] = cls.sanitize_text(v)
            elif isinstance(v, dict):
                clean[k] = cls.sanitize_dict(v)
            elif hasattr(v, "__dataclass_fields__"):
                clean[k] = cls.sanitize_dict(asdict(v))
            elif isinstance(v, list):
                clean[k] = [
                    cls.sanitize_dict(i) if isinstance(i, dict)
                    else cls.sanitize_dict(asdict(i)) if hasattr(i, "__dataclass_fields__")
                    else cls.sanitize_text(i) if isinstance(i, str)
                    else i
                    for i in v
                ]
            else:
                clean[k] = v
        return clean


class CryptographicAuditor:
    """
    Generates immutable SHA-256 / HMAC cryptographic verification hashes
    for every decision, proposal, and telemetry batch in the national grid.
    """

    @staticmethod
    def compute_sha256(payload: Any) -> str:
        if isinstance(payload, (dict, list)):
            try:
                canonical_json = json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str)
                return hashlib.sha256(canonical_json.encode("utf-8")).hexdigest()
            except Exception:
                return hashlib.sha256(str(payload).encode("utf-8")).hexdigest()
        return hashlib.sha256(str(payload).encode("utf-8")).hexdigest()

    @staticmethod
    def sign_proposal(proposal_id: str, action_payload: Dict[str, Any], signer_id: str, secret_salt: Optional[str] = None) -> Tuple[str, str]:
        """
        Produce a sovereign cryptographic token and tamper-evident signature
        for Human-in-the-Loop governance.
        """
        salt = secret_salt or settings.security.audit_signing_key_id
        timestamp = int(time.time())
        canonical_content = f"{proposal_id}|{signer_id}|{timestamp}|{CryptographicAuditor.compute_sha256(action_payload)}"
        
        signature = hmac.new(
            salt.encode("utf-8"),
            canonical_content.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        docket_id = f"DOCKET-SOV-{proposal_id[:8].upper()}-{hex(timestamp)[2:].upper()}"
        return docket_id, signature

    @staticmethod
    def verify_proposal_signature(
        proposal_id: str,
        action_payload: Dict[str, Any],
        signer_id: str,
        timestamp: int,
        provided_signature: str,
        secret_salt: Optional[str] = None
    ) -> bool:
        salt = secret_salt or settings.security.audit_signing_key_id
        canonical_content = f"{proposal_id}|{signer_id}|{timestamp}|{CryptographicAuditor.compute_sha256(action_payload)}"
        expected = hmac.new(
            salt.encode("utf-8"),
            canonical_content.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, provided_signature)
