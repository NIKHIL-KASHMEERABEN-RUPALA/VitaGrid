import React, { useState, useEffect } from 'react';
import {
  Network,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Activity,
  Truck,
  FileCheck,
  Bot,
  Database,
  Radio,
  Server,
  Lock,
  GitBranch,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  RefreshCw,
  Sliders,
  Compass,
  FileText,
  AlertTriangle,
  Download,
  Code2,
  Play,
  Check,
  RotateCcw,
  Eye,
  Key,
  Undo2,
  ThermometerSnowflake,
  HeartPulse,
  Stethoscope,
  BadgeCheck,
  Boxes,
  Binary,
  Share2,
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Clock,
} from 'lucide-react';
import {
  fetchSystemStatus,
  runWhatIfSimulation,
  fetchShapExplanation,
  authorizeActionDocket,
  rollbackActionDocket,
} from '../../services/backendApi';

interface AgentDetail {
  id: string;
  name: string;
  codename: string;
  icon: React.ComponentType<{ className?: string }>;
  layer: 'Ingestion & Zero-PII' | 'Event Mesh' | 'Specialist Swarm' | 'HITL Governance' | 'MLOps & Drift';
  layerIndex: number;
  responsibility: string;
  keyAlgorithms: string[];
  inputEvents: string[];
  outputEvents: string[];
  status: 'HEALTHY' | 'ACTIVE' | 'STANDBY';
  telemetryLatency: string;
}

