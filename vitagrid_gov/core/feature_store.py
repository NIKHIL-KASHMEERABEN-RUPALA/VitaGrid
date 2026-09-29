"""
VitaGrid GOV - Sovereign 28+ Indicator Feature Store
Maintains real-time aggregated feature vectors across 47 health zones and 2,840 PHCs.
Supplies low-latency tensors to XGBoost, Cori Rt, and TreeSHAP explainability models.
"""

from dataclasses import dataclass, asdict
import math
import time
from typing import Any, Dict, List, Optional
from vitagrid_gov.core.config import settings


@dataclass
class FacilityFeatureVector:
    facility_id: str
    county_code: str
    echelon: str
    timestamp: float
    
    # 1-7: Epidemiological & Inflow Features
    daily_admissions_7d_avg: float
    confirmed_infections_7d_sum: float
    positivity_rate_shift: float
    syndromic_ari_growth_velocity: float
    r_t_current_estimate: float
    doubling_time_days: float
    outbreak_cluster_density: float

    # 8-14: Inventory & Supply Velocity Features
    amox_stockout_runout_days: float
    antimalarial_runout_days: float
    iv_fluids_reserve_ratio: float
    lead_time_variance_days: float
    supplier_fill_rate_pct: float
    days_since_last_replenishment: float
    quarantine_or_expired_ratio: float

    # 15-21: Capacity, Beds & Staffing Features
    total_acute_beds: int
    occupied_acute_beds: int
    bed_utilization_ratio: float
    icu_ventilator_occupancy_ratio: float
    clinician_on_shift_count: int
    clinician_fatigue_index: float
    unattended_triage_count: int

    # 22-28+: Cold-Chain & Environmental Features
    cold_chain_mean_temp_celsius: float
    cold_chain_excursion_minutes_24h: float
    compressor_vibration_strain_score: float
    backup_solar_battery_state_pct: float
    ambient_temperature_celsius: float
    relative_humidity_pct: float
    seasonal_precipitation_anomaly: float

    def to_feature_list(self) -> List[float]:
        """Flattens 28 numerical indicators into an ordered feature list for model ingestion."""
        return [
            self.daily_admissions_7d_avg,
            self.confirmed_infections_7d_sum,
            self.positivity_rate_shift,
            self.syndromic_ari_growth_velocity,
            self.r_t_current_estimate,
            self.doubling_time_days,
            self.outbreak_cluster_density,
            self.amox_stockout_runout_days,
            self.antimalarial_runout_days,
            self.iv_fluids_reserve_ratio,
            self.lead_time_variance_days,
            self.supplier_fill_rate_pct,
            self.days_since_last_replenishment,
            self.quarantine_or_expired_ratio,
            float(self.total_acute_beds),
            float(self.occupied_acute_beds),
            self.bed_utilization_ratio,
            self.icu_ventilator_occupancy_ratio,
            float(self.clinician_on_shift_count),
            self.clinician_fatigue_index,
            float(self.unattended_triage_count),
            self.cold_chain_mean_temp_celsius,
            self.cold_chain_excursion_minutes_24h,
            self.compressor_vibration_strain_score,
            self.backup_solar_battery_state_pct,
            self.ambient_temperature_celsius,
            self.relative_humidity_pct,
            self.seasonal_precipitation_anomaly,
        ]


class FeatureStore:
    FEATURE_NAMES = [
        "daily_admissions_7d_avg",
        "confirmed_infections_7d_sum",
        "positivity_rate_shift",
        "syndromic_ari_growth_velocity",
        "r_t_current_estimate",
        "doubling_time_days",
        "outbreak_cluster_density",
        "amox_stockout_runout_days",
        "antimalarial_runout_days",
        "iv_fluids_reserve_ratio",
        "lead_time_variance_days",
        "supplier_fill_rate_pct",
        "days_since_last_replenishment",
        "quarantine_or_expired_ratio",
        "total_acute_beds",
        "occupied_acute_beds",
        "bed_utilization_ratio",
        "icu_ventilator_occupancy_ratio",
        "clinician_on_shift_count",
        "clinician_fatigue_index",
        "unattended_triage_count",
        "cold_chain_mean_temp_celsius",
        "cold_chain_excursion_minutes_24h",
        "compressor_vibration_strain_score",
        "backup_solar_battery_state_pct",
        "ambient_temperature_celsius",
        "relative_humidity_pct",
        "seasonal_precipitation_anomaly",
    ]

    def __init__(self):
        self._store: Dict[str, FacilityFeatureVector] = {}
        self._county_aggregates: Dict[str, Dict[str, float]] = {}
        self._seed_baseline_features()

    def _seed_baseline_features(self):
        """Seeds realistic baseline feature vectors for facilities across 47 health zones."""
        now = time.time()
        for c in settings.COUNTIES:
            code = c["code"]
            fac_id = f"PHC-{code}-001"
            # Introduce realistic variance
            is_hotspot = code in ["C47", "C42", "C01"]
            r_t = 1.38 if is_hotspot else 0.94
            bed_occ = 0.88 if is_hotspot else 0.65
            fatigue = 0.78 if is_hotspot else 0.42
            runout = 4.2 if is_hotspot else 18.5
            
            vec = FacilityFeatureVector(
                facility_id=fac_id,
                county_code=code,
                echelon="E3_COUNTY_REFERRAL",
                timestamp=now,
                daily_admissions_7d_avg=45.2 if is_hotspot else 16.0,
                confirmed_infections_7d_sum=284.0 if is_hotspot else 62.0,
                positivity_rate_shift=0.14 if is_hotspot else -0.02,
                syndromic_ari_growth_velocity=0.22 if is_hotspot else 0.03,
                r_t_current_estimate=r_t,
                doubling_time_days=6.8 if is_hotspot else 24.0,
                outbreak_cluster_density=0.82 if is_hotspot else 0.20,
                amox_stockout_runout_days=runout,
                antimalarial_runout_days=runout * 1.2,
                iv_fluids_reserve_ratio=0.35 if is_hotspot else 0.88,
                lead_time_variance_days=3.4,
                supplier_fill_rate_pct=91.5,
                days_since_last_replenishment=11.0,
                quarantine_or_expired_ratio=0.012,
                total_acute_beds=180 if is_hotspot else 85,
                occupied_acute_beds=int(180 * bed_occ) if is_hotspot else int(85 * bed_occ),
                bed_utilization_ratio=bed_occ,
                icu_ventilator_occupancy_ratio=0.82 if is_hotspot else 0.45,
                clinician_on_shift_count=38 if is_hotspot else 16,
                clinician_fatigue_index=fatigue,
                unattended_triage_count=18 if is_hotspot else 2,
                cold_chain_mean_temp_celsius=4.6,
                cold_chain_excursion_minutes_24h=12.0 if is_hotspot else 0.0,
                compressor_vibration_strain_score=0.28,
                backup_solar_battery_state_pct=94.0,
                ambient_temperature_celsius=27.5,
                relative_humidity_pct=68.0,
                seasonal_precipitation_anomaly=1.15,
            )
            self._store[fac_id] = vec

    def put_vector(self, vector: FacilityFeatureVector):
        self._store[vector.facility_id] = vector

    def get_vector(self, facility_id: str) -> Optional[FacilityFeatureVector]:
        return self._store.get(facility_id)

    def get_all_vectors(self) -> List[FacilityFeatureVector]:
        return list(self._store.values())

    def get_county_matrix(self, county_code: str) -> List[FacilityFeatureVector]:
        return [v for v in self._store.values() if v.county_code == county_code]


feature_store = FeatureStore()
