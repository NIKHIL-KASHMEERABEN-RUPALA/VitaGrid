"""
VitaGrid GOV - National Scale Synthetic Telemetry Generator
Generates realistic sovereign data across 47 Counties, 5 Echelons, and IoT Nodes.
"""

import math
import random
import time
from typing import Dict, List, Tuple
from vitagrid_gov_ai.data.schemas import (
    ColdChainSensorReading,
    DiseaseCategory,
    EchelonTier,
    FacilityTelemetry,
    MedicineStock,
    NationalAlertItem,
    SyndromicSurveillancePoint,
)

# 47 Sovereign Counties (Kenya / East Africa administrative grid model)
COUNTY_PROFILES = [
    ("KE-01", "Mombasa", -4.0435, 39.6682, 1208000),
    ("KE-02", "Kwale", -4.1816, 39.4606, 866820),
    ("KE-03", "Kilifi", -3.5107, 39.9093, 1453787),
    ("KE-04", "Tana River", -1.5000, 39.8000, 315943),
    ("KE-05", "Lamu", -2.2717, 40.9020, 143920),
    ("KE-06", "Taita Taveta", -3.3167, 38.3500, 340671),
    ("KE-07", "Garissa", -0.4532, 39.6460, 841353),
    ("KE-08", "Wajir", 1.7471, 40.0573, 781263),
    ("KE-09", "Mandera", 3.9366, 41.8670, 867457),
    ("KE-10", "Marsabit", 2.3347, 37.9900, 459785),
    ("KE-11", "Isiolo", 0.3546, 37.5822, 268002),
    ("KE-12", "Meru", 0.0463, 37.6559, 1545714),
    ("KE-13", "Tharaka-Nithi", -0.2970, 37.8740, 393177),
    ("KE-14", "Embu", -0.5344, 37.4578, 608599),
    ("KE-15", "Kitui", -1.3683, 38.0106, 1136187),
    ("KE-16", "Machakos", -1.5177, 37.2634, 1421932),
    ("KE-17", "Makueni", -1.7833, 37.6333, 987653),
    ("KE-18", "Nyandarua", -0.1804, 36.5230, 638289),
    ("KE-19", "Nyeri", -0.4167, 36.9500, 759164),
    ("KE-20", "Kirinyaga", -0.4989, 37.2803, 610411),
    ("KE-21", "Murang'a", -0.7167, 37.1500, 1056640),
    ("KE-22", "Kiambu", -1.1714, 36.8356, 2417735),
    ("KE-23", "Turkana", 3.1167, 35.6000, 926976),
    ("KE-24", "West Pokot", 1.2333, 35.1167, 621241),
    ("KE-25", "Samburu", 1.2833, 36.9333, 310327),
    ("KE-26", "Trans Nzoia", 1.0167, 35.0000, 990341),
    ("KE-27", "Uasin Gishu", 0.5167, 35.2833, 1163186),
    ("KE-28", "Elgeyo-Marakwet", 0.8000, 35.5000, 454480),
    ("KE-29", "Nandi", 0.1833, 35.1000, 888030),
    ("KE-30", "Baringo", 0.4667, 35.9667, 666763),
    ("KE-31", "Laikipia", 0.4333, 36.7833, 518560),
    ("KE-32", "Nakuru", -0.3031, 36.0800, 2162202),
    ("KE-33", "Narok", -1.0833, 35.8667, 1157873),
    ("KE-34", "Kajiado", -1.8500, 36.7833, 1117840),
    ("KE-35", "Kericho", -0.3667, 35.2833, 901777),
    ("KE-36", "Bomet", -0.7833, 35.3500, 875689),
    ("KE-37", "Kakamega", 0.2833, 34.7500, 1867579),
    ("KE-38", "Vihiga", 0.0833, 34.7167, 590013),
    ("KE-39", "Bungoma", 0.5667, 34.5667, 1670570),
    ("KE-40", "Busia", 0.4608, 34.1115, 893681),
    ("KE-41", "Siaya", 0.0607, 34.2878, 993183),
    ("KE-42", "Kisumu", -0.0917, 34.7680, 1155574),
    ("KE-43", "Homa Bay", -0.5273, 34.4571, 1131950),
    ("KE-44", "Migori", -1.0634, 34.4731, 1116436),
    ("KE-45", "Kisii", -0.6817, 34.7667, 1266860),
    ("KE-46", "Nyamira", -0.5633, 34.9358, 605576),
    ("KE-47", "Nairobi", -1.2921, 36.8219, 4397073),
]

CORE_MEDICINES = [
    ("MED-AMX-250", "Amoxicillin 250mg Dispersible", "Antibiotic", 100, False),
    ("MED-AL-6X4", "Artemether/Lumefantrine 20/120mg", "Antimalarial", 30, False),
    ("MED-OXT-10", "Oxytocin 10 IU/ml Inj", "Maternal Health", 10, True),
    ("MED-CEF-1G", "Ceftriaxone 1g Powder Inj", "Antibiotic", 10, False),
    ("MED-INS-HUM", "Human Insulin NPH 100IU/ml", "Endocrine", 5, True),
    ("MED-VAC-BCG", "BCG Tuberculosis Vaccine", "Vaccine", 20, True),
    ("MED-VAC-MR", "Measles-Rubella Lyophilized", "Vaccine", 10, True),
    ("MED-ORS-ZINC", "Oral Rehydration Salts + Zinc Co-pack", "Gastrointestinal", 50, False),
    ("MED-SAL-INH", "Salbutamol 100mcg Inhaler", "Respiratory", 1, False),
    ("MED-RAB-VAC", "Anti-Rabies Purified Vero Cell", "Biological", 5, True),
]


