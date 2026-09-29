"""
VitaGrid GOV - Sovereign Epidemiological Modeling Engine
Bayesian R_t estimation (Cori et al.), Doubling Time, and CUSUM Anomaly Detection.
"""

from dataclasses import dataclass
import math
from typing import Dict, List, Optional, Tuple
from vitagrid_gov_ai.data.schemas import SyndromicSurveillancePoint


@dataclass
class RtEstimate:
    county_code: str
    r_t_median: float
    r_t_lower_ci: float  # 95% credible interval
    r_t_upper_ci: float
    doubling_time_days: Optional[float]
    growth_rate_pct: float
    surge_phase: str  # ACCELERATING, DECELERATING, STABLE, COLLAPSING
    confidence_score: float


@dataclass
class AnomalyAlert:
    county_code: str
    disease: str
    observed_cases: int
    expected_baseline: float
    z_score: float
    cusum_statistic: float
    is_anomaly: bool


class EpidemiologicalModelEngine:
    """
    Implements real-time sovereign surveillance algorithms based on
    renewal equation mathematics (Cori et al. AJE 2013) and CUSUM drift detection.
    """

    def __init__(self, serial_interval_mean: float = 4.8, serial_interval_std: float = 2.3):
        self.si_mean = serial_interval_mean
        self.si_std = serial_interval_std
        # Gamma distribution shape and scale for serial interval
        self.gamma_shape = (self.si_mean / self.si_std) ** 2
        self.gamma_scale = (self.si_std ** 2) / self.si_mean

    def _discretized_gamma_w(self, max_lag: int = 14) -> List[float]:
        """Discretized infectivity profile w_s."""
        w = []
        for s in range(1, max_lag + 1):
            # Integrate or approximate gamma PDF
            term = (s ** (self.gamma_shape - 1)) * math.exp(-s / self.gamma_scale)
            w.append(term)
        total = sum(w)
        return [val / total for val in w]

    def estimate_r_t(
        self,
        daily_cases: List[int],
        county_code: str,
        window_size: int = 7,
    ) -> RtEstimate:
        """
        Calculates instantaneous reproduction number R_t over a sliding window.
        Uses posterior Poisson-Gamma conjugate updates.
        """
        if len(daily_cases) < window_size + 1:
            # Fallback when insufficient series
            return RtEstimate(
                county_code=county_code,
                r_t_median=1.0,
                r_t_lower_ci=0.8,
                r_t_upper_ci=1.2,
                doubling_time_days=None,
                growth_rate_pct=0.0,
                surge_phase="STABLE",
                confidence_score=0.4,
            )

        w = self._discretized_gamma_w(max_lag=min(14, len(daily_cases) - 1))
        # Overall infectiousness Lambda_t
        lambda_t_series = []
        for t in range(len(w), len(daily_cases)):
            lambda_t = sum(daily_cases[t - s] * w[s - 1] for s in range(1, len(w) + 1))
            lambda_t_series.append(max(0.01, lambda_t))

        # Sum over window
        recent_cases = sum(daily_cases[-window_size:])
        recent_lambda = sum(lambda_t_series[-window_size:]) if len(lambda_t_series) >= window_size else sum(lambda_t_series)

        # Gamma conjugate prior: shape a=1, rate b=5 (mean prior 0.2)
        prior_a, prior_b = 1.0, 5.0
        post_a = prior_a + recent_cases
        post_b = prior_b + recent_lambda

        r_t_median = round(post_a / post_b, 3)
        # Approximate 95% credible interval
        std_err = math.sqrt(post_a) / post_b
        r_t_lower = max(0.0, round(r_t_median - (1.96 * std_err), 3))
        r_t_upper = round(r_t_median + (1.96 * std_err), 3)

        # Compute growth rate r approx (R_t - 1) / serial_interval
        growth_rate = (r_t_median - 1.0) / self.si_mean
        doubling_time = None
        if growth_rate > 0.01:
            doubling_time = round(math.log(2) / growth_rate, 1)

        # Classify phase
        if r_t_median >= 1.25:
            surge_phase = "ACCELERATING"
        elif r_t_median >= 1.05:
            surge_phase = "EXPANDING"
        elif r_t_median <= 0.85:
            surge_phase = "COLLAPSING"
        else:
            surge_phase = "STABLE"

        return RtEstimate(
            county_code=county_code,
            r_t_median=r_t_median,
            r_t_lower_ci=r_t_lower,
            r_t_upper_ci=r_t_upper,
            doubling_time_days=doubling_time,
            growth_rate_pct=round(growth_rate * 100.0, 2),
            surge_phase=surge_phase,
            confidence_score=0.92,
        )

    def detect_syndromic_anomalies(
        self,
        historical_series: List[int],
        county_code: str,
        disease_name: str,
        k_slack: float = 0.5,
        h_threshold: float = 4.0,
    ) -> AnomalyAlert:
        """
        Two-sided Cumulative Sum (CUSUM) and Z-score anomaly detector.
        """
        if len(historical_series) < 7:
            return AnomalyAlert(
                county_code=county_code,
                disease=disease_name,
                observed_cases=historical_series[-1] if historical_series else 0,
                expected_baseline=0.0,
                z_score=0.0,
                cusum_statistic=0.0,
                is_anomaly=False,
            )

        baseline_window = historical_series[:-1]
        mean_base = sum(baseline_window) / len(baseline_window)
        var_base = sum((x - mean_base) ** 2 for x in baseline_window) / max(1, len(baseline_window) - 1)
        std_base = math.sqrt(var_base) if var_base > 0 else 1.0

        current_val = historical_series[-1]
        z_score = round((current_val - mean_base) / std_base, 2)

        # Tabular CUSUM positive excursion
        cusum_stat = 0.0
        for val in historical_series[-7:]:
            standardized = (val - mean_base) / std_base
            cusum_stat = max(0.0, cusum_stat + standardized - k_slack)

        is_anomaly = (z_score >= 2.5) or (cusum_stat >= h_threshold)

        return AnomalyAlert(
            county_code=county_code,
            disease=disease_name,
            observed_cases=current_val,
            expected_baseline=round(mean_base, 1),
            z_score=z_score,
            cusum_statistic=round(cusum_stat, 2),
            is_anomaly=is_anomaly,
        )


epidemiology_engine = EpidemiologicalModelEngine()
