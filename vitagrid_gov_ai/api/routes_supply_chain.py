"""
VitaGrid GOV - Supply Chain Router
Inventory monitoring, cold-chain IoT telemetry, and automated rebalance plans.
"""

from typing import Any, Dict, List
from vitagrid_gov_ai.data.generators import data_generator
from vitagrid_gov_ai.models.forecasting import stockout_forecaster
from vitagrid_gov_ai.models.optimizer import optimization_engine


def get_supply_chain_overview() -> Dict[str, Any]:
    facilities = data_generator.generate_facilities()
    stocks = data_generator.generate_inventory(facilities)
    cold_sensors = data_generator.generate_cold_chain_readings(facilities)

    critical_items = []
    for s in stocks:
        # Check high-risk stockout
        if s.days_of_stock_remaining <= 5.0:
            critical_items.append({
                "item_code": s.item_code,
                "name": s.name,
                "facility_id": s.facility_id,
                "county_code": s.county_code,
                "days_remaining": s.days_of_stock_remaining,
                "current_stock": s.current_pack_balance,
                "velocity_daily": s.daily_consumption_velocity,
            })

    excursions = [
        {
            "sensor_id": c.sensor_id,
            "facility_id": c.facility_id,
            "temp_celsius": c.temperature_celsius,
            "status": c.compressor_status,
        }
        for c in cold_sensors
        if c.is_thermal_excursion
    ]

    return {
        "total_inventoried_skus": len(stocks),
        "critical_stockouts_count": len(critical_items),
        "critical_items": critical_items[:10],
        "cold_chain_excursions": excursions,
    }
