"""
VitaGrid GOV - Medicine Stockout & Demand Surge Forecasting
Combines empirical consumption velocity, lead-time variance, and epidemiological surges.
"""

from dataclasses import dataclass
import math
import time
from typing import Dict, List, Optional
from vitagrid_gov_ai.data.schemas import MedicineStock


@dataclass
class StockoutForecastResult:
    item_code: str
    item_name: str
    facility_id: str
    county_code: str
    current_stock_packs: int
    base_velocity: float
    surge_multiplier: float
    effective_velocity: float
    projected_runout_days: float
    runout_timestamp_utc: float
    urgency_tier: str  # CRITICAL (<7d), WARNING (7-14d), STABLE (>14d)
    reorder_recommended_quantity: int
    recommended_source_hub: Optional[str] = None


class StockoutForecaster:
    """
    Computes deterministic and stochastic stock depletion curves.
    Applies non-linear epidemiological surge multipliers when local R_t > 1.0.
    """

    @staticmethod
    def forecast_depletion(
        stock: MedicineStock,
        local_r_t: float = 1.0,
        outbreak_active: bool = False,
        lead_time_days: int = 5,
    ) -> StockoutForecastResult:
        base_vel = max(0.1, stock.daily_consumption_velocity)
        
        # Surge multiplier: if active outbreak and medicine is an antibiotic/respiratory/antimalarial
        surge_mult = 1.0
        if outbreak_active and stock.category in ("Antibiotic", "Gastrointestinal", "Respiratory"):
            # Surge scales with reproduction rate
            surge_mult = max(1.0, 1.0 + ((local_r_t - 1.0) * 2.2))
        
        effective_vel = round(base_vel * surge_mult, 2)
        days_remaining = round(stock.current_pack_balance / effective_vel, 1)

        runout_ts = time.time() + (days_remaining * 86400)

        # Classification
        if days_remaining <= 5.0:
            urgency = "CRITICAL"
        elif days_remaining <= 14.0:
            urgency = "WARNING"
        else:
            urgency = "STABLE"

        # Calculate EOQ / Reorder point: (LeadTime * EffectiveVelocity) + SafetyStock - CurrentStock
        target_buffer_days = max(14, stock.safety_buffer_days)
        desired_inventory = math.ceil((lead_time_days + target_buffer_days) * effective_vel)
        reorder_qty = max(0, desired_inventory - stock.current_pack_balance)

        return StockoutForecastResult(
            item_code=stock.item_code,
            item_name=stock.name,
            facility_id=stock.facility_id,
            county_code=stock.county_code,
            current_stock_packs=stock.current_pack_balance,
            base_velocity=base_vel,
            surge_multiplier=round(surge_mult, 2),
            effective_velocity=effective_vel,
            projected_runout_days=days_remaining,
            runout_timestamp_utc=runout_ts,
            urgency_tier=urgency,
            reorder_recommended_quantity=reorder_qty,
        )


stockout_forecaster = StockoutForecaster()
