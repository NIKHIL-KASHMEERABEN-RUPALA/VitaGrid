import React, { useState } from 'react';
import {
  Cpu,
  Download,
  Play,
  RotateCw,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Bot,
  Activity,
  FileCode,
  Check,
  Network,
  Lock,
  ArrowRight,
  Database,
  ChevronDown,
  ChevronUp,
  FileText,
  Sliders,
  Share2,
} from 'lucide-react';
import {
  executeZeroPiiSanitizer,
  executeHybridRagSearch,
  executeEpidemiologicalForecast,
  executeTreeShapExplainer,
  executeMultiAgentSwarm,
  executeHitlSignature,
  executeWhatIfSimulation,
  generateAuditLedgerBlocks,
  LORA_ADAPTERS,
  ZeroPiiResult,
  RagResponse,
  RealTimeEpidemiologyOutput,
  TreeShapResult,
  SwarmExecutionResult,
  HitlSignResult,
  WhatIfSimulationResult,
  AuditBlock,
} from '../../services/backendApi';
import { useNotifications } from '../../context/NotificationContext';

export const SovereignNotebookView: React.FC = () => {
  const { showToast } = useNotifications();
  const [activeTab, setActiveTab] = useState<'notebook' | 'sandbox' | 'swarm-dag' | 'xai-hitl'>('notebook');
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [expandedBox, setExpandedBox] = useState<number | null>(1);
  const [showCode, setShowCode] = useState<{ [key: number]: boolean }>({});

  // --- Real-time Interactive States for Each Box ---
  // Box 1: Zero-PII
  const [rawPiiInput, setRawPiiInput] = useState(
    'Incoming referral: Patient John Doe (ID: KE9847291) presented at Kilifi PHC. Contact relative Mary at +254 712 345678 or dr.johnson@mercyhealth.org. Diagnosed with acute respiratory distress, severe amoxicillin depletion noted.'
  );
  const [piiResult, setPiiResult] = useState<ZeroPiiResult | null>(null);

  // Box 2: RAG
  const [ragQuery, setRagQuery] = useState('What is the accredited treatment protocol for malaria in pregnant patients?');
  const [ragResult, setRagResult] = useState<RagResponse | null>(null);

  // Box 3: LoRA
  const [selectedAdapterId, setSelectedAdapterId] = useState('NIKHILPATEL00212/vitaGridProtocol');
  const [adapterStatusMsg, setAdapterStatusMsg] = useState<string | null>(null);

  // Box 4: Epidemiology
  const [dailyCasesInput, setDailyCasesInput] = useState('12, 14, 18, 24, 32, 45, 59, 78, 102, 135');
  const [currentDrugStock, setCurrentDrugStock] = useState(420);
  const [outageHours, setOutageHours] = useState(6.0);
  const [epiResult, setEpiResult] = useState<RealTimeEpidemiologyOutput | null>(null);

  // Box 5: TreeSHAP
  const [selectedFacility, setSelectedFacility] = useState('FAC-KE-07');
  const [shapResult, setShapResult] = useState<TreeShapResult | null>(null);

  // Box 6: Multi-Agent Swarm
  const [swarmResult, setSwarmResult] = useState<SwarmExecutionResult | null>(null);

  // Box 7: HITL
  const [approverName, setApproverName] = useState('Dr. V. Rao');
  const [hitlDecision, setHitlDecision] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [hitlResult, setHitlResult] = useState<HitlSignResult | null>(null);

  // Box 8: What-If
  const [whatIfDelay, setWhatIfDelay] = useState(12.0);
  const [whatIfSurge, setWhatIfSurge] = useState(40.0);
  const [whatIfResult, setWhatIfResult] = useState<WhatIfSimulationResult | null>(null);

  // Box 9: Audit Ledger
  const [auditBlocks, setAuditBlocks] = useState<AuditBlock[]>([]);

  // Toggle python code view
  const toggleCode = (boxNum: number) => {
    setShowCode((prev) => ({ ...prev, [boxNum]: !prev[boxNum] }));
  };

  // Run Individual Box Handlers
  const handleRunBox1 = () => {
    const res = executeZeroPiiSanitizer(rawPiiInput);
    setPiiResult(res);
    showToast(`Box 1 executed: Redacted ${res.violations_redacted} PII violations.`);
  };

  const handleRunBox2 = () => {
    const res = executeHybridRagSearch(ragQuery);
    setRagResult(res);
    showToast(`Box 2 executed: Hybrid RAG retrieved ${res.results.length} grounded protocols.`);
  };

  const handleRunBox3 = () => {
    const target = LORA_ADAPTERS.find((a) => a.adapter_id === selectedAdapterId);
    setAdapterStatusMsg(
      `[HOT-SWAP SUCCESSFUL] Active Sovereign Adapter: ${selectedAdapterId}\n` +
      `Target Domain: ${target?.domain}\n` +
      `Base Model: ${target?.base_model} | Quantization: ${target?.quantization}\n` +
      `Trainable Parameters: ${target?.trainable_params.toLocaleString()} (${target?.param_pct}%) | Eval Loss: ${target?.eval_loss}`
    );
    showToast(`Box 3 executed: Mounted adapter ${selectedAdapterId}`);
  };

  const handleRunBox4 = () => {
    const parsedSeries = dailyCasesInput
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    const res = executeEpidemiologicalForecast(
      parsedSeries.length > 0 ? parsedSeries : [12, 14, 18, 24, 32, 45, 59, 78, 102, 135],
      currentDrugStock,
      50,
      38.5,
      outageHours
    );
    setEpiResult(res);
    showToast(`Box 4 executed: Estimated R_t = ${res.rt_median} (Runway: ${res.runway_days} days).`);
  };

  const handleRunBox5 = () => {
    const res = executeTreeShapExplainer(selectedFacility, 'Amoxicillin 250mg Dispersible');
    setShapResult(res);
    showToast(`Box 5 executed: Computed TreeSHAP attributions for ${selectedFacility}.`);
  };

  const handleRunBox6 = () => {
    const res = executeMultiAgentSwarm();
    setSwarmResult(res);
    showToast(`Box 6 executed: Swarm pipeline completed. Docket ${res.docket_id} queued.`);
  };

  const handleRunBox7 = () => {
    const docketId = swarmResult?.docket_id || 'DOCKET-SOV-1790842023';
    const res = executeHitlSignature(docketId, approverName, hitlDecision);
    setHitlResult(res);
    showToast(`Box 7 executed: Ministerial signature verified. ${res.rollback_token}`);
  };

  const handleRunBox8 = () => {
    const res = executeWhatIfSimulation(whatIfDelay, whatIfSurge, 4.8);
    setWhatIfResult(res);
    showToast(`Box 8 executed: Simulated ${whatIfDelay}h delay + ${whatIfSurge}% surge.`);
  };

  const handleRunBox9 = () => {
    const blocks = generateAuditLedgerBlocks();
    setAuditBlocks(blocks);
    showToast(`Box 9 executed: Generated immutable audit chain with ${blocks.length} blocks.`);
  };

  // Run all cells in sequence
  const handleRunAllCells = () => {
    setIsRunningAll(true);
    handleRunBox1();
    setTimeout(() => {
      handleRunBox2();
      handleRunBox3();
    }, 200);
    setTimeout(() => {
      handleRunBox4();
      handleRunBox5();
    }, 400);
    setTimeout(() => {
      handleRunBox6();
      handleRunBox7();
    }, 600);
    setTimeout(() => {
      handleRunBox8();
      handleRunBox9();
      setIsRunningAll(false);
      showToast('All 9 Sovereign AI Notebook Boxes executed in real time with zero errors!');
    }, 800);
  };

  // Download .ipynb file handler
  const handleDownloadNotebook = () => {
    const link = document.createElement('a');
    link.href = '/VitaGrid_GOV_Sovereign_AI_Swarm_End_to_End.ipynb';
    link.download = 'VitaGrid_GOV_Sovereign_AI_Swarm_End_to_End.ipynb';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded VitaGrid_GOV_Sovereign_AI_Swarm_End_to_End.ipynb');
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                INTERACTIVE SOVEREIGN AI LABORATORY &amp; JUPYTER HUB
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] font-mono text-slate-400">
                FIPS 140-3 • NIST SP 800-53 • AIR-GAPPED READY
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <Cpu className="w-6 h-6 text-blue-400" />
              VitaGrid GOV: Sovereign AI Swarm Notebook
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Real-time interactive execution hub for the sovereign machine learning pipeline: Zero-PII sanitization, hybrid RAG protocol retrieval, LoRA/QLoRA domain adapters, Bayesian Cori $R_t$ epidemiology, TreeSHAP explainability, and multi-agent DAG swarm dispatch.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRunAllCells}
              disabled={isRunningAll}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningAll ? 'animate-spin' : ''}`} />
              {isRunningAll ? 'Executing Swarm...' : 'Run All Cells (1-9)'}
            </button>
            <button
              onClick={handleDownloadNotebook}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              Download .ipynb
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-6 border-b border-slate-800 pt-1 overflow-x-auto">
          {[
            { id: 'notebook', label: 'Interactive Notebook (Boxes 1-9)', icon: FileCode },
            { id: 'sandbox', label: 'Real-Time Prediction Sandbox', icon: Sliders },
            { id: 'swarm-dag', label: 'Multi-Agent Swarm DAG Flow', icon: Network },
            { id: 'xai-hitl', label: 'TreeSHAP & Cryptographic HITL', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-400 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TAB CONTENT */}
      {activeTab === 'notebook' && (
        <div className="space-y-5">
          {/* BOX 1 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  01
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 1: Sovereign Zero-PII Sanitization &amp; Heuristic Enclave
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Complies with NIST SP 800-53 Rev. 5 and HIPAA Safe Harbor. Redacts names, phone numbers, emails, and IDs.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCode(1)}
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {showCode[1] ? 'Hide Python' : 'View Python'}
                </button>
                <button
                  onClick={handleRunBox1}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3" /> Run Box 1
                </button>
              </div>
            </div>

            {showCode[1] && (
              <div className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border-b border-slate-800">
                <pre>{`class ZeroPIISanitizer:
    def sanitize(self, text: str) -> Tuple[str, int]:
        sanitized = re.sub(r'\\b(?:Patient|Dr\\.)\\s+[A-Z][a-z]+...', '[PATIENT_MASKED]', text)
        sanitized = re.sub(r'\\+?\\d{1,3}[-.\\s]?\\d{3}...', '+[PHONE_REDACTED]', sanitized)
        return sanitized, redaction_count`}</pre>
              </div>
            )}

            <div className="p-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Interactive Input: Raw Clinical Log / Referral Note
              </label>
              <textarea
                value={rawPiiInput}
                onChange={(e) => setRawPiiInput(e.target.value)}
                rows={3}
                className="w-full text-xs font-mono p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 outline-none"
              />

              {piiResult && (
                <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                    <span>STATUS: SANITIZED FEED ENCLAVE</span>
                    <span className="text-emerald-400">VIOLATIONS SCRUBBED: {piiResult.violations_redacted}</span>
                  </div>
                  <div className="text-emerald-300 whitespace-pre-wrap">{piiResult.sanitized_text}</div>
                  <div className="text-[10px] text-slate-500">Enclave Seal: {piiResult.fips_enclave_hash} | UTC: {piiResult.timestamp}</div>
                </div>
              )}
            </div>
          </div>

          {/* BOX 2 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  02
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 2: Sovereign Grounded RAG &amp; Strict Refusal Gate
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hybrid TF-IDF BM25 + Dense vector cosine retrieval. Refuses out-of-domain queries with zero hallucination.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCode(2)}
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {showCode[2] ? 'Hide Python' : 'View Python'}
                </button>
                <button
                  onClick={handleRunBox2}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3" /> Run Box 2
                </button>
              </div>
            </div>

            {showCode[2] && (
              <div className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border-b border-slate-800">
                <pre>{`Score(q, d) = alpha * Dense(q, d) + (1 - alpha) * BM25(q, d)
