"""
VitaGrid GOV - Geospatial & Digital Twin Router
Supplies GeoJSON features and real-time facility telemetry to MapLibre / Leaflet map components.
"""

from fastapi import APIRouter, HTTPException
from vitagrid_gov.agents.digital_twin import digital_twin_agent

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin & Geospatial"])


@router.get("/corridor-heatmap")
async def get_corridor_heatmap_geojson():
    """Returns GeoJSON FeatureCollection of all 47 health zones and vulnerability ratings."""
    features = digital_twin_agent.get_national_corridor_heatmap()
    return {
        "type": "FeatureCollection",
        "features": features
    }


@router.get("/county/{county_code}")
async def get_county_digital_twin_state(county_code: str):
    """Returns detailed beds, oxygen, cold-chain, and staffing digital twin state for a county."""
    node = digital_twin_agent.get_county_digital_twin(county_code)
    if not node:
        raise HTTPException(status_code=404, detail=f"County {county_code} not found")
    return node
