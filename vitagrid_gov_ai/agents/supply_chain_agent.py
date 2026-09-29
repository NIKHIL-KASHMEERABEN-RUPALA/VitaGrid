"""
VitaGrid GOV - Supply Chain Optimizer Agent
Inventory forecasting, run-out date prediction, and multi-echelon rebalancing recommendations.
"""

from typing import Any, Dict, List, Tuple
from vitagrid_gov_ai.agents.base import BaseSovereignAgent, AgentTool
from vitagrid_gov_ai.models.forecasting import stockout_forecaster, StockoutForecastResult
from vitagrid_gov_ai.models.optimizer import optimization_engine, RebalanceTransferMove
from vitagrid_gov_ai.data.schemas import MedicineStock


class SupplyChainOptimizerAgent(BaseSovereignAgent):
    """
    Monitors all 5 distribution echelons to guarantee zero stockout of life-saving medicines.
    Synthesizes transfer proposals when facilities fall below safety stock.
    """

    def __init__(self):
        super().__init__(
            agent_id="AGENT-SUPPLY-CHAIN-01",
            name="Sovereign Supply Chain Optimizer",
            role="Autonomous Pharmaceutical Logistics & Multi-Echelon Rebalancing",
        )
        self._setup_tools()

    def _setup_tools(self):
        self.register_tool(
            AgentTool(
                name="forecast_stock_depletion",
                description="Forecasts run-out days and required reorder quantities considering active outbreaks.",
                func=self._tool_forecast,
                parameters_schema={"stock": "MedicineStock", "local_r_t": "float", "outbreak_active": "bool"},
            )
        )
        self.register_tool(
            AgentTool(
                name="solve_logistics_rebalance",
                description="Solves linear programming transport problem between surplus hubs and deficit facilities.",
                func=self._tool_rebalance,
                parameters_schema={
                    "item_code": "str",
                    "deficit_facilities": "List[Tuple]",
                    "surplus_facilities": "List[Tuple]",
                },
            )
        )

    def _tool_forecast(self, stock: Any, local_r_t: float, outbreak_active: bool) -> StockoutForecastResult:
        if isinstance(stock, dict):
            from vitagrid_gov_ai.data.schemas import MedicineStock
            stock_obj = MedicineStock(**stock)
            return stockout_forecaster.forecast_depletion(stock_obj, local_r_t=local_r_t, outbreak_active=outbreak_active)
        return stockout_forecaster.forecast_depletion(stock, local_r_t=local_r_t, outbreak_active=outbreak_active)

    def _tool_rebalance(
        self,
        item_code: str,
        deficit_facilities: List[Tuple[str, int, float, float]],
        surplus_facilities: List[Tuple[str, int, float, float]],
    ) -> List[RebalanceTransferMove]:
        return optimization_engine.optimize_stock_rebalance(item_code, deficit_facilities, surplus_facilities)

    async def process_task(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Processes inventories, correlates with surveillance alerts, and produces rebalance moves.
        """
        self.state.status = "RUNNING"
        stocks: List[Any] = context.get("stocks", [])
        outbreak_counties: Dict[str, float] = context.get("outbreak_r_t_by_county", {})
        facility_coords: Dict[str, Tuple[float, float]] = context.get("facility_coords", {})

        critical_forecasts: List[StockoutForecastResult] = []
        deficit_by_item: Dict[str, List[Tuple[str, int, float, float]]] = {}
        surplus_by_item: Dict[str, List[Tuple[str, int, float, float]]] = {}

        for stock in stocks:
            c_code = stock.get("county_code") if isinstance(stock, dict) else stock.county_code
            f_id = stock.get("facility_id") if isinstance(stock, dict) else stock.facility_id
            i_code = stock.get("item_code") if isinstance(stock, dict) else stock.item_code
            balance = stock.get("current_pack_balance") if isinstance(stock, dict) else stock.current_pack_balance

            local_rt = outbreak_counties.get(c_code, 1.0)
            is_outbreak = c_code in outbreak_counties
            forecast = self.call_tool("forecast_stock_depletion", stock=stock, local_r_t=local_rt, outbreak_active=is_outbreak)

            coords = facility_coords.get(f_id, (-1.29, 36.82))

            if forecast.urgency_tier in ("CRITICAL", "WARNING"):
                critical_forecasts.append(forecast)
                deficit_by_item.setdefault(i_code, []).append(
                    (f_id, forecast.reorder_recommended_quantity, coords[0], coords[1])
                )
            elif forecast.projected_runout_days > 45.0:
                # Excess inventory available for rebalancing
                avail_excess = int(balance * 0.40)
                if avail_excess > 50:
                    surplus_by_item.setdefault(i_code, []).append(
                        (f_id, avail_excess, coords[0], coords[1])
                    )

        # Optimize rebalance for each deficit item
        proposed_transfers: List[RebalanceTransferMove] = []
        for item_code, deficits in deficit_by_item.items():
            surpluses = surplus_by_item.get(item_code, [])
            if deficits and surpluses:
                moves = self.call_tool(
                    "solve_logistics_rebalance",
                    item_code=item_code,
                    deficit_facilities=deficits,
                    surplus_facilities=surpluses,
                )
                proposed_transfers.extend(moves)

        self.state.status = "COMPLETED"
        return {
            "agent_id": self.agent_id,
            "total_items_audited": len(stocks),
            "critical_stockouts_detected": len(critical_forecasts),
            "critical_items": [
                {
                    "item_code": cf.item_code,
                    "item_name": cf.item_name,
                    "facility_id": cf.facility_id,
                    "runout_days": cf.projected_runout_days,
                    "urgency": cf.urgency_tier,
                }
                for cf in critical_forecasts[:5]
            ],
            "proposed_transfers": [
                {
                    "item_code": m.item_code,
                    "source": m.source_facility_id,
                    "target": m.target_facility_id,
                    "quantity": m.transfer_quantity,
                    "eta_hours": m.estimated_transit_hours,
                    "distance_km": m.transit_distance_km,
                }
                for m in proposed_transfers
            ],
        }
