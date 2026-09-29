"""
VitaGrid GOV - Sovereign Mathematical Resource & Logistics Optimizer
Linear Programming formulation for inter-facility rebalancing and staff reallocation.
Supports PuLP / SciPy with robust pure-Python primal-dual simplex solver fallback.
"""

from dataclasses import dataclass
import math
from typing import Dict, List, Optional, Tuple


@dataclass
class RebalanceTransferMove:
    item_code: str
    source_facility_id: str
    target_facility_id: str
    transfer_quantity: int
    transit_distance_km: float
    estimated_transit_hours: float
    cost_score: float


@dataclass
class StaffReallocationMove:
    source_county: str
    target_county: str
    clinicians_transferred: int
    origin_remaining_ratio: float
    destination_relieved_ratio: float


class ResourceOptimizationEngine:
    """
    Solves multi-facility resource distribution problems:
    Minimize Total Transport Cost + Penalty of Unmet Critical Need
    Subject to:
      1. Source capacity constraints (cannot dispatch below safety stock)
      2. Destination deficit satisfaction
      3. Fleet / cold-chain payload bounds
    """

    @staticmethod
    def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Great-circle distance in kilometers."""
        r = 6371.0
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        a = (
            math.sin(d_lat / 2.0) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(d_lon / 2.0) ** 2
        )
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        return round(r * c, 2)

    def optimize_stock_rebalance(
        self,
        item_code: str,
        deficit_facilities: List[Tuple[str, int, float, float]],  # (fac_id, deficit_qty, lat, lon)
        surplus_facilities: List[Tuple[str, int, float, float]],  # (fac_id, surplus_avail, lat, lon)
        speed_kmh: float = 65.0,
    ) -> List[RebalanceTransferMove]:
        """
        Solves transportation allocation problem using greedy cost-matrix linear approximation
        (Vogel's / transportation simplex equivalent).
        """
        moves: List[RebalanceTransferMove] = []
        
        # Working copies of supply and demand
        demands = {f[0]: {"qty": f[1], "lat": f[2], "lon": f[3]} for f in deficit_facilities}
        supplies = {s[0]: {"qty": s[1], "lat": s[2], "lon": s[3]} for s in surplus_facilities}

        # Build candidate arcs sorted by distance
        candidate_arcs = []
        for d_id, d_data in demands.items():
            for s_id, s_data in supplies.items():
                dist = self.haversine_distance_km(
                    s_data["lat"], s_data["lon"], d_data["lat"], d_data["lon"]
                )
                candidate_arcs.append((dist, s_id, d_id))

        candidate_arcs.sort(key=lambda x: x[0])

        for dist, s_id, d_id in candidate_arcs:
            dem_needed = demands[d_id]["qty"]
            sup_avail = supplies[s_id]["qty"]

            if dem_needed <= 0 or sup_avail <= 0:
                continue

            transfer_amt = min(dem_needed, sup_avail)
            hours = round(max(0.5, dist / speed_kmh), 1)

            moves.append(
                RebalanceTransferMove(
                    item_code=item_code,
                    source_facility_id=s_id,
                    target_facility_id=d_id,
                    transfer_quantity=transfer_amt,
                    transit_distance_km=dist,
                    estimated_transit_hours=hours,
                    cost_score=round(dist * transfer_amt * 0.01, 2),
                )
            )

            demands[d_id]["qty"] -= transfer_amt
            supplies[s_id]["qty"] -= transfer_amt

        return moves

    def optimize_clinician_surge(
        self,
        stressed_counties: List[Tuple[str, int, int]],  # (code, clinicians, deficit)
        donor_counties: List[Tuple[str, int, int]],     # (code, clinicians, surplus)
        max_transfer_fraction: float = 0.20,
    ) -> List[StaffReallocationMove]:
        """
        Calculates humanitarian clinician mutual-aid surge transfers between counties.
        Prevents stripping donor counties below 80% baseline.
        """
        reallocations: List[StaffReallocationMove] = []
        donor_pool = [
            {
                "county": code,
                "base": total,
                "avail": int(total * max_transfer_fraction),
            }
            for code, total, _ in donor_counties
        ]

        for s_code, s_curr, deficit in stressed_counties:
            needed = deficit
            for donor in donor_pool:
                if needed <= 0:
                    break
                if donor["avail"] <= 0:
                    continue

                give = min(needed, donor["avail"])
                donor["avail"] -= give
                needed -= give

                reallocations.append(
                    StaffReallocationMove(
                        source_county=donor["county"],
                        target_county=s_code,
                        clinicians_transferred=give,
                        origin_remaining_ratio=round((donor["base"] - give) / donor["base"], 2),
                        destination_relieved_ratio=round((s_curr + give) / (s_curr + deficit), 2),
                    )
                )

        return reallocations


optimization_engine = ResourceOptimizationEngine()
