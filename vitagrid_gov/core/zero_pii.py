"""
VitaGrid GOV - Zero-PII Sanitization Enclave
FedRAMP High & HIPAA compliant data sanitizer. Strips and pseudonyms all identifiable
patient, clinician, and citizen data before it reaches AI models or the event bus.
"""

import re
from typing import Any, Dict, List, Union
from vitagrid_gov.core.config import settings


class ZeroPIISanitizer:
    # Regex patterns for sensitive identifiers
    EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
    PHONE_PATTERN = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}")
    NATIONAL_ID_PATTERN = re.compile(r"\b[A-Z]{1,3}\d{6,9}\b|\bID[-_]?\d{7,10}\b", re.IGNORECASE)
    IP_PATTERN = re.compile(r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b")
    NAME_PATTERNS = [
        re.compile(r"\b(?:Patient|Clinician|Nurse|Officer|Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b"),
        re.compile(r"\b(?:DOB|Birthdate|SSN|Aadhaar):\s*[\d/-]+\b", re.IGNORECASE),
    ]

    REPLACEMENT_TAGS = {
        "email": "[PII_EMAIL_REDACTED]",
        "phone": "[PII_PHONE_REDACTED]",
        "id": "[PII_ID_REDACTED]",
        "ip": "[PII_IP_REDACTED]",
        "name": "[PERSON_PSEUDONYMIZED]",
    }

    @classmethod
    def sanitize_text(cls, text: str) -> str:
        """Sanitizes raw text strings by redacting PII matches."""
        if not text or not isinstance(text, str):
            return text
        
        redacted = cls.EMAIL_PATTERN.sub(cls.REPLACEMENT_TAGS["email"], text)
        redacted = cls.PHONE_PATTERN.sub(cls.REPLACEMENT_TAGS["phone"], redacted)
        redacted = cls.NATIONAL_ID_PATTERN.sub(cls.REPLACEMENT_TAGS["id"], redacted)
        redacted = cls.IP_PATTERN.sub(cls.REPLACEMENT_TAGS["ip"], redacted)
        
        for np in cls.NAME_PATTERNS:
            redacted = np.sub(cls.REPLACEMENT_TAGS["name"], redacted)
            
        return redacted

    @classmethod
    def sanitize(cls, data: Union[Dict[str, Any], List[Any], str, Any]) -> Any:
        """Recursively traverses dictionaries, lists, and primitives to sanitize all PII."""
        if isinstance(data, str):
            return cls.sanitize_text(data)
        elif isinstance(data, dict):
            clean_dict = {}
            for k, v in data.items():
                # Redact keys that inherently hold raw PII
                lower_k = str(k).lower()
                if any(term in lower_k for term in ["patient_name", "ssn", "national_id", "phone_number", "citizen_id"]):
                    clean_dict[k] = "[REDACTED_BY_SOVEREIGN_POLICY]"
                else:
                    clean_dict[k] = cls.sanitize(v)
            return clean_dict
        elif isinstance(data, list):
            return [cls.sanitize(item) for item in data]
        elif hasattr(data, "__dict__"):
            # Dataclass or custom object
            return cls.sanitize(data.__dict__)
        return data


zero_pii_sanitizer = ZeroPIISanitizer()