class NationalSyntheticDataGenerator:
    """Generates synthetic sovereign health datasets for testing and verification."""

    def __init__(self, seed: int = 42):
        self.rng = random.Random(seed)

    def generate_facilities(self) -> List[FacilityTelemetry]:
        facilities: List[FacilityTelemetry] = []

        # 1. Central Medical Store in Nairobi
        facilities.append(
            FacilityTelemetry(
                facility_id="FAC-CMS-001",
                facility_name="National Central Medical Stores Depot",
                county_code="KE-47",
                county_name="Nairobi",
                echelon=EchelonTier.TIER_1_CENTRAL,
                latitude=-1.2921,
                longitude=36.8219,
                total_beds=0,
                occupied_beds=0,
                icu_total=0,
                icu_occupied=0,
                ventilators_total=0,
                ventilators_in_use=0,
                clinicians_on_shift=45,
                oxygen_reserve_liters=500000.0,
            )
        )

        # 2. Regional Strategic Hubs (Mombasa, Kisumu, Eldoret, Nakuru)
        reg_hubs = [
            ("FAC-HUB-MSA", "Coast Regional Strategic Logistics Enclave", "KE-01", "Mombasa", -4.0435, 39.6682),
            ("FAC-HUB-KSM", "Lake Victoria Regional Strategic Hub", "KE-42", "Kisumu", -0.0917, 34.7680),
            ("FAC-HUB-ELD", "Rift North Strategic Medical Depot", "KE-27", "Uasin Gishu", 0.5167, 35.2833),
            ("FAC-HUB-NKR", "Central Rift Strategic Hub", "KE-32", "Nakuru", -0.3031, 36.0800),
        ]
        for fid, name, c_code, c_name, lat, lon in reg_hubs:
            facilities.append(
                FacilityTelemetry(
                    facility_id=fid,
                    facility_name=name,
                    county_code=c_code,
                    county_name=c_name,
                    echelon=EchelonTier.TIER_2_REGIONAL,
                    latitude=lat,
                    longitude=lon,
                    total_beds=0,
                    occupied_beds=0,
                    icu_total=0,
                    icu_occupied=0,
                    ventilators_total=0,
                    ventilators_in_use=0,
                    clinicians_on_shift=30,
                    oxygen_reserve_liters=250000.0,
                )
            )

        # 3. County Level-5 Hospitals for each county
        for c_code, c_name, lat, lon, pop in COUNTY_PROFILES:
            beds = int(pop / 3000) + 120
            occ = int(beds * self.rng.uniform(0.70, 0.94))
            icu_tot = max(6, int(beds * 0.08))
            # Inject stress in Machakos and Garissa
            if c_code == "KE-16":  # Machakos
                icu_occ = int(icu_tot * 0.92)  # High stress
            elif c_code == "KE-07":  # Garissa
                icu_occ = int(icu_tot * 0.88)
            else:
                icu_occ = int(icu_tot * self.rng.uniform(0.40, 0.80))

            vents = max(4, int(icu_tot * 0.85))
            vents_in_use = min(vents, int(icu_occ * 0.9))

            facilities.append(
                FacilityTelemetry(
                    facility_id=f"FAC-{c_code}-L5",
                    facility_name=f"{c_name} County Referral & Teaching Hospital",
                    county_code=c_code,
                    county_name=c_name,
                    echelon=EchelonTier.TIER_3_COUNTY,
                    latitude=lat,
                    longitude=lon,
                    total_beds=beds,
                    occupied_beds=occ,
                    icu_total=icu_tot,
                    icu_occupied=icu_occ,
                    ventilators_total=vents,
                    ventilators_in_use=vents_in_use,
                    clinicians_on_shift=int(beds * 0.15),
                    oxygen_reserve_liters=round(self.rng.uniform(15000.0, 45000.0), 1),
                )
            )

            # 4. Add 2 Primary Healthcare Centers per County (Echelon Tier 5)
            for phc_idx in (1, 2):
                phc_beds = self.rng.randint(12, 35)
                facilities.append(
                    FacilityTelemetry(
                        facility_id=f"FAC-{c_code}-PHC{phc_idx}",
                        facility_name=f"{c_name} Ward-{phc_idx} Primary Health Dispensary",
                        county_code=c_code,
                        county_name=c_name,
                        echelon=EchelonTier.TIER_5_PHC,
                        latitude=lat + self.rng.uniform(-0.15, 0.15),
                        longitude=lon + self.rng.uniform(-0.15, 0.15),
                        total_beds=phc_beds,
                        occupied_beds=int(phc_beds * self.rng.uniform(0.4, 0.8)),
                        icu_total=0,
                        icu_occupied=0,
                        ventilators_total=0,
                        ventilators_in_use=0,
                        clinicians_on_shift=self.rng.randint(3, 7),
                        oxygen_reserve_liters=round(self.rng.uniform(800.0, 3000.0), 1),
                    )
                )

        return facilities

    def generate_inventory(self, facilities: List[FacilityTelemetry]) -> List[MedicineStock]:
        stocks: List[MedicineStock] = []
        for fac in facilities:
            for code, name, category, pack_size, is_cc in CORE_MEDICINES:
                # Scale velocity by facility echelon
                if fac.echelon == EchelonTier.TIER_1_CENTRAL:
                    velocity = self.rng.uniform(400.0, 1200.0)
                    balance = int(velocity * self.rng.uniform(60, 120))
                elif fac.echelon == EchelonTier.TIER_2_REGIONAL:
                    velocity = self.rng.uniform(150.0, 450.0)
                    balance = int(velocity * self.rng.uniform(30, 60))
                elif fac.echelon == EchelonTier.TIER_3_COUNTY:
                    velocity = self.rng.uniform(25.0, 80.0)
                    # Force critical stockout scenario for Amoxicillin in Machakos Referral
                    if fac.county_code == "KE-16" and code == "MED-AMX-250":
                        balance = 68  # 1.1 days left!
                        velocity = 60.0
                    else:
                        balance = int(velocity * self.rng.uniform(12, 45))
                else:  # PHC
                    velocity = self.rng.uniform(2.0, 8.0)
                    balance = int(velocity * self.rng.uniform(7, 30))

                stocks.append(
                    MedicineStock(
                        item_code=code,
                        name=name,
                        category=category,
                        facility_id=fac.facility_id,
                        county_code=fac.county_code,
                        current_pack_balance=balance,
                        unit_pack_size=pack_size,
                        daily_consumption_velocity=round(velocity, 2),
                        safety_buffer_days=14,
                        batch_lot_number=f"BN-{code[-3:]}-{self.rng.randint(1000, 9999)}",
                        expiry_timestamp=time.time() + (self.rng.randint(180, 720) * 86400),
                        is_cold_chain_required=is_cc,
                    )
                )
        return stocks

    def generate_cold_chain_readings(self, facilities: List[FacilityTelemetry]) -> List[ColdChainSensorReading]:
        readings: List[ColdChainSensorReading] = []
        for fac in facilities:
            # Cold chain sensors at Central, Regional, and County hospitals
            if fac.echelon in (EchelonTier.TIER_1_CENTRAL, EchelonTier.TIER_2_REGIONAL, EchelonTier.TIER_3_COUNTY):
                # Anomaly injection for Garissa
                if fac.county_code == "KE-07":
                    temp = 9.8  # Excursion above 8.0 C!
                    status = "STRAINED"
                else:
                    temp = round(self.rng.uniform(3.2, 5.8), 2)
                    status = "NORMAL"

                readings.append(
                    ColdChainSensorReading(
                        sensor_id=f"SENS-CC-{fac.facility_id}",
                        facility_id=fac.facility_id,
                        county_code=fac.county_code,
                        unit_description=f"{fac.facility_name} Cold Enclave Bank A",
                        temperature_celsius=temp,
                        target_min_celsius=2.0,
                        target_max_celsius=8.0,
                        compressor_status=status,
                        battery_level_pct=round(self.rng.uniform(85.0, 99.9), 1),
                        ambient_temp_celsius=round(self.rng.uniform(25.0, 36.0), 1),
                    )
                )
        return readings

    def generate_syndromic_history(self, days: int = 21) -> List[SyndromicSurveillancePoint]:
        """Generates synthetic surveillance history showing an impending surge in Machakos."""
        points: List[SyndromicSurveillancePoint] = []
        now = time.time()
        for d in range(days, -1, -1):
            day_str = time.strftime("%Y-%m-%d", time.gmtime(now - (d * 86400)))
            for c_code, c_name, _, _, _ in COUNTY_PROFILES[:10]:
                base_cases = self.rng.randint(15, 35)
                # Introduce exponential surge in Machakos (KE-16) for Acute Diarrheal/Respiratory
                if c_code == "KE-16":
                    surge_factor = math.exp((21 - d) * 0.12)
                    cases = int(base_cases * surge_factor)
                    tests = int(cases * 1.5)
                    pos = int(cases * 0.75)
                else:
                    cases = base_cases
                    tests = int(cases * 1.8)
                    pos = int(cases * 0.22)

                points.append(
                    SyndromicSurveillancePoint(
                        reporting_date=day_str,
                        county_code=c_code,
                        facility_id=f"FAC-{c_code}-L5",
                        disease=DiseaseCategory.RESPIRATORY_SURGE,
                        suspected_cases=cases,
                        confirmed_cases=pos,
                        rapid_tests_performed=tests,
                        admissions=int(pos * 0.3),
                        deaths=max(0, int(pos * 0.02)),
                    )
                )
        return points


data_generator = NationalSyntheticDataGenerator()
