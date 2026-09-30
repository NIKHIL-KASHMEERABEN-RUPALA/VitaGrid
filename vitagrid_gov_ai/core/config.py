"""
VitaGrid GOV - Sovereign Core Configuration
FIPS 140-3 and FedRAMP High compliant environment specifications.
"""

from dataclasses import dataclass, field
import os
from typing import List


@dataclass
class SovereignSecurityConfig:
    enclave_id: str = os.getenv("SOVEREIGN_ENCLAVE_ID", "AP-SOV-01")
    fips_mode: bool = os.getenv("FIPS_MODE", "true").lower() in ("true", "1", "yes")
    audit_signing_key_id: str = os.getenv("AUDIT_SIGNING_KEY_ID", "KMS-SOV-MOH-2026-KEY1")
    zero_pii_enforcement: bool = True
    allowed_domains: List[str] = field(
        default_factory=lambda: [
            "health.gov",
            "moh.gov",
            "cdc.gov",
            "vitagrid.gov",
            "who.int",
            "nph.gov",
        ]
    )


@dataclass
class ModelConfig:
    base_model_id: str = os.getenv("BASE_MODEL_ID", "meta-llama/Llama-3.1-8B-Instruct")
    lora_checkpoint_dir: str = os.getenv("LORA_CHECKPOINT_DIR", "./checkpoints/lora_vitagrid")
    temperature: float = 0.1
    top_p: float = 0.95
    max_tokens: int = 1536
    vllm_api_base: str = os.getenv("VLLM_API_BASE", "http://localhost:8000/v1")
    device: str = os.getenv("DEVICE", "cuda" if os.getenv("USE_CUDA") == "1" else "cpu")


@dataclass
class SystemThresholds:
    outbreak_r_t_alert_threshold: float = 1.15
    critical_stockout_runout_days: int = 7
    warning_stockout_runout_days: int = 14
    icu_utilization_critical_pct: float = 85.0
    cold_chain_max_celsius: float = 8.0
    cold_chain_min_celsius: float = 2.0
    provisional_clearance_hours: int = 12


@dataclass
class AppConfig:
    app_name: str = "VitaGrid GOV Intelligence Layer"
    version: str = "4.2.1-SEC"
    defcon_level: int = 4
    timezone: str = "Africa/Nairobi"  # UTC+3
    vitagrid_gov_url: str = os.getenv("VITAGRID_GOV_URL", "http://localhost:8000")
    security: SovereignSecurityConfig = field(default_factory=SovereignSecurityConfig)
    models: ModelConfig = field(default_factory=ModelConfig)
    thresholds: SystemThresholds = field(default_factory=SystemThresholds)


settings = AppConfig()
