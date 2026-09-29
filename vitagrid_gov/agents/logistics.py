"""
VitaGrid GOV - Logistics & Multi-Echelon Supply Agent
Tracks stock across 5 distribution tiers (E1 Central to E5 Dispensary).
Runs stockout prediction, solves rebalancing math, and drafts Action Dockets.
"""

import asyncio
import logging
import time
from typing import Any, Dict, List
from vitagrid_gov.core.event_bus import event_bus, VitaGridEvent
from vitagrid_gov.core.feature_store import feature_store
from vitagrid_gov.models.stockout_model import stockout_model, StockoutPrediction
from vitagrid_gov.models.optimizer import logistics_optimizer, RebalanceTransferItem
from vitagrid_gov.core.config import settings

logger = logging.getLogger("vitagrid.logistics")


class LogisticsAgent:
    async def evaluate_supply_deficits(self, commodity_name: str = "Amoxicillin 250mg Dispersible") -> Dict[str, Any]:
        """
        Audits all facilities, identifies deficit nodes vs surplus nodes,
        and generates an optimized transfer proposal.
        """
        all_vectors = feature_store.get_all_vectors()
        deficit_nodes = []
        surplus_nodes = []

        for vec in all_vectors:
            pred: StockoutPrediction = stockout_model.predict(
                vector=vec,
                commodity_name=commodity_name,
                current_stock=int(vec.amox_stockout_runout_days * 120.0),
                base_daily_burn=120.0
            )

            # Look up county coords
            county_meta = next((c for c in settings.COUNTIES if c["code"] == vec.county_code), None)
            lat = county_meta["lat"] if county_meta else 0.0
            lng = county_meta["lng"] if county_meta else 0.0

            if pred.projected_runout_days < 7.0 or pred.risk_level in ["HIGH", "CRITICAL"]:
                deficit_nodes.append({
                    "facility_id": vec.facility_id,
                    "name": f"County Hospital {vec.county_code}",
                    "deficit_units": pred.recommended_reorder_units,
                    "runout_days": pred.projected_runout_days,
                    "lat": lat,
                    "lng": lng,
                })
            elif pred.projected_runout_days > 28.0:
                surplus_nodes.append({
                    "facility_id": vec.facility_id,
                    "name": f"Regional Depot {vec.county_code}",
                    "surplus_units": int(vec.amox_stockout_runout_days * 80.0),
                    "lat": lat,
                    "lng": lng,
                })

        # Run linear programming rebalance solver
        transfers: List[RebalanceTransferItem] = logistics_optimizer.solve_stock_rebalance(
            surplus_nodes=surplus_nodes,
            deficit_nodes=deficit_nodes,
            commodity_code="EML-MED-042",
            commodity_name=commodity_name
        )

        docket_proposal = {
            "proposal_id": f"DOCKET-PROP-{int(time.time())}",
            "commodity_name": commodity_name,
            "status": "QUEUED_FOR_HITL_MINISTERIAL_GATE",
            "statutory_sla_hours": 6,
            "created_at": time.time(),
            "total_transfers_planned": len(transfers),
            "transfers": [t.__dict__ for t in transfers],
        }

        # If urgent rebalance needed, publish alert
        if transfers:
            evt = VitaGridEvent(
                topic="agent.alert.logistics",
                event_type="REBALANCE_PROPOSAL_GENERATED",
                source_agent="AGENT-LOGISTICS-SUPPLY",
                payload=docket_proposal
            )
            await event_bus.publish(evt)

        return docket_proposal


logistics_agent = LogisticsAgent()
