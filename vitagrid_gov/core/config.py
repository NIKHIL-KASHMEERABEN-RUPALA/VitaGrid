"""
VitaGrid GOV - Sovereign Core Configuration
Enforces FedRAMP High, FIPS 140-3 cryptography parameters, and multi-echelon platform settings.
"""

from dataclasses import dataclass, field
import os
from typing import List, Dict, Any


@dataclass
class Settings:
    # System Identification
    PLATFORM_NAME: str = "VitaGrid GOV"
    PLATFORM_VERSION: str = "5.0.0-PROD"
    ENVIRONMENT: str = os.getenv("VITAGRID_ENV", "production")
    ENCLAVE_ID: str = "ENCLAVE-SOV-NAT-01"
    
    # Network & API
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    ALLOWED_ORIGINS: List[str] = field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://ais-dev-qz7lxqmy6r47eft4ogjczk-565463478430.asia-southeast1.run.app",
            "https://ais-pre-qz7lxqmy6r47eft4ogjczk-565463478430.asia-southeast1.run.app",
            "*",
        ]
    )

    # Security & FIPS 140-3
    SECRET_KEY: str = os.getenv("SECRET_KEY", "vitagrid-fips140-3-sovereign-master-key-9920b32c4365")
    HMAC_AUDIT_KEY: str = os.getenv("HMAC_AUDIT_KEY", "audit-ledger-hmac-sha256-key-771894a8e2")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    ZERO_PII_STRICT_MODE: bool = True

    # Redis Event Bus (with graceful in-memory async fallback)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./vitagrid_gov.db")

    # Operational Hierarchy
    TOTAL_HEALTH_ZONES: int = 47
    TOTAL_PRIMARY_HEALTH_CENTERS: int = 2840
    ECHELON_TIERS: List[str] = field(
        default_factory=lambda: [
            "E1_CENTRAL_DEPOT",
            "E2_REGIONAL_HUB",
            "E3_COUNTY_REFERRAL",
            "E4_SUBCOUNTY_HOSPITAL",
            "E5_RURAL_DISPENSARY",
        ]
    )

    # Sovereign Thresholds
    BED_SURGE_THRESHOLD: float = 0.85
    DEFAULT_DEFCON_LEVEL: int = 4  # 5: Normal, 4: Epidemiological Watch, 3: Warning, 2: Mobilization, 1: Emergency
    
    # 47 Sovereign Counties
    COUNTIES: List[Dict[str, Any]] = field(
        default_factory=lambda: [
            {"code": "C01", "name": "Mombasa", "lat": -4.0435, "lng": 39.6682, "pop": 1208333},
            {"code": "C02", "name": "Kwale", "lat": -4.1737, "lng": 39.4521, "pop": 866820},
            {"code": "C03", "name": "Kilifi", "lat": -3.5107, "lng": 39.9093, "pop": 1453787},
            {"code": "C04", "name": "Tana River", "lat": -1.5000, "lng": 40.0000, "pop": 315943},
            {"code": "C05", "name": "Lamu", "lat": -2.2717, "lng": 40.9020, "pop": 143920},
            {"code": "C06", "name": "Taita Taveta", "lat": -3.3167, "lng": 38.4833, "pop": 340671},
            {"code": "C07", "name": "Garissa", "lat": -0.4532, "lng": 39.6460, "pop": 841353},
            {"code": "C08", "name": "Wajir", "lat": 1.7471, "lng": 40.0573, "pop": 781263},
            {"code": "C09", "name": "Mandera", "lat": 3.9373, "lng": 41.8569, "pop": 867457},
            {"code": "C10", "name": "Marsabit", "lat": 2.3340, "lng": 37.9900, "pop": 459785},
            {"code": "C11", "name": "Isiolo", "lat": 0.3546, "lng": 37.5822, "pop": 268002},
            {"code": "C12", "name": "Meru", "lat": 0.0463, "lng": 37.6559, "pop": 1545714},
            {"code": "C13", "name": "Tharaka-Nithi", "lat": -0.2965, "lng": 37.8739, "pop": 393177},
            {"code": "C14", "name": "Embu", "lat": -0.5397, "lng": 37.4586, "pop": 608599},
            {"code": "C15", "name": "Kitui", "lat": -1.3670, "lng": 38.0106, "pop": 1136187},
            {"code": "C16", "name": "Machakos", "lat": -1.5177, "lng": 37.2634, "pop": 1421932},
            {"code": "C17", "name": "Makueni", "lat": -1.8041, "lng": 37.6203, "pop": 987653},
            {"code": "C18", "name": "Nyandarua", "lat": -0.1804, "lng": 36.5230, "pop": 638289},
            {"code": "C19", "name": "Nyeri", "lat": -0.4197, "lng": 36.9511, "pop": 759164},
            {"code": "C20", "name": "Kirinyaga", "lat": -0.4990, "lng": 37.2803, "pop": 610411},
            {"code": "C21", "name": "Murang'a", "lat": -0.7210, "lng": 37.1526, "pop": 1056640},
            {"code": "C22", "name": "Kiambu", "lat": -1.1714, "lng": 36.8356, "pop": 2417735},
            {"code": "C23", "name": "Turkana", "lat": 3.1167, "lng": 35.6000, "pop": 926976},
            {"code": "C24", "name": "West Pokot", "lat": 1.2333, "lng": 35.1167, "pop": 621241},
            {"code": "C25", "name": "Samburu", "lat": 1.2167, "lng": 36.9333, "pop": 310327},
            {"code": "C26", "name": "Trans Nzoia", "lat": 1.0167, "lng": 34.9500, "pop": 990341},
            {"code": "C27", "name": "Uasin Gishu", "lat": 0.5167, "lng": 35.2833, "pop": 1163186},
            {"code": "C28", "name": "Elgeyo-Marakwet", "lat": 0.8000, "lng": 35.5000, "pop": 454480},
            {"code": "C29", "name": "Nandi", "lat": 0.1833, "lng": 35.1000, "pop": 885711},
            {"code": "C30", "name": "Baringo", "lat": 0.5000, "lng": 35.9667, "pop": 666763},
            {"code": "C31", "name": "Laikipia", "lat": 0.3333, "lng": 36.7833, "pop": 518560},
            {"code": "C32", "name": "Nakuru", "lat": -0.3031, "lng": 36.0800, "pop": 2162202},
            {"code": "C33", "name": "Narok", "lat": -1.0833, "lng": 35.8667, "pop": 1157873},
            {"code": "C34", "name": "Kajiado", "lat": -1.8500, "lng": 36.7833, "pop": 1117840},
            {"code": "C35", "name": "Kericho", "lat": -0.3667, "lng": 35.2833, "pop": 901777},
            {"code": "C36", "name": "Bomet", "lat": -0.7833, "lng": 35.3333, "pop": 875689},
            {"code": "C37", "name": "Kakamega", "lat": 0.2833, "lng": 34.7500, "pop": 1867579},
            {"code": "C38", "name": "Vihiga", "lat": 0.0833, "lng": 34.7167, "pop": 590013},
            {"code": "C39", "name": "Bungoma", "lat": 0.5635, "lng": 34.5606, "pop": 1670570},
            {"code": "C40", "name": "Busia", "lat": 0.4608, "lng": 34.1115, "pop": 893681},
            {"code": "C41", "name": "Siaya", "lat": 0.0607, "lng": 34.2882, "pop": 993183},
            {"code": "C42", "name": "Kisumu", "lat": -0.0917, "lng": 34.7680, "pop": 1155574},
            {"code": "C43", "name": "Homa Bay", "lat": -0.5273, "lng": 34.4571, "pop": 1131950},
            {"code": "C44", "name": "Migori", "lat": -1.0634, "lng": 34.4731, "pop": 1116436},
            {"code": "C45", "name": "Kisii", "lat": -0.6817, "lng": 34.7667, "pop": 1266860},
            {"code": "C46", "name": "Nyamira", "lat": -0.5633, "lng": 34.9358, "pop": 605576},
            {"code": "C47", "name": "Nairobi", "lat": -1.2921, "lng": 36.8219, "pop": 4397073},
        ]
    )


settings = Settings()
