"""
VitaGrid GOV - National Health Data Schemas
Covers 47 Sovereign Counties, 5 Distribution Echelons, and IoT Telemetry.
"""

from dataclasses import dataclass, field
from enum import Enum
import time
from typing import Dict, List, Optional


class EchelonTier(str, Enum):
    TIER_1_CENTRAL = "CENTRAL_MEDICAL_STORE"
    TIER_2_REGIONAL = "REGIONAL_STRATEGIC_HUB"
    TIER_3_COUNTY = "COUNTY_DEPOT_REFERRAL"
    TIER_4_SUBCOUNTY = "SUBCOUNTY_HOSPITAL"
    TIER_5_PHC = "RURAL_PRIMARY_HEALTHCARE_CENTER"


class DiseaseCategory(str, Enum):
    RESPIRATORY_SURGE = "RESPIRATORY_SURGE"
    VECTOR_BORNE_MALARIA = "VECTOR_BORNE_MALARIA"
    ACUTE_WATERY_DIARRHEA = "ACUTE_WATERY_DIARRHEA"
    HEMORRHAGIC_FEVER = "HEMORRHAGIC_FEVER"
    VACCINE_PREVENTABLE = "VACCINE_PREVENTABLE"


@dataclass
class FacilityTelemetry:
    facility_id: str
    facility_name: str
    county_code: str
    county_name: str
    echelon: EchelonTier
    latitude: float
    longitude: float
    total_beds: int
    occupied_beds: int
    icu_total: int
    icu_occupied: int
    ventilators_total: int
    ventilators_in_use: int
    clinicians_on_shift: int
    oxygen_reserve_liters: float
    last_reported_utc: float = field(default_factory=time.time)

    @property
    def icu_utilization_pct(self) -> float:
        if self.icu_total == 0:
            return 0.0
        return round((self.icu_occupied / self.icu_total) * 100.0, 1)

    @property
    def bed_utilization_pct(self) -> float:
        if self.total_beds == 0:
            return 0.0
        return round((self.occupied_beds / self.total_beds) * 100.0, 1)


@dataclass
class MedicineStock:
    item_code: str
    name: str
    category: str  # Antibiotic, Antimalarial, Maternal, Vaccine, Critical Care
    facility_id: str
    county_code: str
    current_pack_balance: int
    unit_pack_size: int
    daily_consumption_velocity: float  # packs/day
    safety_buffer_days: int
    batch_lot_number: str
    expiry_timestamp: float
    is_cold_chain_required: bool = False

    @property
    def days_of_stock_remaining(self) -> float:
        if self.daily_consumption_velocity <= 0.001:
            return 999.0
        return round(self.current_pack_balance / self.daily_consumption_velocity, 1)


@dataclass
class ColdChainSensorReading:
    sensor_id: str
    facility_id: str
    county_code: str
    unit_description: str
    temperature_celsius: float
    target_min_celsius: float = 2.0
    target_max_celsius: float = 8.0
    compressor_status: str = "NORMAL"  # NORMAL, STRAINED, FAILED
    battery_level_pct: float = 98.5
    ambient_temp_celsius: float = 28.4
    timestamp_utc: float = field(default_factory=time.time)

    @property
    def is_thermal_excursion(self) -> bool:
        return (
            self.temperature_celsius < self.target_min_celsius
            or self.temperature_celsius > self.target_max_celsius
        )


@dataclass
class SyndromicSurveillancePoint:
    reporting_date: str  # YYYY-MM-DD
    county_code: str
    facility_id: str
    disease: DiseaseCategory
    suspected_cases: int
    confirmed_cases: int
    rapid_tests_performed: int
    admissions: int
    deaths: int


@dataclass
class NationalAlertItem:
    alert_id: str
    timestamp_utc: float
    county_code: str
    county_name: str
    title: str
    category: str  # epidemiology, logistics, resource, security
    urgency_level: str  # low, medium, high, critical
    description: str
    metric_observed: str
    action_required: str
    transfer_proposal_id: Optional[str] = None