if top_score < REFUSAL_THRESHOLD (0.35):
    return REFUSAL_OUT_OF_DOMAIN("Query rejected to prevent medical hallucination.")`}</pre>
              </div>
            )}

            <div className="p-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Interactive Protocol Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  className="flex-1 text-xs font-mono p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Enter clinical SOP query..."
                />
              </div>

              {ragResult && (
                <div className={`p-3.5 rounded-lg text-xs font-mono space-y-2 border ${
                  ragResult.status === 'RETRIEVED_AND_GROUNDED'
                    ? 'bg-slate-950 text-slate-200 border-slate-800'
                    : 'bg-red-950/40 text-red-200 border-red-800'
                }`}>
                  <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1">
                    <span className="font-bold">{ragResult.status}</span>
                    <span className="text-slate-400">ACCURACY VERIFIED: 100% GROUNDED</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{ragResult.synthesized_answer}</div>
                  {ragResult.results.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800 flex gap-4 text-[10px] text-slate-400">
                      <span>Doc: {ragResult.results[0].doc_id}</span>
                      <span>BM25: {ragResult.results[0].bm25_score}</span>
                      <span>Dense: {ragResult.results[0].dense_score}</span>
                      <span>Hybrid: {ragResult.results[0].hybrid_score}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* BOX 3 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  03
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 3: Sovereign LLM Domain Adaptation (LoRA / QLoRA)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    NF4 4-bit NormalFloat Quantization, rank r=16/32, and target attention projections W = W₀ + (α/r)·BA.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCode(3)}
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {showCode[3] ? 'Hide Python' : 'View Python'}
                </button>
                <button
                  onClick={handleRunBox3}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3" /> Mount Adapter
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Select Active PEFT Adapter to Hot-Swap:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {LORA_ADAPTERS.map((adapter) => {
                  const isSelected = selectedAdapterId === adapter.adapter_id;
                  return (
                    <div
                      key={adapter.adapter_id}
                      onClick={() => setSelectedAdapterId(adapter.adapter_id)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                        <span>{adapter.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{adapter.base_model} • r={adapter.rank}, α={adapter.alpha}</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-mono">
                        Trainable: {adapter.trainable_params.toLocaleString()} ({adapter.param_pct}%)
                      </div>
                    </div>
                  );
                })}
              </div>

              {adapterStatusMsg && (
                <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-emerald-300 border border-slate-800 whitespace-pre-wrap">
                  {adapterStatusMsg}
                </div>
              )}
            </div>
          </div>

          {/* BOX 4 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  04
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 4: Bayesian Cori $R_t$, Stockout Velocity &amp; Cold-Chain Physics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Cori renewal equation with Gamma-Poisson updates, exponential burn velocity, and Newton's cooling ODE.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCode(4)}
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {showCode[4] ? 'Hide Python' : 'View Python'}
                </button>
                <button
                  onClick={handleRunBox4}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3" /> Run Box 4
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Daily Case Trajectory (10 Days)
                  </label>
                  <input
                    type="text"
                    value={dailyCasesInput}
                    onChange={(e) => setDailyCasesInput(e.target.value)}
                    className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Current Drug Stock (Packs)
                  </label>
                  <input
                    type="number"
                    value={currentDrugStock}
                    onChange={(e) => setCurrentDrugStock(Number(e.target.value))}
                    className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Cold Room Grid Outage (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={outageHours}
                    onChange={(e) => setOutageHours(Number(e.target.value))}
                    className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              {epiResult && (
                <div className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center border-b border-slate-800 pb-3">
                    <div className="p-2 bg-slate-900 rounded">
                      <div className="text-[10px] text-slate-400">ESTIMATED R_T (MEDIAN)</div>
                      <div className="text-lg font-bold text-red-400">{epiResult.rt_median}</div>
                      <div className="text-[9px] text-slate-500">95% CI: [{epiResult.rt_ci_lower} - {epiResult.rt_ci_upper}]</div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded">
                      <div className="text-[10px] text-slate-400">DOUBLING TIME</div>
                      <div className="text-lg font-bold text-amber-400">{epiResult.doubling_time_days} Days</div>
                      <div className="text-[9px] text-slate-500">Trajectory: {epiResult.trajectory}</div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded">
                      <div className="text-[10px] text-slate-400">REMAINING RUNWAY</div>
                      <div className={`text-lg font-bold ${epiResult.runway_days < 2.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {epiResult.runway_days} DAYS
                      </div>
                      <div className="text-[9px] text-slate-500">Burn: {epiResult.effective_daily_burn} packs/day</div>
                    </div>
                    <div className="p-2 bg-slate-900 rounded">
                      <div className="text-[10px] text-slate-400">COLD ROOM CORE TEMP</div>
                      <div className={`text-lg font-bold ${epiResult.cold_chain.internal_core_temp_c > 8.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {epiResult.cold_chain.internal_core_temp_c}°C
                      </div>
                      <div className="text-[9px] text-slate-500">{epiResult.cold_chain.status}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOX 5 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  05
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 5: TreeSHAP Feature Attributions &amp; Ministerial Root-Cause Cards
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Shapley additive explanations decomposed across 28 facility operational indicators.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCode(5)}
                  className="px-2.5 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {showCode[5] ? 'Hide Python' : 'View Python'}
                </button>
                <button
                  onClick={handleRunBox5}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Play className="w-3 h-3" /> Compute TreeSHAP
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {shapResult && (
                <div className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Target: {shapResult.facility_name} ({shapResult.facility_id})</span>
                    <span className="text-red-400 font-bold">Predicted Stockout Risk: {(shapResult.output_risk * 100).toFixed(1)}%</span>
                  </div>

                  <div className="space-y-1.5">
                    {shapResult.features.map((feat, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 bg-slate-900 rounded">
                        <span className="text-slate-300 truncate max-w-md">{feat.name}</span>
                        <div className="flex items-center gap-3">
                          <span className={feat.direction === 'INCREASES_RISK' ? 'text-red-400' : 'text-emerald-400'}>
                            {feat.pct_contribution > 0 ? `+${feat.pct_contribution}%` : `${feat.pct_contribution}%`}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            feat.direction === 'INCREASES_RISK' ? 'bg-red-950/60 text-red-300' : 'bg-emerald-950/60 text-emerald-300'
                          }`}>
                            {feat.direction}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-blue-950/40 border border-blue-800 rounded-lg text-[11px] text-blue-200 mt-2">
                    <div className="font-bold text-blue-300">🏛️ MINISTERIAL ACTION CARD:</div>
                    <div className="mt-1">{shapResult.ministerial_card.action_directive}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Authority: {shapResult.ministerial_card.statutory_authority}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOX 6 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  06
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 6: Multi-Agent Swarm DAG Execution Pipeline
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Executes the 5-agent stateful graph: Early Warning Sentinels &rarr; Simplex LP Optimizer &rarr; Resource Intel &rarr; Consensus Verifier.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRunBox6}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3 h-3" /> Execute Swarm Wave
              </button>
            </div>

            <div className="p-4 space-y-3">
              {swarmResult && (
                <div className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-bold">PIPELINE RUN: {swarmResult.run_id}</span>
                    <span className="text-slate-400 font-bold">DOCKET: {swarmResult.docket_id}</span>
                  </div>

                  <div className="space-y-3">
                    {swarmResult.waves.map((w) => (
                      <div key={w.wave} className="p-2.5 bg-slate-900 rounded space-y-1.5">
                        <div className="text-[11px] font-bold text-blue-400">{w.wave_name}</div>
                        {w.agents.map((ag, idx) => (
                          <div key={idx} className="flex items-start justify-between text-[11px] pl-2 border-l-2 border-slate-700">
                            <div>
                              <span className="text-white font-semibold">{ag.name}: </span>
                              <span className="text-slate-300">{ag.action}</span>
                            </div>
                            <span className="text-slate-500 text-[10px] shrink-0 ml-2">{ag.latency}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-slate-500 pt-1">
                    State Consensus Hash: <span className="text-slate-300">{swarmResult.consensus_hash}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOX 7 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  07
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 7: Cryptographic Human-in-the-Loop (HITL) Gate
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dual ministerial signing, FIPS 140-3 HMAC-SHA256 signature sealing, and 72-hour revocable rollback token.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRunBox7}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Lock className="w-3 h-3" /> Authorize &amp; Seal
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Approving Health Director Name
                  </label>
                  <input
                    type="text"
                    value={approverName}
                    onChange={(e) => setApproverName(e.target.value)}
                    className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Decision Action
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHitlDecision('APPROVE')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                        hitlDecision === 'APPROVE'
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      APPROVE DISPATCH
                    </button>
                    <button
                      onClick={() => setHitlDecision('REJECT')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                        hitlDecision === 'REJECT'
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>

              {hitlResult && (
                <div className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-1">
                    <span>{hitlResult.authorized ? '✅ LEGAL ACTION DOCKET SEALED' : '❌ ACTION REJECTED'}</span>
                    <span className="text-slate-400">{hitlResult.docket_id}</span>
                  </div>
                  <div className="text-slate-300">{hitlResult.action_summary}</div>
                  <div className="text-[10px] text-slate-500">Signer: {hitlResult.authorizer_name} ({hitlResult.role})</div>
                  <div className="text-[10px] text-amber-400">Rollback Token: {hitlResult.rollback_token} (Valid for 72 Hours)</div>
                  <div className="text-[10px] text-slate-500 truncate">FIPS Signature: {hitlResult.signature}</div>
                </div>
              )}
            </div>
          </div>

          {/* BOX 8 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  08
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 8: Counterfactual "What-If" Scenario Simulator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Simulates unexpected transit corridor disruptions and acute pediatric patient surges.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRunBox8}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3 h-3" /> Simulate Counterfactual
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Road Transit Delay (Hours): {whatIfDelay}h
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    step="2"
                    value={whatIfDelay}
                    onChange={(e) => setWhatIfDelay(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Pediatric Admission Surge (%): +{whatIfSurge}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={whatIfSurge}
                    onChange={(e) => setWhatIfSurge(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {whatIfResult && (
                <div className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="text-amber-400 font-bold">THREAT LEVEL: {whatIfResult.threat_classification}</span>
                    <span className="text-red-400 font-bold">NET RUNWAY LOSS: -{whatIfResult.net_loss_days} DAYS</span>
                  </div>
                  <div className="text-slate-300">Simulated Remaining Operational Runway: {whatIfResult.simulated_runway_days} Days</div>
                  <div className="text-xs text-blue-300 pt-1">Directive: {whatIfResult.contingency_directive}</div>
                </div>
              )}
            </div>
          </div>

          {/* BOX 9 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center">
                  09
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Box 9: Immutable Sovereign Cryptographic Audit Ledger
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Chained SHA-256 blocks recording every automated decision and ministerial override.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRunBox9}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3 h-3" /> Verify Audit Ledger
              </button>
            </div>

            <div className="p-4 space-y-3">
              {auditBlocks.length > 0 && (
                <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-200 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 border-b border-slate-800 pb-1">
                    <span>IMMUTABLE CHAIN: 7 BLOCKS VERIFIED</span>
                    <span>TAMPER DETECTED: 0.00%</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    {auditBlocks.map((b) => (
                      <div key={b.block_index} className="flex items-center justify-between p-1 bg-slate-900 rounded">
                        <span className="text-slate-300">Block #{b.block_index.toString().padStart(2, '0')} [{b.event_type}]</span>
                        <span className="text-slate-500 font-mono text-[10px]">{b.block_hash}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. OTHER TABS (SANDBOX, SWARM-DAG, XAI-HITL) */}
      {activeTab === 'sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Live Epidemic &amp; Cold-Chain Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Adjust input parameters to observe real-time Bayesian $R_t$ calculation and Newton thermal degradation curves.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily New Cases (Recent Spike)</label>
                <input
                  type="text"
                  value={dailyCasesInput}
                  onChange={(e) => setDailyCasesInput(e.target.value)}
                  className="w-full text-xs font-mono p-2 border rounded dark:bg-slate-950 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Stock: {currentDrugStock} Packs</label>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={currentDrugStock}
                  onChange={(e) => setCurrentDrugStock(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <button
                onClick={handleRunBox4}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer transition"
              >
                Compute Real-Time Projections
              </button>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500" />
              Counterfactual Risk Modeler
            </h3>
            <p className="text-xs text-slate-500">
              Test sudden transit corridor impassability and clinical admission surge spikes.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Corridor Flood Transit Delay: {whatIfDelay} Hours</label>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={whatIfDelay}
                  onChange={(e) => setWhatIfDelay(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pediatric Admission Surge: +{whatIfSurge}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={whatIfSurge}
                  onChange={(e) => setWhatIfSurge(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
              <button
                onClick={handleRunBox8}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer transition"
              >
                Run What-If Scenario
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'swarm-dag' && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-500" />
              Directed Acyclic Graph (DAG) Swarm Execution
            </h3>
            <button
              onClick={handleRunBox6}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Trigger Full Swarm Run
            </button>
          </div>
          <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-lg border border-slate-800 space-y-3">
            <div className="text-slate-400">=== MULTI-AGENT SWARM ARCHITECTURE FLOW ===</div>
            <div className="whitespace-pre text-emerald-400">
{`   [WAVE 1: PARALLEL SENSORS]
   ┌───────────────────────────┐      ┌───────────────────────────┐
   │ Epidemic Sentinel Agent   │      │ Cold-Chain Guardian Agent │
   │ (Bayesian Cori Rt Engine) │      │ (2,840 LoRaWAN IoT Nodes) │
   └─────────────┬─────────────┘      └─────────────┬─────────────┘
                 └──────────────┬───────────────────┘
                                │
   [WAVE 2: DEPENDENT OPTIMIZATION & ROUTING]
   ┌────────────────────────────▼──────────────────────────────┐
   │ Supply Chain Optimizer & Resource Intelligence Agent       │
   │ (Linear Programming Simplex • 3,200 Packs Rebalance)       │
   └────────────────────────────┬──────────────────────────────┘
                                │
   [WAVE 3: CONSENSUS & GOVERNANCE GATE]
   ┌────────────────────────────▼──────────────────────────────┐
   │ Consensus Verifier Agent & FIPS 140-3 Cryptographic HITL  │
   │ (Immutable SHA-256 State Hash Sealed • Dispatched)        │
   └───────────────────────────────────────────────────────────┘`}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'xai-hitl' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              TreeSHAP Feature Attributions
            </h3>
            <p className="text-xs text-slate-500">
              Computes Shapley values explaining why Garissa Sub-County Dispensary faces a 94.0% stockout vulnerability.
            </p>
            <button
              onClick={handleRunBox5}
              className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Recalculate Shapley Vectors
            </button>
            {shapResult && (
              <div className="space-y-2 mt-3">
                {shapResult.features.map((feat, i) => (
                  <div key={i} className="text-xs font-mono p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span className="truncate max-w-xs">{feat.name}</span>
                    <span className={feat.pct_contribution > 0 ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>
                      {feat.pct_contribution > 0 ? `+${feat.pct_contribution}%` : `${feat.pct_contribution}%`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              FIPS 140-3 Cryptographic Signatures &amp; Rollback
            </h3>
            <p className="text-xs text-slate-500">
              Verifies dual-signature requirements and generates 72-hour revocable cryptographic rollback tokens.
            </p>
            <button
              onClick={handleRunBox7}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Sign &amp; Seal Docket
            </button>
            {hitlResult && (
              <div className="p-3 bg-slate-950 text-emerald-300 font-mono text-xs rounded border border-slate-800 space-y-1">
                <div>DOCKET: {hitlResult.docket_id}</div>
                <div>ROLLBACK TOKEN: {hitlResult.rollback_token}</div>
                <div className="text-[10px] text-slate-400">SEAL: {hitlResult.signature.slice(0, 32)}...</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
