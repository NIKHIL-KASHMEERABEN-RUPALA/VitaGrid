"""
VitaGrid GOV - Sovereign Medical Protocols & Knowledge Base
Ingests national guidelines, WHO/CDC emergency response SOPs, and logistics mandates.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass
class ProtocolDocument:
    doc_id: str
    title: str
    category: str  # CLINICAL, SUPPLY_CHAIN, SURVEILLANCE, BIOLOGICAL
    authority: str
    version: str
    sections: Dict[str, str]  # section_title -> text_content


SOVEREIGN_NATIONAL_PROTOCOLS: List[ProtocolDocument] = [
    ProtocolDocument(
        doc_id="SOP-MOH-AMX-2025",
        title="National Pediatric Pneumonia & Severe Infection Antimicrobial Protocol",
        category="CLINICAL",
        authority="Ministry of Health - National Clinical Directorate",
        version="v3.4-2025",
        sections={
            "First Line Indication": "Amoxicillin 250mg dispersible tablets are the sovereign first-line treatment for fast-breathing pneumonia in children aged 2-59 months. Dosage: 25mg/kg twice daily for 5 days.",
            "Emergency Stockout Mitigation": "When county referral or sub-county hospital stock falls below 5 days of consumption velocity during a pediatric respiratory cluster, inter-facility transfer from regional strategic hubs is triggered automatically under Directive #882.",
            "Storage Requirements": "Store below 25°C in a dry place. Protect from moisture and direct sunlight.",
        },
    ),
    ProtocolDocument(
        doc_id="SOP-MOH-MAL-2026",
        title="National Malaria Surveillance, Vector Control & ACT Rationing Guidelines",
        category="SURVEILLANCE",
        authority="National Malaria Elimination Program (NMEP)",
        version="v5.1-2026",
        sections={
            "Epidemic Surge Threshold": "An epidemiological alert must be triggered when county R_t exceeds 1.15 for two consecutive reporting cycles or test positivity rate (TPR) exceeds 35% in sentinel health facilities.",
            "Preemptive Staging Protocol": "Upon alert verification, deploy 5,000 adult courses of Artemether/Lumefantrine (AL 20/120mg) and 2,500 Rapid Diagnostic Tests (mRDTs) to county sub-depots within 24 hours.",
            "Vector Control Intervention": "Indoor Residual Spraying (IRS) and biological larvicide application must be authorized by the County Executive Committee (CEC) Health Officer prior to aerial dissemination.",
        },
    ),
    ProtocolDocument(
        doc_id="SOP-MOH-COLD-2025",
        title="National Vaccine Cold-Chain Integrity & Thermal Excursion Protocol",
        category="SUPPLY_CHAIN",
        authority="National Expanded Programme on Immunization (EPI)",
        version="v4.0-2025",
        sections={
            "Temperature Range Mandate": "All cold-chain biologicals, including Insulin, BCG, Measles-Rubella, and Oral Polio Vaccine, must be maintained continuously between +2°C and +8°C.",
            "Thermal Excursion Incident Protocol": "If temperature exceeds +8°C for more than 4 continuous hours or reaches +12°C for any duration, stock quarantine must be enacted immediately. Do not discard without Shake Test and cold-chain coordinator clearance.",
            "Backup Power Contingency": "All Tier-1 and Tier-2 hubs must maintain secondary solar photovoltaic battery storage capable of 72 hours islanded operation.",
        },
    ),
    ProtocolDocument(
        doc_id="SOP-MOH-LOG-2026",
        title="Inter-County Health Resource Sharing & Mutual Aid Sovereign Mandate",
        category="LOGISTICS",
        authority="National Disaster Management Council & Council of Governors",
        version="v2.2-2026",
        sections={
            "Cross-Border Transfer Legal Framework": "Section 44 of the National Health Sovereignty Act authorizes emergency inter-county asset reallocation (medicines, oxygen cylinders, ICU personnel) when localized demand exceeds 85% capacity.",
            "Human-in-the-Loop Sign-off": "All logistics rebalance orders exceeding 2,000 units or involving inter-county transit require explicit cryptographic sign-off from the National Health Director or authorized County Health Director.",
            "Zero-PII Compliance": "No patient manifests, clinical charts, or identifying credentials may be attached to logistics waybills. Only aggregated stock codes and batch IDs are permissible.",
        },
    ),
]
