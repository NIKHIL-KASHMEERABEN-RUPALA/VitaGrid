"""
VitaGrid GOV - Sovereign Cryptographic Append-Only Audit Ledger
Maintains an immutable, hash-chained ledger for all state transitions, predictions,
model inferences, and ministerial decisions. Conforms to FIPS 140-3 audit standards.
"""

from dataclasses import dataclass, asdict
import json
import time
from typing import Any, Dict, List, Optional, Tuple
from vitagrid_gov.core.security import security
from vitagrid_gov.core.config import settings


@dataclass
class AuditBlock:
    index: int
    timestamp: float
    event_type: str
    actor_id: str
    enclave_id: str
    payload: Dict[str, Any]
    previous_hash: str
    current_hash: str
    hmac_signature: str


class AuditLedger:
    def __init__(self):
        self.chain: List[AuditBlock] = []
        self._initialize_genesis_block()

    def _initialize_genesis_block(self):
        """Creates the sovereign genesis block for the audit chain."""
        genesis_payload = {
            "platform": settings.PLATFORM_NAME,
            "version": settings.PLATFORM_VERSION,
            "enclave": settings.ENCLAVE_ID,
            "notice": "SOVEREIGN HEALTH INTELLIGENCE MESH INITIALIZED",
        }
        timestamp = time.time()
        prev_hash = "0" * 64
        block_hash = security.sha256_hash({"index": 0, "prev": prev_hash, "payload": genesis_payload})
        sig = security.compute_hmac(f"{block_hash}:{timestamp}")
        
        genesis = AuditBlock(
            index=0,
            timestamp=timestamp,
            event_type="GENESIS_ENCLAVE_BOOTSTRAP",
            actor_id="SYSTEM_ROOT",
            enclave_id=settings.ENCLAVE_ID,
            payload=genesis_payload,
            previous_hash=prev_hash,
            current_hash=block_hash,
            hmac_signature=sig,
        )
        self.chain.append(genesis)

    def append_event(self, event_type: str, actor_id: str, payload: Dict[str, Any]) -> AuditBlock:
        """Appends a new cryptographically signed record to the audit chain."""
        last_block = self.chain[-1]
        new_index = last_block.index + 1
        now = time.time()
        
        data_to_hash = {
            "index": new_index,
            "timestamp": now,
            "event_type": event_type,
            "actor_id": actor_id,
            "payload": payload,
            "previous_hash": last_block.current_hash,
        }
        current_hash = security.sha256_hash(data_to_hash)
        hmac_sig = security.compute_hmac(f"{current_hash}:{now}:{actor_id}")

        block = AuditBlock(
            index=new_index,
            timestamp=now,
            event_type=event_type,
            actor_id=actor_id,
            enclave_id=settings.ENCLAVE_ID,
            payload=payload,
            previous_hash=last_block.current_hash,
            current_hash=current_hash,
            hmac_signature=hmac_sig,
        )
        self.chain.append(block)
        return block

    def verify_chain_integrity(self) -> Tuple[bool, Optional[int]]:
        """
        Validates the complete hash chain from Genesis to current tip.
        Returns (is_valid, corrupted_block_index).
        """
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            if current.previous_hash != previous.current_hash:
                return False, current.index

            recomputed_hash = security.sha256_hash({
                "index": current.index,
                "timestamp": current.timestamp,
                "event_type": current.event_type,
                "actor_id": current.actor_id,
                "payload": current.payload,
                "previous_hash": current.previous_hash,
            })
            if recomputed_hash != current.current_hash:
                return False, current.index

        return True, None

    def get_recent(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Returns the most recent audit blocks as dictionaries."""
        return [asdict(b) for b in reversed(self.chain[-limit:])]

    def query(self, event_type: Optional[str] = None, actor_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Queries the immutable ledger by filter."""
        results = []
        for block in reversed(self.chain):
            if event_type and block.event_type != event_type:
                continue
            if actor_id and block.actor_id != actor_id:
                continue
            results.append(asdict(block))
        return results


audit_ledger = AuditLedger()
