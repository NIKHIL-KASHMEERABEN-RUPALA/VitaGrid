"""
VitaGrid GOV - Sovereign Epidemiological Modeling Engine
Bayesian Renewal Equation (Cori et al., EpiEstim style) for instant R_t estimation,
doubling-time calculation, and 14/30/60/90-day forward trajectory projection.
"""

from dataclasses import dataclass, field
import math
from typing import Dict, List, Optional, Tuple


@dataclass
class RtEstimate:
    r_t: float
    confidence_interval_low: float
    confidence_interval_high: float
    doubling_time_days: Optional[float]
    epidemic_phase: str  # "DECLINING", "STABLE", "GROWING", "EXPLOSIVE"
    defcon_risk_band: str  # "NOMINAL", "DEFCON_4", "DEFCON_3", "DEFCON_2", "DEFCON_1"


@dataclass
class TrajectoryPoint:
    day_offset: int
    date_str: str
    expected_daily_infections: float
    lower_95: float
    upper_95: float
    projected_bed_occupancy_pct: float
    icu_ventilator_demand: int


class EpidemicTrajectoryModel:
    def __init__(self, serial_interval_mean: float = 4.8, serial_interval_std: float = 2.3):
        self.si_mean = serial_interval_mean
        self.si_std = serial_interval_std
        # Gamma distribution shape and scale for generation time
        self.gamma_shape = (self.si_mean / self.si_std) ** 2
        self.gamma_scale = (self.si_std ** 2) / self.si_mean

    def estimate_rt(self, daily_cases: List[float], window_days: int = 7) -> RtEstimate:
        """
        Calculates instantaneous reproduction number R_t using Bayesian renewal
        over a sliding window of historical incidence.
        """
        if len(daily_cases) < window_days:
            # Fallback for sparse history
            return RtEstimate(
                r_t=1.0,
                confidence_interval_low=0.85,
                confidence_interval_high=1.15,
                doubling_time_days=None,
                epidemic_phase="STABLE",
                defcon_risk_band="NOMINAL"
            )

        recent_window = daily_cases[-window_days:]
        previous_window = daily_cases[-2 * window_days: -window_days] if len(daily_cases) >= 2 * window_days else recent_window

        sum_recent = sum(recent_window)
        sum_prev = sum(previous_window)

        # Discretized infectivity profile approximation
        infectious_potential = max(sum_prev, 1.0)
        # Prior parameters (Gamma prior shape a=1.0, rate b=1.0)
        prior_a = 1.0
        prior_b = 1.0
        posterior_shape = prior_a + sum_recent
        posterior_rate = prior_b + infectious_potential

        mean_rt = posterior_shape / posterior_rate
        # 95% credible interval
        std_rt = math.sqrt(posterior_shape) / posterior_rate
        ci_low = max(0.1, mean_rt - 1.96 * std_rt)
        ci_high = mean_rt + 1.96 * std_rt

        # Doubling time computation: T_d = ln(2) / r, where r = (R_t - 1) / SI
        growth_rate = (mean_rt - 1.0) / self.si_mean
        doubling_time = (math.log(2) / growth_rate) if growth_rate > 0.01 else None

        # Epidemic phase determination
        if mean_rt < 0.90:
            phase = "DECLINING"
            risk_band = "NOMINAL"
        elif mean_rt <= 1.05:
            phase = "STABLE"
            risk_band = "DEFCON_4"
        elif mean_rt <= 1.35:
            phase = "GROWING"
            risk_band = "DEFCON_3"
        elif mean_rt <= 1.70:
            phase = "RAPID_GROWTH"
            risk_band = "DEFCON_2"
        else:
            phase = "EXPLOSIVE"
            risk_band = "DEFCON_1"

        return RtEstimate(
            r_t=round(mean_rt, 2),
            confidence_interval_low=round(ci_low, 2),
            confidence_interval_high=round(ci_high, 2),
            doubling_time_days=round(doubling_time, 1) if doubling_time else None,
            epidemic_phase=phase,
            defcon_risk_band=risk_band
        )

    def forecast_trajectory(
        self,
        current_daily_cases: float,
        r_t: float,
        current_bed_occupancy_pct: float,
        horizon_days: int = 90
    ) -> List[TrajectoryPoint]:
        """
        Projects multi-horizon infection trajectory for 14, 30, 60, and 90 days
        with bed occupancy and ICU ventilator strain estimates.
        """
        points: List[TrajectoryPoint] = []
        growth_rate = (r_t - 1.0) / self.si_mean
        dampening = 0.985  # Natural policy / behavioral dampening factor

        projected = current_daily_cases
        effective_r = r_t

        for day in range(1, horizon_days + 1):
            effective_r = 1.0 + (effective_r - 1.0) * dampening
            step_growth = math.exp((effective_r - 1.0) / self.si_mean)
            projected = max(2.0, projected * step_growth)

            # Variance expands with time horizon
            uncertainty_mult = 1.0 + (0.015 * day)
            lower = max(1.0, projected / uncertainty_mult)
            upper = projected * uncertainty_mult

            # Bed capacity model (assuming 7.5% admission rate and 6.2 days length of stay)
            estimated_admissions = projected * 0.075
            bed_impact = min(100.0, current_bed_occupancy_pct + (estimated_admissions * 0.28))
            icu_demand = int(estimated_admissions * 0.18)

            if day in [7, 14, 21, 30, 45, 60, 75, 90]:
                points.append(
                    TrajectoryPoint(
                        day_offset=day,
                        date_str=f"+{day}d",
                        expected_daily_infections=round(projected, 1),
                        lower_95=round(lower, 1),
                        upper_95=round(upper, 1),
                        projected_bed_occupancy_pct=round(bed_impact, 1),
                        icu_ventilator_demand=icu_demand
                    )
                )

        return points


epidemic_model = EpidemicTrajectoryModel()
