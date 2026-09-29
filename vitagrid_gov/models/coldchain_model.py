"""
VitaGrid GOV - IoT Cold-Chain Thermal Inertia & Excursion Risk Model
Physics-informed thermal dynamics differential equation model.
Predicts thermal breach before spoilage occurs, evaluates backup solar battery status,
and enforces the statutory 2.0°C – 8.0°C cold-chain corridor.
"""

from dataclasses import dataclass
import math
import time
from typing import Dict, List, Optional, Tuple


@dataclass
class ColdChainIntegrityReport:
    sensor_id: str
    facility_id: str
    current_temp_celsius: float
    excursion_probability_12h: float
    hours_to_critical_threshold: float
    integrity_risk_band: str  # "SAFE", "WARNING", "CRITICAL_SPOILAGE_RISK"
    root_cause_telemetry: str
    recommended_action: str
    solar_battery_pct: float = 92.0
    ambient_temp_celsius: float = 29.2
    thermal_gradient_c_per_hr: float = 0.18
    projected_breach_timestamp: Optional[float] = None
    telemetry_frequency_seconds: int = 4
    corridor_range: str = "2.0°C - 8.0°C"


class ColdChainThermalInertiaModel:
    """
    Mathematical Formulation:
    -------------------------
    Differential Equation (Newton's Law of Cooling + Active Heat Pump Work):

      dT/dt = - k_insulation * (T_core(t) - T_ambient) + (P_cooling(B_solar) / C_thermal) - Q_door(omega)

    where:
      - T_core(t): Core vaccine chamber temperature (°C) at time t.
      - T_ambient: Ambient outdoor environment temperature (°C).
      - k_insulation: Thermal conductivity coefficient of polyurethane vacuum panels (~0.042 h^-1).
      - C_thermal: Specific thermal mass capacitance of vaccine vials + ice lining (kJ / °C).
      - P_cooling(B_solar): Active compressor refrigeration cooling rate:
          P_cooling(B) = P_max * min(1.0, B / 25.0)  if B > 12% (cut-off threshold) else 0.0 kW
      - Q_door(omega): Convective heat ingress from door opening events:
          Q_door(omega) = gamma_door * omega_door * (T_ambient - T_core)

    Thermal Buffer Runway (Hours to Breach):
      If active power stalls (P_cooling = 0), solving the initial value problem yields:
        T(t) = T_ambient - (T_ambient - T_0) * exp(- (k_insulation + gamma_door * omega) * t)

      Setting T(t*) = 8.0°C (Critical Spoilage Ceiling):
        t* = - ln( (T_ambient - 8.0) / (T_ambient - T_0) ) / (k_insulation + gamma_door * omega)

    Excursion Risk Probability (12-Hour Horizon):
      P(Excursion | T_0, B_solar, omega) = 1.0 / (1.0 + exp(- [ alpha*(T_0 - 5.5) + beta*(50 - B_solar) + delta*(omega - 2) ]))
    """

    SAFE_MIN_TEMP = 2.0
    SAFE_MAX_TEMP = 8.0
    NOMINAL_OPTIMAL_TEMP = 4.5
    K_INSULATION = 0.042  # hr^-1 for medical-grade vacuum insulated panels
    GAMMA_DOOR = 0.015    # Thermal leakage multiplier per door access event

    def analyze_sensor(
        self,
        sensor_id: str = "IOT-SENSOR-PHC-C01-001",
        facility_id: str = "PHC-C01-001",
        temperature: float = 4.6,
        ambient_temp: float = 29.2,
        battery_pct: float = 92.0,
        compressor_duty_cycle: float = 0.35,
        door_open_events_per_hr: int = 3,
    ) -> ColdChainIntegrityReport:
        """
        Assesses thermal dynamics, compressor strain, and battery degradation.
        """
        # Effective thermal loss rate (dT/dt) if compressor experiences power loss
        effective_loss_rate = self.K_INSULATION + (self.GAMMA_DOOR * door_open_events_per_hr)
        temp_diff_ambient = max(0.1, ambient_temp - temperature)
        rate_of_rise_c_per_hr = round(effective_loss_rate * temp_diff_ambient, 2)

        # Calculate exact hours to 8.0°C threshold
        if temperature < self.SAFE_MAX_TEMP:
            if ambient_temp > self.SAFE_MAX_TEMP:
                ratio = (ambient_temp - self.SAFE_MAX_TEMP) / max(0.01, (ambient_temp - temperature))
                ratio = max(0.001, min(0.999, ratio))
                hours_to_breach = - math.log(ratio) / max(0.01, effective_loss_rate)
            else:
                hours_to_breach = 48.0
        else:
            hours_to_breach = 0.0

        # Solar battery multiplier: If battery drops below 30%, risk escalates rapidly
        battery_strain_penalty = max(0.0, (40.0 - battery_pct) * 0.04)
        temp_penalty = max(0.0, (temperature - 5.5) * 0.45)
        duty_penalty = max(0.0, (compressor_duty_cycle - 0.5) * 0.30)

        # Logit for excursion probability
        logit = -2.2 + temp_penalty + battery_strain_penalty + duty_penalty
        excursion_prob = 1.0 / (1.0 + math.exp(-max(-5.0, min(5.0, logit))))

        # Classify risk band
        now_ts = time.time()
        projected_breach_ts = now_ts + (hours_to_breach * 3600) if hours_to_breach > 0 else None

        if temperature > self.SAFE_MAX_TEMP or temperature < self.SAFE_MIN_TEMP or excursion_prob > 0.70:
            risk_band = "CRITICAL_SPOILAGE_RISK"
            cause = "Active thermal excursion detected outside 2.0°C - 8.0°C corridor."
            action = "Dispatch emergency cold-box buffer (RL-09) and activate auxiliary photovoltaic circuit."
        elif temperature > 6.2 or excursion_prob > 0.30 or battery_pct < 45.0:
            risk_band = "WARNING"
            cause = "Elevated thermal gradient and rapid solar battery discharge rate."
            action = "Inspect gasket seals and switch inverter to high-efficiency solar reserve."
        else:
            risk_band = "SAFE"
            cause = "Nominal thermal equilibrium within 2°C - 8°C corridor."
            action = "Routine telemetric sentinel pinging via LoRaWAN (4s intervals)."

        return ColdChainIntegrityReport(
            sensor_id=sensor_id,
            facility_id=facility_id,
            current_temp_celsius=round(temperature, 2),
            excursion_probability_12h=round(excursion_prob, 3),
            hours_to_critical_threshold=round(hours_to_breach, 1),
            integrity_risk_band=risk_band,
            root_cause_telemetry=cause,
            recommended_action=action,
            solar_battery_pct=round(battery_pct, 1),
            ambient_temp_celsius=round(ambient_temp, 1),
            thermal_gradient_c_per_hr=rate_of_rise_c_per_hr,
            projected_breach_timestamp=projected_breach_ts,
            telemetry_frequency_seconds=4,
            corridor_range="2.0°C - 8.0°C",
        )


coldchain_model = ColdChainThermalInertiaModel()