const AGENTS_LIST: AgentDetail[] = [
  {
    id: 'commander',
    name: 'Commander Orchestrator Agent',
    codename: 'COMMANDER-ORCHESTRATOR',
    icon: Network,
    layer: 'Specialist Swarm',
    layerIndex: 3,
    responsibility: 'Central brain of the multi-agent mesh. Coordinates all 10 specialist agents, maintains global DEFCON state (1 to 5), aggregates swarm telemetry, and enforces the strict Human-in-the-Loop authorization gate before any physical dispatch occurs.',
    keyAlgorithms: ['Finite State Machine (DEFCON 1-5)', 'Priority Directed Acyclic Graph Dispatcher', 'Distributed Swarm Consensus Aggregator'],
    inputEvents: ['telemetry.*', 'agent.alert.*', 'hitl.action.*', 'simulation.*'],
    outputEvents: ['system.defcon.changed', 'swarm.task.dispatched', 'orchestrator.health.pulse'],
    status: 'HEALTHY',
    telemetryLatency: '< 1.8 ms',
  },
  {
    id: 'ingestion',
    name: 'Data Ingestion & Zero-PII Agent',
    codename: 'AGENT-DATA-INGESTION',
    icon: Database,
    layer: 'Ingestion & Zero-PII',
    layerIndex: 1,
    responsibility: 'Continuously harvests telemetry from LoRaWAN cold-chain nodes, eLMIS registers, DHIS2, and syndromic clinics across 2,840 PHCs. Strips all PII via sovereign regex enclaves and normalizes drug nomenclature to canonical WHO Essential Medicines List (EDL) codes.',
    keyAlgorithms: ['FedRAMP Zero-PII Regex Enclave', 'Fuzzy Nomenclature Canonicalization', 'ISO 19152 Spatial Catchment Mapper'],
    inputEvents: ['raw.telemetry.iot', 'raw.dhis2.sync', 'raw.elmis.stock'],
    outputEvents: ['data.sanitized.ingested', 'feature_store.update', 'ingestion.anomaly.flagged'],
    status: 'HEALTHY',
    telemetryLatency: '< 4.2 ms',
  },
  {
    id: 'epidemic',
    name: 'Epidemic Prediction Agent (Cori Rt SEIR)',
    codename: 'AGENT-EPIDEMIC-PREDICTION',
    icon: Activity,
    layer: 'Specialist Swarm',
    layerIndex: 3,
    responsibility: 'Continuous epidemiological surveillance executing Bayesian Cori et al. renewal equations for R_t, infection doubling-time tracking, and 14/30/60/90-day forward trajectory projections.',
    keyAlgorithms: ['Cori et al. Bayesian Renewal Rt', 'Gamma Serial Interval (mean 4.8, std 2.3d)', 'CUSUM Outbreak Anomaly Detector'],
    inputEvents: ['syndromic.case.stream', 'lab.positivity.tick', 'weather.precipitation.anomaly'],
    outputEvents: ['agent.alert.epidemic', 'trajectory.forecast.generated', 'bed_saturation.projected'],
    status: 'HEALTHY',
    telemetryLatency: '< 12.4 ms',
  },
  {
    id: 'logistics',
    name: 'Logistics & Multi-Echelon Supply Agent',
    codename: 'AGENT-LOGISTICS-SUPPLY',
    icon: Truck,
    layer: 'Specialist Swarm',
    layerIndex: 3,
    responsibility: 'Monitors inventory across 5 distribution tiers (E1 Central Depot to E5 Rural Dispensary). Solves transport cost minimization via Primal-Dual linear programming and drafts Action Dockets with statutory SLA countdowns.',
    keyAlgorithms: ['Primal-Dual Simplex Rebalance Solver', 'Haversine Geographic Transit Matrix', 'Depot Stagnation Detector'],
    inputEvents: ['stock.depletion.warning', 'feature_store.update', 'cold_chain.excursion.alert'],
    outputEvents: ['agent.alert.logistics', 'docket.proposal.queued', 'rebalance.directive.drafted'],
    status: 'HEALTHY',
    telemetryLatency: '< 8.6 ms',
  },
  {
    id: 'xai',
    name: 'Explainable AI (TreeSHAP) Agent',
    codename: 'AGENT-XAI-EXPLAINABILITY',
    icon: Sliders,
    layer: 'Specialist Swarm',
    layerIndex: 3,
    responsibility: 'Generates exact Shapley additive attributions (TreeSHAP) for every stockout and surge risk alert, converting mathematical gradient-boosted logits into plain-language statutory justifications for executive review.',
    keyAlgorithms: ['TreeSHAP Polynomial Attribution', 'Localized Feature Contribution Scoring', 'Statutory Legal Rule Parser'],
    inputEvents: ['model.high_risk.flagged', 'epidemic.surge.detected'],
    outputEvents: ['xai.attribution.ready', 'card.why_at_risk.published', 'xai.waterfall.generated'],
    status: 'HEALTHY',
    telemetryLatency: '< 6.2 ms',
  },
  {
    id: 'what_if',
    name: 'Counterfactual What-If Agent',
    codename: 'AGENT-COUNTERFACTUAL-WHATIF',
    icon: Sparkles,
    layer: 'Specialist Swarm',
    layerIndex: 3,
    responsibility: 'Runs isolated sandbox simulations on feature store clones (e.g. "What if we move 5,000 vials of saline or 12 ICU nurses?") to evaluate risk reduction metrics before physical orders are signed.',
    keyAlgorithms: ['State Sandbox Deep-Cloning', 'Counterfactual Trajectory Solver', 'Intervention Cost-Benefit Scoring'],
    inputEvents: ['simulation.what_if.requested'],
    outputEvents: ['simulation.what_if.completed', 'simulation.impact.evaluated'],
    status: 'HEALTHY',
    telemetryLatency: '< 18.0 ms',
  },
  {
    id: 'digital_twin',
    name: 'Geospatial & Digital Twin Agent',
    codename: 'AGENT-GEOSPATIAL-DIGITAL-TWIN',
    icon: Compass,
    layer: 'Specialist Swarm',
    layerIndex: 3,
    responsibility: 'Maintains the live National Health Digital Twin representing 47 health zones and 2,840 PHCs (beds, oxygen PSI, clinician shifts, cold-chain temps) and feeds MapLibre geospatial heatmaps and routing corridors.',
    keyAlgorithms: ['PostGIS Spatial Catchment Mapping', 'Choke-Point Transit Vulnerability Index', 'GeoJSON Corridor Aggregator'],
    inputEvents: ['telemetry.iot.sentinel', 'facility.bed_occ.tick', 'oxygen.psi.telemetry'],
    outputEvents: ['digital_twin.state.refreshed', 'corridor.heatmap.broadcast'],
    status: 'HEALTHY',
    telemetryLatency: '< 5.4 ms',
  },
  {
    id: 'rag',
    name: 'Clinical Protocol & Doc Intelligence Agent',
    codename: 'AGENT-CLINICAL-PROTOCOL-RAG',
    icon: FileText,
    layer: 'Specialist Swarm',
    layerIndex: 3,
    responsibility: 'Ingests sovereign medical treatment guidelines and disaster logistics SOPs. Enforces strict clinical citations and refuses ungrounded medical claims, powering the AI Decision Copilot with verifiable citations.',
    keyAlgorithms: ['Hybrid BM25 + Dense Cosine Similarity', 'Sovereign Citation Formatter', 'Ungrounded Query Refusal Barrier'],
    inputEvents: ['copilot.query.received', 'protocol.update.published'],
    outputEvents: ['copilot.grounded_response.emitted', 'statutory.sla.attached'],
    status: 'HEALTHY',
    telemetryLatency: '< 14.5 ms',
  },
  {
    id: 'security_hitl',
    name: 'Security, Audit & HITL Governance Agent',
    codename: 'AGENT-SECURITY-HITL-GOVERNANCE',
    icon: ShieldCheck,
    layer: 'HITL Governance',
    layerIndex: 4,
    responsibility: 'Strictly enforces the sovereign Human-in-the-Loop boundary. Blocks autonomous dispatch, requires ministerial ECDSA SHA-256 signatures, issues rollback tokens (RBK-XXXX), and maintains the append-only ledger.',
    keyAlgorithms: ['FIPS 140-3 HMAC-SHA256 Signing', 'Merkle Append-Only Hash Chain', 'One-Time Cryptographic Rollback Minter'],
    inputEvents: ['docket.authorization.requested', 'docket.rollback.requested'],
    outputEvents: ['hitl.action.authorized', 'audit.block.appended', 'rollback.token.minted'],
    status: 'HEALTHY',
    telemetryLatency: '< 3.1 ms',
  },
  {
    id: 'mlops',
    name: 'MLOps & Drift Guard Agent',
    codename: 'AGENT-MLOPS-DRIFT-GUARD',
    icon: GitBranch,
    layer: 'MLOps & Drift',
    layerIndex: 3,
    responsibility: 'Continuously tests for feature distribution drift (Population Stability Index / KS tests) on the 28+ feature store, runs champion-challenger benchmarks, and triggers LoRA adapter hot-swapping.',
    keyAlgorithms: ['Population Stability Index (PSI)', 'Weighted Absolute Percentage Error (WAPE)', 'LoRA Adapter Dynamic Hot-Swapping'],
    inputEvents: ['mlops.drift_check.tick', 'model.eval.completed'],
    outputEvents: ['mlops.drift.alert', 'lora.adapter.swapped', 'challenger.model.promoted'],
    status: 'HEALTHY',
    telemetryLatency: '< 9.2 ms',
  },
];

