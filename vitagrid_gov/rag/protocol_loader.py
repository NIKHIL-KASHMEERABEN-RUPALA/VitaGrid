"""
VitaGrid GOV - Sovereign Medical Protocols & Knowledge Ingestor
Ingests national clinical guidelines, WHO treatment manuals, and disaster logistics SOPs.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class ProtocolDocument:
    doc_id: str
    title: str
    category: str  # "EPIDEMIOLOGY", "SUPPLY_CHAIN", "CLINICAL_TREATMENT", "COLD_CHAIN"
    citation: str
    text_content: str
    statutory_sla_hours: int


SOVEREIGN_PROTOCOLS: List[ProtocolDocument] = [
    ProtocolDocument(
        doc_id="PROT-MALARIA-01",
        title="National Severe Malaria Clinical Management & Artemether/Lumefantrine Staging",
        category="CLINICAL_TREATMENT",
        citation="National Malaria Control Programme Guidelines 2024, Sec 3.4",
        text_content=(
            "In all cases of suspected severe Plasmodium falciparum malaria with danger signs "
            "(prostration, multiple convulsions, respiratory distress), parenteral artesunate is first-line "
            "at 2.4 mg/kg IV on admission, repeated at 12h and 24h. Rural health centers without IV capability "
            "must administer pre-referral rectal artesunate (100mg for infants, 400mg for children) "
            "and immediately initiate inter-facility transit dispatch. Buffer stock must never fall below "
            "a 14-day supply during seasonal monsoon rains."
        ),
        statutory_sla_hours=12
    ),
    ProtocolDocument(
        doc_id="PROT-COLD-CHAIN-02",
        title="Cold-Chain Excursion Emergency Intervention & Vaccine Lot Quarantine SOP",
        category="COLD_CHAIN",
        citation="National Expanded Programme on Immunization (EPI) SOP-CC-09",
        text_content=(
            "The mandatory sovereign storage corridor for all live-attenuated and mRNA vaccines is +2.0°C to +8.0°C. "
            "If an IoT sensor logs a temperature breach exceeding +8.0°C for >45 cumulative minutes, the facility in-charge "
            "must immediately activate emergency ice-pack lined cold-boxes, inspect the compressor circuit, "
            "and flag the affected vaccine lot for digital quarantine. Administration of exposed vials is strictly prohibited "
            "pending shake-test and ministerial QA clearance."
        ),
        statutory_sla_hours=4
    ),
    ProtocolDocument(
        doc_id="PROT-REBALANCE-03",
        title="Inter-County Stock Mutual Aid & Emergency Rebalancing Logistics Protocol",
        category="SUPPLY_CHAIN",
        citation="Public Health Logistics Regulations 2023, Directive 8(B)",
        text_content=(
            "When a Level 4 or Level 5 hospital projects stockout within 5 days (<5d runway) while neighboring subcounties "
            "maintain >45 days of buffer stock, the Regional Logistics Hub is empowered to generate an automated "
            "Rebalance Transfer Docket. The Ministerial Human-in-the-Loop authorization gate must be cleared "
            "within 6 hours of generation, after which logistics units must dispatch within 120 minutes."
        ),
        statutory_sla_hours=6
    ),
    ProtocolDocument(
        doc_id="PROT-CHOLERA-04",
        title="Acute Watery Diarrhea & Cholera Epidemic Containment Guideline",
        category="EPIDEMIOLOGY",
        citation="National Outbreak Response Protocol, Cholera Action Guideline 2025",
        text_content=(
            "Upon syndromic cluster detection of 3 or more clustered rice-water stool presentations in any single subcounty, "
            "an automatic Defcon-3 watch is triggered. Immediate logistics dispatch of Cholera Treatment Kits (Ringer's Lactate, "
            "ORS, Zinc, Doxycycline, Water Treatment Tablets) is staged at the nearest vertiport or regional warehouse. "
            "Safe water point testing must commence within 12 hours of alert confirmation."
        ),
        statutory_sla_hours=12
    ),
    ProtocolDocument(
        doc_id="PROT-ROSTER-05",
        title="Surge Capacity Clinician Deployment & Nurse-to-Patient Safety Ratios",
        category="CLINICAL_TREATMENT",
        citation="Ministry of Health Emergency Staffing Framework 2024",
        text_content=(
            "Under Defcon-3 or higher, acute bed capacity exceeding 85% utilization triggers an emergency staffing reallocation. "
            "Nurse-to-patient ratios must not exceed 1:6 in acute medical wards and 1:2 in Intensive Care Units (ICU). "
            "Medical directors may mandate cross-district deployment of reserve clinician pools for a maximum period "
            "of 14 consecutive days with mandatory 48-hour decompression rest."
        ),
        statutory_sla_hours=24
    ),
]


class ProtocolLoader:
    def __init__(self):
        self._protocols = {p.doc_id: p for p in SOVEREIGN_PROTOCOLS}

    def get_all(self) -> List[ProtocolDocument]:
        return list(self._protocols.values())

    def get_by_id(self, doc_id: str) -> Optional[ProtocolDocument]:
        return self._protocols.get(doc_id)

    def search_by_category(self, category: str) -> List[ProtocolDocument]:
        return [p for p in self._protocols.values() if p.category == category]


protocol_loader = ProtocolLoader()
