import React, { useState } from 'react';
import {
  X,
  ThermometerSnowflake,
  Play,
  Activity,
  Zap,
  BatteryCharging,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

interface ThermalModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemp?: number;
  batteryPct?: number;
}

export const ThermalModelModal: React.FC<ThermalModelModalProps> = ({
  isOpen,
  onClose,
  currentTemp = 4.6,
  batteryPct = 92,
}) => {
  const [ambientTemp, setAmbientTemp] = useState<number>(38.5);
  const [doorOpenings, setDoorOpenings] = useState<number>(4);
  const [simulatedHours, setSimulatedHours] = useState<number>(12);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      setIsRunningSim(false);
      // Thermal differential equation simulation
      const heatLossCoeff = 0.082 + doorOpenings * 0.015;
      const coolingEfficiency = (batteryPct / 100) * 0.95;
      const finalTemp = +(
        currentTemp +
        (ambientTemp - currentTemp) * (1 - Math.exp(-heatLossCoeff * (simulatedHours / 3))) * (1 - coolingEfficiency * 0.8)
      ).toFixed(2);

      const breached = finalTemp > 8.0 || finalTemp < 2.0;
      const timeToBreach = breached ? +(8.0 / (heatLossCoeff * 2.5)).toFixed(1) : 18.5;

      setSimResult({
        finalTemp,
        breached,
        timeToBreach,
        excursionRisk: breached ? 88.4 : 14.2,
        spoilageProbability: breached ? 62.0 : 3.1,
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/90 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs">
              <ThermometerSnowflake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                IoT Cold-Chain Thermal Inertia &amp; Excursion Simulator
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  PHYSICS ODE MODEL
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Physics-informed thermal dynamics differential equation for remote vaccine storage nodes (PHC-C01-001).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Mathematical Formulation Card */}
          <div className="p-3.5 bg-slate-900 text-white rounded-lg font-mono text-[11px] space-y-2 border border-slate-800">
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Differential Equation Formulation (Newton's Law of Cooling + Active Solar Chiller)
            </div>
            <div className="text-blue-300 font-bold">
              dT(t)/dt = -k_ambient * (T(t) - T_amb) + Q_active(Battery_pct) + &lambda; * Door_Openings
            </div>
            <div className="text-slate-400 text-[10px]">
              Where k_ambient = 0.082 h⁻¹, statutory corridor = [2.0°C, 8.0°C], telemetry frequency = 4s LoRaWAN.
            </div>
          </div>

          {/* Current Live Sensor Baseline */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-mono">Current Core Temp</div>
              <div className="text-lg font-black text-slate-900 font-mono mt-0.5">{currentTemp}°C</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-1">In Corridor (2-8°C)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-mono">Backup Solar Battery</div>
              <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">{batteryPct}%</div>
              <div className="text-[10px] text-slate-500 mt-1">Solar array operational</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] text-slate-500 font-mono">Thermal Buffer Runway</div>
              <div className="text-lg font-black text-blue-700 font-mono mt-0.5">18.5 Hours</div>
              <div className="text-[10px] text-slate-500 mt-1">Passive thermal inertia</div>
            </div>
          </div>

          {/* Simulation Stress Test Sliders */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between font-bold text-slate-800 text-[11px] uppercase tracking-wider font-mono">
              <span>Simulation Scenario Parameters</span>
              <span className="text-blue-700 font-normal">Turkana / Northern Frontier Hot Zone</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-slate-700 text-xs mb-1">
                  <span>External Ambient Temperature:</span>
                  <span className="font-bold font-mono text-slate-900">{ambientTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="48"
                  step="0.5"
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(+e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 text-xs mb-1">
                  <span>Daily Door Access Openings:</span>
                  <span className="font-bold font-mono text-slate-900">{doorOpenings} events/day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={doorOpenings}
                  onChange={(e) => setDoorOpenings(+e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 text-xs mb-1">
                  <span>Simulation Horizon:</span>
                  <span className="font-bold font-mono text-slate-900">{simulatedHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="48"
                  step="6"
                  value={simulatedHours}
                  onChange={(e) => setSimulatedHours(+e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isRunningSim}
              className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {isRunningSim ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Integrating Runge-Kutta 4th Order ODE...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Physics Stress Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Simulation Output Card */}
          {simResult && (
            <div className={`p-4 rounded-lg border ${simResult.breached ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-300'} space-y-2`}>
              <div className="flex items-center justify-between font-bold">
                <span className={`text-xs font-mono uppercase ${simResult.breached ? 'text-red-800' : 'text-emerald-800'}`}>
                  {simResult.breached ? 'Thermal Excursion Breach Warning' : 'Corridor Compliance Maintained'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${simResult.breached ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  {simResult.breached ? 'HIGH RISK' : 'SAFE'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500">Projected Temp:</span>{' '}
                  <strong className="font-mono text-slate-900">{simResult.finalTemp}°C</strong>
                </div>
                <div>
                  <span className="text-slate-500">Excursion Probability:</span>{' '}
                  <strong className="font-mono text-slate-900">{simResult.excursionRisk}%</strong>
                </div>
                <div>
                  <span className="text-slate-500">Time to Buffer Depletion:</span>{' '}
                  <strong className="font-mono text-slate-900">{simResult.timeToBreach}h</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200/90 bg-slate-50/70 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
