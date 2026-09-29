"""
VitaGrid GOV - Sovereign Telemetry & Audit Stream
Structured JSON logging conforming to FedRAMP High audit logging standards.
"""

import json
import logging
import sys
import time
from typing import Any, Dict, Optional
from vitagrid_gov_ai.core.config import settings
from vitagrid_gov_ai.core.security import ZeroPIISanitizer


class SovereignJsonFormatter(logging.Formatter):
    """Formats log records as structured, sanitised JSON objects."""

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(record.created)),
            "level": record.levelname,
            "enclave_id": settings.security.enclave_id,
            "module": record.module,
            "message": ZeroPIISanitizer.sanitize_text(record.getMessage()),
            "logger": record.name,
        }
        if hasattr(record, "audit_event"):
            payload["audit_event"] = getattr(record, "audit_event")
        if hasattr(record, "agent_id"):
            payload["agent_id"] = getattr(record, "agent_id")
        if hasattr(record, "trace_id"):
            payload["trace_id"] = getattr(record, "trace_id")
        return json.dumps(payload)


def get_sovereign_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(SovereignJsonFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


logger = get_sovereign_logger("vitagrid.gov.ai")