export const ArchitectureStackView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail>(AGENTS_LIST[0]);
  const [activeTab, setActiveTab] = useState<'architecture' | 'models' | 'security' | 'integration' | 'simulator'>('architecture');
  const [systemState, setSystemState] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  // Interactive Simulator States
  const [simScenario, setSimScenario] = useState<'outbreak' | 'coldchain' | 'stockout'>('outbreak');
  const [simStep, setSimStep] = useState<number>(0);
  const [simLogs, setSimLogs] = useState<Array<{ timestamp: string; agent: string; event: string; detail: string }>>([]);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simWhatIfResult, setSimWhatIfResult] = useState<any>(null);
  const [simShapResult, setSimShapResult] = useState<any>(null);
  const [simDocketAuth, setSimDocketAuth] = useState<any>(null);

  // Security Zero-PII Interactive Tester States
  const [rawPiiInput, setRawPiiInput] = useState<string>(
    'Patient Johnathan Kamau (ID: 29481923, Phone: +254 712 345678, IP: 197.232.84.12) examined by Dr. Alice Wanjiru at Lodwar Subcounty PHC for severe malaria. Administered 4 vials of Artesunate.'
  );
  const [sanitizedPiiOutput, setSanitizedPiiOutput] = useState<string>('');

  useEffect(() => {
    loadStatus();
    runZeroPiiSanitization(rawPiiInput);
  }, []);

  const loadStatus = async () => {
    setIsRefreshing(true);
    try {
      const status = await fetchSystemStatus();
      setSystemState(status);
    } catch (e) {
      console.warn('Backend status loaded with resilient defaults.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const runZeroPiiSanitization = (raw: string) => {
    let sanitized = raw;
    sanitized = sanitized.replace(/\b(ID:\s*\d{6,10}|\d{8})\b/gi, '[REDACTED_NATIONAL_ID]');
    sanitized = sanitized.replace(/(\+254\s?\d{9}|\b07\d{8}\b)/g, '[REDACTED_PHONE]');
    sanitized = sanitized.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED_IP]');
    sanitized = sanitized.replace(/Patient\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g, 'Patient [CITIZEN_PSEUDO_884]');
    sanitized = sanitized.replace(/Dr\.\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g, 'Clinician [PRACTITIONER_P09]');
    setSanitizedPiiOutput(sanitized);
  };

  const handleRunSimulator = async () => {
    setSimRunning(true);
    setSimStep(1);
    setSimLogs([]);
    setSimWhatIfResult(null);
    setSimShapResult(null);
    setSimDocketAuth(null);

    const now = () => new Date().toISOString().substring(11, 19);

    setTimeout(() => {
      setSimLogs((prev) => [
        ...prev,
        {
          timestamp: now(),
          agent: 'AGENT-DATA-INGESTION',
          event: 'data.sanitized.ingested',
          detail: simScenario === 'outbreak'
            ? 'Ingested 48 syndromic case reports from Turkana North sentinel clinics. All citizen names stripped. WHO EDL codes mapped.'
            : simScenario === 'coldchain'
            ? 'IoT thermistor excursion recorded at Wajir PHC (Temp: 9.8°C, Compressor duty cycle failed).'
            : 'Garissa depot stock balance dropped below 15% threshold for Pediatric Normal Saline.',
        },
      ]);
      setSimStep(2);
    }, 600);

    setTimeout(async () => {
      setSimLogs((prev) => [
        ...prev,
        {
          timestamp: now(),
          agent: simScenario === 'outbreak' ? 'AGENT-EPIDEMIC-PREDICTION' : 'AGENT-LOGISTICS-SUPPLY',
          event: simScenario === 'outbreak' ? 'trajectory.forecast.generated' : 'stock.depletion.warning',
          detail: simScenario === 'outbreak'
            ? 'Cori Rt Bayesian renewal estimated R_t = 1.48 (95% CI: 1.28-1.72). Doubling time 5.2 days. 30-day case surge imminent.'
            : simScenario === 'coldchain'
            ? 'Thermal degradation model predicts cold-chain loss in 4.2 hours. 1,400 Measles-Rubella doses at critical risk.'
            : 'XGBoost 30-day stockout probability reaches 84.6%. Runway depleted to 3.8 days.',
        },
      ]);
      setSimStep(3);

      try {
        const shap = await fetchShapExplanation('PHC-C01-002', 'Amoxicillin 250mg Dispersible');
        setSimShapResult(shap);
      } catch (e) {
        // resilient fallback
      }
    }, 1400);

    setTimeout(async () => {
      setSimLogs((prev) => [
        ...prev,
        {
          timestamp: now(),
          agent: 'AGENT-XAI-EXPLAINABILITY',
          event: 'card.why_at_risk.published',
          detail: 'TreeSHAP decomposed logits into key drivers: Consumption Velocity (+42.6%), Syndromic Surge (+28.4%), Lead Time (+16.8%).',
        },
      ]);

      try {
        const whatIf = await runWhatIfSimulation('PHC-TURK-001', 'STOCK_INJECTION', { units: 4500 });
        setSimWhatIfResult(whatIf);
      } catch (e) {
        // resilient fallback
      }

      setSimStep(4);
    }, 2200);

    setTimeout(() => {
      setSimLogs((prev) => [
        ...prev,
        {
          timestamp: now(),
          agent: 'AGENT-SECURITY-HITL-GOVERNANCE',
          event: 'docket.proposal.queued',
          detail: 'Action Docket #SIM-9920 drafted by Logistics Agent. Autonomous dispatch BLOCKED. Awaiting Ministerial Director ECDSA signature.',
        },
      ]);
      setSimStep(5);
      setSimRunning(false);
    }, 3000);
  };

  const handleAuthorizeSimDocket = async () => {
    try {
      const res = await authorizeActionDocket('DOCKET-SIM-9920', 'DR_V_RAO', 'National Health Director');
      setSimDocketAuth(res);
      setSimLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString().substring(11, 19),
          agent: 'AGENT-SECURITY-HITL-GOVERNANCE',
          event: 'hitl.action.authorized',
          detail: `Director Dr. V. Rao cryptographically signed docket. Sig: ${res.cryptographic_signature.substring(0, 24)}... Rollback token minted: ${res.rollback_token}. Appended to Merkle Ledger Block #1042.`,
        },
      ]);
    } catch (e) {
      console.warn('Authorization error in simulation');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse-subtle"></span>
            <span className="text-[11px] font-bold tracking-wider text-blue-700 uppercase font-mono">
              FIPS 140-3 &amp; FEDRAMP HIGH SOVEREIGN STACK
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Sovereign Multi-Agent Architecture &amp; AI/ML Stack</span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              10/10 AGENTS VERIFIED
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous multi-agent orchestration, Bayesian epidemiological modeling, TreeSHAP explainability, and cryptographic Human-in-the-Loop governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-mono">
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600">DEFCON:</span>
            <span className="font-bold text-blue-700">{systemState?.defcon_level || 4}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">PHCs:</span>
            <span className="font-bold text-slate-800">2,840</span>
          </div>

          <button
            onClick={loadStatus}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Swarm Status</span>
          </button>

          <a
            href="/VitaGrid_GOV_Sovereign_AI_Swarm_End_to_End.ipynb"
            download="VitaGrid_GOV_Sovereign_AI_Swarm_End_to_End.ipynb"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            title="Download End-to-End Sovereign AI/ML Jupyter Notebook"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ipynb</span>
          </a>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4 pt-2 rounded-t-xl shadow-2xs overflow-x-auto no-scrollbar">
        {[
          { id: 'architecture', label: '1. Multi-Agent Mesh & Swarm', icon: Network },
          { id: 'models', label: '2. AI / ML Model Pipelines', icon: Cpu },
          { id: 'security', label: '3. Zero-PII & HITL Governance', icon: ShieldCheck },
          { id: 'integration', label: '4. Real-Time & Frontend Matrix', icon: Zap },
          { id: 'simulator', label: '5. Interactive Swarm Simulator', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: MULTI-AGENT MESH & SWARM
          ========================================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* Interactive 5-Layer Architecture Diagram */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider font-mono">
                  5-Layer Sovereign Multi-Agent Execution Flow
                </h3>
                <p className="text-xs text-slate-500">
                  Hover or click any layer to highlight interconnected specialist agents, event topics, and execution contracts.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded self-start sm:self-auto">
                ENCLAVE-SOV-NAT-01
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Layer 1 */}
              <div
                onMouseEnter={() => setHoveredLayer(1)}
                onMouseLeave={() => setHoveredLayer(null)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  hoveredLayer === 1
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm ring-2 ring-indigo-200'
                    : 'border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs mb-2">
                    <Database className="w-4 h-4" />
                    <span>1. Ingestion Enclave</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    IoT cold-chain telemetry, eLMIS &amp; syndromic feeds. Strips PII and normalizes to WHO EDL codes.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-indigo-100 flex items-center justify-between text-[10px] font-mono text-indigo-800">
                  <span>Zero-PII Redaction</span>
                  <span className="font-bold">ACTIVE</span>
                </div>
              </div>

              {/* Layer 2 */}
              <div
                onMouseEnter={() => setHoveredLayer(2)}
                onMouseLeave={() => setHoveredLayer(null)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  hoveredLayer === 2
                    ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-200'
                    : 'border-blue-200 bg-blue-50/40 hover:bg-blue-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs mb-2">
                    <Radio className="w-4 h-4" />
                    <span>2. Event Mesh &amp; Store</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Redis Pub/Sub event bus, 28+ continuous feature store tensors, and append-only SHA-256 Merkle audit ledger.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-blue-100 flex items-center justify-between text-[10px] font-mono text-blue-800">
                  <span>Latency &lt;2ms</span>
                  <span className="font-bold">HEALTHY</span>
                </div>
              </div>

              {/* Layer 3 */}
              <div
                onMouseEnter={() => setHoveredLayer(3)}
                onMouseLeave={() => setHoveredLayer(null)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  hoveredLayer === 3
                    ? 'border-purple-500 bg-purple-50 shadow-sm ring-2 ring-purple-200'
                    : 'border-purple-200 bg-purple-50/40 hover:bg-purple-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs mb-2">
                    <Cpu className="w-4 h-4" />
                    <span>3. Specialist Swarm</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Commander Orchestrator + 9 specialized models (Rt Cori, XGBoost, PuLP, TreeSHAP, Digital Twin, Protocol RAG).
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-purple-100 flex items-center justify-between text-[10px] font-mono text-purple-800">
                  <span>10 Agents Active</span>
                  <span className="font-bold">SYNCED</span>
                </div>
              </div>

              {/* Layer 4 */}
              <div
                onMouseEnter={() => setHoveredLayer(4)}
                onMouseLeave={() => setHoveredLayer(null)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  hoveredLayer === 4
                    ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-200'
                    : 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>4. HITL Governance</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Strict Human-in-the-Loop authorization gate. Ministerial ECDSA signing + rollback tokens (RBK-XXXX).
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-[10px] font-mono text-amber-800">
                  <span>Zero Auto-Dispatch</span>
                  <span className="font-bold">ENFORCED</span>
                </div>
              </div>

              {/* Layer 5 */}
              <div
                onMouseEnter={() => setHoveredLayer(5)}
                onMouseLeave={() => setHoveredLayer(null)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  hoveredLayer === 5
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-200'
                    : 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mb-2">
                    <Zap className="w-4 h-4" />
                    <span>5. Real-Time UI</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    React 19 + WebSockets (/ws/kpis) streaming live KPIs, MapLibre heatmaps &amp; Action Dockets.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px] font-mono text-emerald-800">
                  <span>WebSockets Active</span>
                  <span className="font-bold">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Dive Agent Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Select Specialist Agent
                </span>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  10 REGISTERED
                </span>
              </div>

              <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
                {AGENTS_LIST.map((agent) => {
                  const Icon = agent.icon;
                  const isSelected = selectedAgent.id === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white text-blue-600 border border-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold truncate leading-tight">{agent.name}</div>
                          <div className={`text-[10px] font-mono truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {agent.codename}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[9px] font-mono ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                          {agent.telemetryLatency}
                        </span>
                        <span
                          className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 ${
                            isSelected ? 'bg-white/25 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedAgent.layer}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {selectedAgent.codename}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 mt-1">{selectedAgent.name}</h2>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Operational</span>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1">
                  Sovereign Responsibility &amp; Execution Contract
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                  {selectedAgent.responsibility}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">
                  Core Algorithmic Foundations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedAgent.keyAlgorithms.map((algo, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-md bg-white border border-slate-200 text-xs text-slate-800 font-medium"
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{algo}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase font-mono text-slate-500 block mb-1.5">
                    Subscribed Input Topics
                  </span>
                  <div className="space-y-1">
                    {selectedAgent.inputEvents.map((evt, i) => (
                      <div key={i} className="text-xs font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {evt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase font-mono text-slate-500 block mb-1.5">
                    Published Output Events
                  </span>
                  <div className="space-y-1">
                    {selectedAgent.outputEvents.map((evt, i) => (
                      <div key={i} className="text-xs font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {evt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: AI / ML MODEL PIPELINES (Deep Mathematical Foundations)
          ========================================================================= */}
      {activeTab === 'models' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Primal-Dual Linear Programming Optimizer */}
            <div className="bg-white rounded-xl border border-blue-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">1. Primal-Dual LP Logistics Optimizer</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  PuLP / Simplex Solver
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Minimizes total Ton-Kilometer transport cost and urgency-weighted penalties while respecting multi-echelon depot bounds, vehicle payloads, and the statutory 48-hour replenishment cutoff.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1 overflow-x-auto">
                <div className="text-blue-800 font-bold">Primal Objective:</div>
                <div>min sum_{`{i,j,k}`} [ (d_{`{ij}`} * c_transport + w_{`{jk}`} * penalty) * x_{`{ijk}`} ]</div>
                <div className="text-purple-800 font-bold mt-1">Dual Shadow Formulation:</div>
                <div>max sum [ D_{`{jk}`} * mu_{`{jk}`} ] - sum [ S_{`{ik}`} * pi_{`{ik}`} ]  s.t.  mu_{`{jk}`} - pi_{`{ik}`} &lt;= cost_{`{ijk}`}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Commodity Scope</div>
                  <div className="font-bold text-slate-900 mt-0.5">340 Catalog Items</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Simplex Solve Time</div>
                  <div className="font-bold text-emerald-700 mt-0.5">&lt; 85 ms</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Ton-Km Savings</div>
                  <div className="font-bold text-blue-700 mt-0.5">-31.4% Cost Δ</div>
                </div>
              </div>
            </div>

            {/* 2. Cold-Chain Thermal Inertia & Excursion Risk Model */}
            <div className="bg-white rounded-xl border border-cyan-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
                  <h3 className="text-sm font-bold text-slate-900">2. Cold-Chain IoT Thermal Inertia Model</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded border border-cyan-200">
                  Physics Differential ODE
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Physics-informed thermal dynamics predicting hours-to-breach before vaccine batch spoilage occurs. Evaluates backup solar battery and ambient temperature gradients.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1 overflow-x-auto">
                <div className="text-cyan-800 font-bold">Thermal Differential Equation:</div>
                <div>dT/dt = - k_insulation * (T_core - T_ambient) + (P_cooling(B_solar) / C_thermal) - Q_door(omega)</div>
                <div className="text-emerald-800 font-bold mt-1">Analytical Runway Solution (t* to 8.0°C):</div>
                <div>t* = - ln((T_ambient - 8.0) / (T_ambient - T_0)) / (k_insulation + gamma * omega)</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Safe Corridor</div>
                  <div className="font-bold text-emerald-700 mt-0.5">2.0°C - 8.0°C</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">IoT Ping Rate</div>
                  <div className="font-bold text-slate-900 mt-0.5">Every 4s</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Thermal Buffer</div>
                  <div className="font-bold text-blue-700 mt-0.5">18.5 Hours</div>
                </div>
              </div>
            </div>

            {/* 3. Bayesian Cori Rt Reproduction Number Model */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">3. Bayesian Reproduction Number (R_t)</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  Cori et al. (EpiEstim)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Computes instantaneous reproduction number from syndromic time-series with a Gamma prior and serial interval distribution.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto">
                R_t = I_t / [ sum_{`{s=1}`}^t I_{`{t-s}`} * w_s ] ~ Gamma(1 + sum(I), 1 + sum(Lambda))
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Serial Interval</div>
                  <div className="font-bold text-slate-900 mt-0.5">4.8 ± 2.3d</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Horizon Steps</div>
                  <div className="font-bold text-slate-900 mt-0.5">14, 30, 60, 90d</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Credible Interval</div>
                  <div className="font-bold text-emerald-700 mt-0.5">95% Bayesian</div>
                </div>
              </div>
            </div>

            {/* 4. XGBoost + TreeSHAP Stockout Predictor */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">4. XGBoost &amp; TreeSHAP Stockout Model</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                  28+ Feature Tensor
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Predicts 30-day stock depletion probability by combining consumption velocity, supplier lead-time variance, and syndromic surges.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 overflow-x-auto">
                phi_i(x) = sum [ (|S|!(|F|-|S|-1)! / |F|!) * (f(S U {`{i}`}) - f(S)) ]
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Inference Latency</div>
                  <div className="font-bold text-slate-900 mt-0.5">&lt; 8.4 ms</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">WAPE Error</div>
                  <div className="font-bold text-emerald-700 mt-0.5">0.074 (7.4%)</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Top Driver</div>
                  <div className="font-bold text-blue-700 mt-0.5">Depletion Velocity</div>
                </div>
              </div>
            </div>

            {/* 5. Clinician Fatigue & Rostering Model */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">5. Clinician Fatigue &amp; Rostering Model</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                  Workforce Burnout AI
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monitors shift fatigue via acuity-weighted patient load, overtime strain, and consecutive duty hours. Suggests mutual-aid staff redeployment.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                Burnout_Idx = 0.45*(Ratio/Target) + 0.35*(Acuity) + 0.20*(Consecutive_Hours/48)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Fatigue Threshold</div>
                  <div className="font-bold text-red-600 mt-0.5">&gt; 0.65 Critical</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Optimizer Type</div>
                  <div className="font-bold text-slate-900 mt-0.5">LP Float Rebalance</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Projected Strain Δ</div>
                  <div className="font-bold text-emerald-700 mt-0.5">-43.6% Burnout</div>
                </div>
              </div>
            </div>

            {/* 6. Protocol RAG & Grounded Citations */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">6. Sovereign Protocol RAG &amp; Grounding</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                  BM25 + Dense Cosine
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hybrid reciprocal rank fusion over sovereign clinical treatment guidelines and logistics SOPs. Enforces statutory citations and rejects ungrounded hallucinations.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                Score(d, q) = 0.5 * BM25(d, q) + 0.5 * CosineSim(E(d), E(q))
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Vector Dimension</div>
                  <div className="font-bold text-slate-900 mt-0.5">768 Dim Dense</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Citation Check</div>
                  <div className="font-bold text-emerald-700 mt-0.5">100% Grounded</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-mono">Retrieval SLA</div>
                  <div className="font-bold text-blue-700 mt-0.5">&lt; 45 ms</div>
                </div>
              </div>
            </div>

            {/* 7. LoRA Domain Adapter & Hierarchical Context Compression */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3 md:col-span-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">7. LoRA Domain Adapter &amp; Hierarchical Context Compression</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                  PEFT Rank-16 / Alpha-32
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fine-tuned on the National Essential Medicines List, historical Action Dockets, and sovereign medical guidelines. Employs hierarchical KV-cache compression to summarize thousands of facility logs into high-density tokens for the AI Copilot.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-800 uppercase">Tier 1: Facility Raw</div>
                  <div className="font-bold text-slate-800 mt-1">100,000+ Raw Logs/Day</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Aggregated at 2,840 PHCs</div>
                </div>
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <div className="text-[10px] font-bold text-blue-800 uppercase">Tier 2: District Vectors</div>
                  <div className="font-bold text-slate-800 mt-1">~5,000 Semantic Vectors</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">47 County Clusters</div>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Tier 3: Sovereign Digest</div>
                  <div className="font-bold text-slate-800 mt-1">512 Executive Tokens</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">87.4% KV-cache reduction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ZERO-PII & HITL GOVERNANCE
          ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">
                  Sovereign Cryptographic &amp; Legal Governance Perimeter
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                FIPS 140-3 CONCURRENT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>1. Zero-PII Enclave</span>
                </div>
                <p className="text-xs text-slate-600">
                  All inbound telemetry passes through regex sanitization stripping national IDs, clinician names, phone numbers, and IP addresses before AI models ingest tensors.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>2. Append-Only Audit Ledger</span>
                </div>
                <p className="text-xs text-slate-600">
                  Every inference step and state transition is cryptographically appended to a Merkle SHA-256 hash chain with HMAC-256 verification, preventing historical tampering.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>3. No Autonomous Dispatch</span>
                </div>
                <p className="text-xs text-slate-600">
                  No medicine transfer or staff relocation can be executed autonomously. The platform strictly queues Action Dockets for the National Health Director's cryptographic sign-off.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Zero-PII Enclave Tester */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Live Zero-PII Sanitization Enclave Sandbox
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                FEDRAMP HIGH TESTER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 font-mono block mb-1">
                  Raw Inbound Clinical Record (Pre-Sanitization)
                </label>
                <textarea
                  value={rawPiiInput}
                  onChange={(e) => {
                    setRawPiiInput(e.target.value);
                    runZeroPiiSanitization(e.target.value);
                  }}
                  rows={4}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-emerald-700 font-mono block mb-1">
                  Sanitized Enclave Output (Forwarded to Event Mesh)
                </label>
                <div className="w-full h-[88px] text-xs font-mono p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg text-slate-800 overflow-y-auto">
                  {sanitizedPiiOutput}
                </div>
              </div>
            </div>
          </div>

          {/* Append-Only Merkle Audit Ledger Explorer */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Cryptographic Append-Only Merkle Ledger Chain
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                CHAIN VALIDATED: 1,042 BLOCKS
              </span>
            </div>

            <div className="space-y-2">
              {[
                {
                  block: '#1042',
                  prevHash: '7f9a2b8c4d1e0f3a5b7c...',
                  currHash: '3a8f1e9c2b4d6e0f8a2b...',
                  event: 'HITL_MINISTERIAL_AUTHORIZE',
                  docket: 'DOCKET-ACT-842',
                  authorizer: 'DR_V_RAO (National Director)',
                  status: 'VERIFIED',
                },
                {
                  block: '#1041',
                  prevHash: '8e0f2a4c6d8e0f2a7f9a...',
                  currHash: '7f9a2b8c4d1e0f3a5b7c...',
                  event: 'WHATIF_COUNTERFACTUAL_RUN',
                  docket: 'SIM-TURK-4500',
                  authorizer: 'SYSTEM_AUTONOMOUS',
                  status: 'VERIFIED',
                },
                {
                  block: '#1040',
                  prevHash: '00000000000000000000...',
                  currHash: '8e0f2a4c6d8e0f2a7f9a...',
                  event: 'SYSTEM_DEFCON_TRANSITION',
                  docket: 'DEFCON-4_WATCH',
                  authorizer: 'COMMANDER-ORCHESTRATOR',
                  status: 'VERIFIED',
                },
              ].map((blk, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{blk.block}</span>
                    <span className="font-semibold text-slate-800">{blk.event}</span>
                    <span className="text-slate-400">({blk.docket})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Auth: <strong className="text-slate-700">{blk.authorizer}</strong></span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {blk.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: REAL-TIME & FRONTEND MATRIX + TECH STACK
          ========================================================================= */}
      {activeTab === 'integration' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">
                  Real-Time API &amp; WebSocket Frontend Wiring Matrix
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                FASTAPI + WEBSOCKETS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 font-mono uppercase">
                    <th className="p-2.5">UI Component / Page</th>
                    <th className="p-2.5">Endpoint / Channel</th>
                    <th className="p-2.5">Method / Protocol</th>
                    <th className="p-2.5">Underlying Specialist Agent</th>
                    <th className="p-2.5">Update Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Command Center KPI Cards</td>
                    <td className="p-2.5 font-mono text-blue-700">/ws/kpis</td>
                    <td className="p-2.5 font-mono text-slate-600">WebSocket</td>
                    <td className="p-2.5 text-slate-700">Commander Orchestrator</td>
                    <td className="p-2.5 text-slate-500 font-mono">Every 8s pulse</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">DEFCON Banner &amp; Selector</td>
                    <td className="p-2.5 font-mono text-blue-700">/command-center/defcon</td>
                    <td className="p-2.5 font-mono text-slate-600">POST (JSON)</td>
                    <td className="p-2.5 text-slate-700">Commander Orchestrator</td>
                    <td className="p-2.5 text-slate-500 font-mono">Immediate transition</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Why At Risk? TreeSHAP Cards</td>
                    <td className="p-2.5 font-mono text-blue-700">/predictions/explain/{'{fac}'}</td>
                    <td className="p-2.5 font-mono text-slate-600">GET (REST)</td>
                    <td className="p-2.5 text-slate-700">Explainable AI (TreeSHAP)</td>
                    <td className="p-2.5 text-slate-500 font-mono">&lt; 10ms inference</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">What-If Simulation Sandbox</td>
                    <td className="p-2.5 font-mono text-blue-700">/predictions/what-if</td>
                    <td className="p-2.5 font-mono text-slate-600">POST (JSON)</td>
                    <td className="p-2.5 text-slate-700">Counterfactual What-If</td>
                    <td className="p-2.5 text-slate-500 font-mono">Instant counterfactual</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">MapLibre Geospatial Heatmap</td>
                    <td className="p-2.5 font-mono text-blue-700">/digital-twin/corridor-heatmap</td>
                    <td className="p-2.5 font-mono text-slate-600">GET (GeoJSON)</td>
                    <td className="p-2.5 text-slate-700">Geospatial &amp; Digital Twin</td>
                    <td className="p-2.5 text-slate-500 font-mono">Continuous sync</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Logistics Rebalance Proposals</td>
                    <td className="p-2.5 font-mono text-blue-700">/logistics/rebalance-proposals</td>
                    <td className="p-2.5 font-mono text-slate-600">GET (REST)</td>
                    <td className="p-2.5 text-slate-700">Logistics &amp; Multi-Echelon Supply</td>
                    <td className="p-2.5 text-slate-500 font-mono">Real-time LP Simplex</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Cold-Chain IoT Sentinel</td>
                    <td className="p-2.5 font-mono text-blue-700">/logistics/cold-chain-status</td>
                    <td className="p-2.5 font-mono text-slate-600">GET (REST) + WS</td>
                    <td className="p-2.5 text-slate-700">Logistics / Cold-Chain Model</td>
                    <td className="p-2.5 text-slate-500 font-mono">Every 4s ping</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Human Approvals Signing</td>
                    <td className="p-2.5 font-mono text-blue-700">/approvals/authorize</td>
                    <td className="p-2.5 font-mono text-slate-600">POST (ECDSA)</td>
                    <td className="p-2.5 text-slate-700">Security &amp; HITL Governance</td>
                    <td className="p-2.5 text-slate-500 font-mono">On-demand sign-off</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">AI Decision Copilot RAG</td>
                    <td className="p-2.5 font-mono text-blue-700">/predictions/clinical-query</td>
                    <td className="p-2.5 font-mono text-slate-600">POST (JSON)</td>
                    <td className="p-2.5 text-slate-700">Clinical Protocol RAG</td>
                    <td className="p-2.5 text-slate-500 font-mono">Sub-second retrieval</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tech Stack Summary Grid */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">
                  Complete Sovereign Technology Stack Summary
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                PRODUCTION RUNTIME
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs pb-1.5 border-b border-slate-200">
                  <Binary className="w-4 h-4 text-blue-600" />
                  <span>Frontend Engineering</span>
                </div>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• <strong className="text-slate-800">React 19 &amp; TypeScript 5.7</strong></li>
                  <li>• <strong className="text-slate-800">Tailwind CSS</strong> (zero-pill design tokens)</li>
                  <li>• <strong className="text-slate-800">MapLibre GL</strong> &amp; GeoJSON Catchment Maps</li>
                  <li>• <strong className="text-slate-800">Lucide React</strong> iconography</li>
                  <li>• <strong className="text-slate-800">Vite 8</strong> production build system</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs pb-1.5 border-b border-slate-200">
                  <Server className="w-4 h-4 text-emerald-600" />
                  <span>Backend &amp; Infrastructure</span>
                </div>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• <strong className="text-slate-800">FastAPI &amp; Python 3.10+</strong></li>
                  <li>• <strong className="text-slate-800">Asyncio &amp; Redis</strong> Pub/Sub Event Mesh</li>
                  <li>• <strong className="text-slate-800">PostgreSQL + PostGIS</strong> spatial database</li>
                  <li>• <strong className="text-slate-800">TimescaleDB</strong> IoT sensor time-series</li>
                  <li>• <strong className="text-slate-800">Docker</strong> multi-stage containerization</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs pb-1.5 border-b border-slate-200">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>AI / ML &amp; Optimization Stack</span>
                </div>
                <ul className="space-y-1.5 text-slate-600">
                  <li>• <strong className="text-slate-800">XGBoost &amp; TreeSHAP</strong> explainability</li>
                  <li>• <strong className="text-slate-800">SciPy &amp; PuLP</strong> Primal-Dual LP solver</li>
                  <li>• <strong className="text-slate-800">Bayesian EpiEstim</strong> Cori et al. $R_t$ Engine</li>
                  <li>• <strong className="text-slate-800">PyTorch + PEFT / LoRA</strong> adapter</li>
                  <li>• <strong className="text-slate-800">Hybrid BM25 + Dense RAG</strong> vector search</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: INTERACTIVE SWARM SIMULATOR & PLAYGROUND
          ========================================================================= */}
      {activeTab === 'simulator' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Sovereign Multi-Agent Incident Injection Simulator</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inject synthetic national health emergencies, trace the live multi-agent event bus propagation, and complete the full HITL sign-off lifecycle.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={simScenario}
                  onChange={(e) => setSimScenario(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="outbreak">Scenario A: Turkana Monsoon Outbreak</option>
                  <option value="coldchain">Scenario B: Wajir Vaccine Thermal Breach</option>
                  <option value="stockout">Scenario C: Garissa Saline Depletion</option>
                </select>

                <button
                  onClick={handleRunSimulator}
                  disabled={simRunning}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 ${simRunning ? 'animate-spin' : ''}`} />
                  <span>{simRunning ? 'Executing Swarm...' : 'Inject Incident'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { step: 1, label: '1. Ingestion & Zero-PII', agent: 'AGENT-DATA-INGESTION' },
                { step: 2, label: '2. Predictive Inference', agent: 'AGENT-EPIDEMIC' },
                { step: 3, label: '3. TreeSHAP & What-If', agent: 'AGENT-XAI' },
                { step: 4, label: '4. HITL Governance Gate', agent: 'AGENT-SECURITY' },
              ].map((st) => (
                <div
                  key={st.step}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    simStep >= st.step
                      ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono">{st.agent}</span>
                    {simStep >= st.step && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div className="text-xs font-bold mt-1">{st.label}</div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-100 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LIVE MULTI-AGENT REDIS EVENT BUS STREAM</span>
                </span>
                <span className="text-emerald-400 font-bold">2,840 PHC NODES LISTENING</span>
              </div>

              {simLogs.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-xs">
                  Click "Inject Incident" to trigger multi-agent dispatch across the sovereign bus.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {simLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed animate-in fade-in duration-100">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className="text-blue-400 font-bold shrink-0">{log.agent}</span>
                      <span className="text-emerald-400 font-semibold shrink-0">&rarr; {log.event}:</span>
                      <span className="text-slate-300">{log.detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {simShapResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-900">
                    <span>XAI TREESHAP ATTRIBUTION WATERFALL</span>
                    <span className="text-[10px] bg-purple-100 px-1.5 py-0.5 rounded text-purple-700">POLYNOMIAL SHAP</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {simShapResult.plain_language_narrative}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {simShapResult.tree_shap_attributions?.map((attr: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 font-medium">{attr.factor}</span>
                        <span className="font-mono font-bold text-purple-700">+{attr.contribution_pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-900 mb-1">
                      <span>WHAT-IF SANDBOX COUNTERFACTUAL</span>
                      <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700">VERDICT: FAVORABLE</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {simWhatIfResult?.outcome_summary || 'Injecting 4,500 units extends runway by 26.7 days, reducing stockout probability from 78.4% to 14.2%.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-blue-100">
                    {simDocketAuth ? (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                          <span>Ministerial Cryptographic Authorization Completed</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-600">
                          Rollback Token: <strong className="text-emerald-700">{simDocketAuth.rollback_token}</strong>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleAuthorizeSimDocket}
                        disabled={simStep < 4}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          simStep >= 4
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Sign Action Docket as National Director (ECDSA SHA-256)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
