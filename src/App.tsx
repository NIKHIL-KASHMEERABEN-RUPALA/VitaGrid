import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Header } from './components/Header';
import { ModuleFallbackView } from './components/ExtraModules/ModuleFallbackView';
import { KpiRow } from './components/KpiRow';
import { MapSection } from './components/MapSection';
import { AlertStream } from './components/AlertStream';
import { BottomBar } from './components/BottomBar';
import { TransferModal } from './components/Modals/TransferModal';
import { BriefingModal } from './components/Modals/BriefingModal';
import { CopilotDrawer } from './components/Modals/CopilotDrawer';
import { ProtocolModal } from './components/Modals/ProtocolModal';
import { CountyDetailModal } from './components/Modals/CountyDetailModal';
import { SupplyChainView } from './components/SupplyChain/SupplyChainView';
import { DemandRadarView } from './components/Epidemiology/DemandRadarView';
import { HumanApprovalsView } from './components/HumanApprovals/HumanApprovalsView';
import { AgentMeshView } from './components/AgentMesh/AgentMeshView';
import { ResourceIntelligenceView } from './components/ResourceIntelligence/ResourceIntelligenceView';
import { AiDecisionCopilot } from './components/Copilot/AiDecisionCopilot';
import { ArchitectureStackView } from './components/Architecture/ArchitectureStackView';
import { PreemptiveStagingView } from './components/PreemptiveStaging/PreemptiveStagingView';
import { WhatIfSimulatorModal } from './components/CommandCenter/WhatIfSimulatorModal';
import { TreeShapRootCauseCard } from './components/CommandCenter/TreeShapRootCauseCard';
import {
  fetchNationalKpis,
  fetchSystemStatus,
  fetchShapExplanation,
  updateDefconLevel,
  subscribeToLiveTelemetry,
  ShapExplanationResponse,
} from './services/backendApi';
import { MarketingPage } from './components/Marketing/MarketingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { RequestNationalAccessPage } from './components/Auth/RequestNationalAccessPage';
import {
  KPI_DATA,
  MAP_REGIONS,
  TRANSIT_PATHS,
  NATIONAL_ALERTS,
  INITIAL_TRANSFER_PROPOSAL,
  INITIAL_VECTOR_PROTOCOL,
  COPILOT_RECOMMENDATIONS,
} from './data/mockData';
import { MapRegion, NationalAlert, TransferProposal, VectorProtocol, CopilotRecommendation } from './types/dashboard';

export default function App() {
  const [viewMode, setViewMode] = useState<'marketing' | 'login' | 'request-access' | 'console'>('marketing');
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. V. Rao',
    role: 'National Health Director',
    email: 'dr.rao@vitagrid.gov',
  });
  const [activeModule, setActiveModule] = useState<string>('command-center');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [syncSecondsAgo, setSyncSecondsAgo] = useState<number>(4);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [kpiMetrics, setKpiMetrics] = useState(KPI_DATA);
  const [regions, setRegions] = useState<MapRegion[]>(MAP_REGIONS);
  const [transitPaths, setTransitPaths] = useState(TRANSIT_PATHS);
  const [alerts, setAlerts] = useState<NationalAlert[]>(NATIONAL_ALERTS);
  const [transferProposal, setTransferProposal] = useState<TransferProposal>(INITIAL_TRANSFER_PROPOSAL);
  const [vectorProtocol, setVectorProtocol] = useState<VectorProtocol>(INITIAL_VECTOR_PROTOCOL);
  const [copilotRecommendations, setCopilotRecommendations] = useState<CopilotRecommendation[]>(
    COPILOT_RECOMMENDATIONS
  );

  // Modal states
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState<boolean>(false);
  const [selectedCountyForDetail, setSelectedCountyForDetail] = useState<MapRegion | null>(null);

  // Live Multi-Agent Swarm States
  const [defconLevel, setDefconLevel] = useState<number>(4);
  const [swarmStatus, setSwarmStatus] = useState<string>('HEALTHY');
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [shapData, setShapData] = useState<ShapExplanationResponse | null>(null);

  // Live timer and real-time backend synchronization
  useEffect(() => {
    // 1. Initial REST loads
    const loadInitialData = async () => {
      try {
        const [kpiRes, statusRes, shapRes] = await Promise.all([
          fetchNationalKpis(),
          fetchSystemStatus(),
          fetchShapExplanation('PHC-C01-002', 'Amoxicillin 250mg Dispersible'),
        ]);
        if (kpiRes?.defcon_level) setDefconLevel(kpiRes.defcon_level);
        if (shapRes) setShapData(shapRes);
      } catch (e) {
        console.warn('Initial telemetry loaded with resilient defaults.');
      }
    };
    loadInitialData();

    // 2. Real-Time WebSocket Telemetry
    const unsubscribeWs = subscribeToLiveTelemetry('kpis', (payload) => {
      if (payload.type === 'KPI_PULSE' && payload.data) {
        const d = payload.data;
        setKpiMetrics((prev) =>
          prev.map((k) => {
            if (k.id === 'availability' && d.availability_index) {
              return { ...k, value: `${d.availability_index}%` };
            }
            if (k.id === 'bed_capacity' && d.surge_bed_capacity_pct) {
              return { ...k, value: `${d.surge_bed_capacity_pct}%` };
            }
            if (k.id === 'rostering' && d.clinician_rostering_pct) {
              return { ...k, value: `${d.clinician_rostering_pct}%` };
            }
            return k;
          })
        );
        setSyncSecondsAgo(0);
      }
    });

    const timer = setInterval(() => {
      setSyncSecondsAgo((prev) => (prev >= 12 ? 1 : prev + 1));
    }, 1000);

    return () => {
      clearInterval(timer);
      unsubscribeWs();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Refresh Telemetry handler
  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSyncSecondsAgo(0);
      setIsRefreshing(false);
      showToast('Sentinel telemetry packets synchronized across 2,840 PHC nodes.');
    }, 600);
  };

  // DEFCON level change handler
  const handleDefconChange = async (lvl: number) => {
    setDefconLevel(lvl);
    try {
      await updateDefconLevel(lvl, `Director manual transition to DEFCON ${lvl}`);
    } catch (e) {
      console.warn('Backend defcon update handled locally.');
    }

    // Dynamic metrics reaction based on DEFCON severity
    setKpiMetrics((prev) =>
      prev.map((kpi) => {
        if (kpi.id === 'critical_alerts') {
          const val = lvl === 1 ? '28' : lvl === 2 ? '19' : lvl === 3 ? '11' : lvl === 4 ? '4' : '1';
          return {
            ...kpi,
            value: val,
            change: lvl <= 2 ? `+${(3 - lvl) * 18}% (Surge Escalation)` : '-12% vs 7d avg',
            status: lvl <= 2 ? 'critical' : lvl === 3 ? 'warning' : 'healthy',
          };
        }
        if (kpi.id === 'availability') {
          const val = lvl === 1 ? '78.4%' : lvl === 2 ? '86.2%' : lvl === 3 ? '91.5%' : lvl === 4 ? '94.6%' : '98.2%';
          return {
            ...kpi,
            value: val,
            status: lvl <= 2 ? 'critical' : lvl === 3 ? 'warning' : 'healthy',
          };
        }
        if (kpi.id === 'bed_capacity') {
          const val = lvl === 1 ? '98.4%' : lvl === 2 ? '92.1%' : lvl === 3 ? '84.6%' : lvl === 4 ? '76.2%' : '64.0%';
          return {
            ...kpi,
            value: val,
            status: lvl <= 2 ? 'critical' : 'healthy',
          };
        }
        if (kpi.id === 'rostering') {
          const val = lvl === 1 ? '99.2%' : lvl === 2 ? '94.5%' : lvl === 3 ? '89.1%' : lvl === 4 ? '84.1%' : '78.0%';
          return { ...kpi, value: val };
        }
        return kpi;
      })
    );

    // Dynamic alerts injection
    if (lvl <= 2) {
      setAlerts((prev) => [
        {
          id: `defcon-emergency-${Date.now()}`,
          facilityId: 'NATIONAL-HQ',
          facilityName: 'National Epidemic Command Enclave',
          title: `NATIONAL MOBILIZATION ALERT: DEFCON ${lvl} ENGAGED`,
          description: `All 47 counties ordered to immediate emergency surge posture. Strategic pharmaceutical buffer release initiated under Ministerial Directive.`,
          timestamp: 'Just now',
          type: 'surge',
          urgencyLevel: 'high',
          category: 'critical',
          metaLeft: 'National HQ • Sovereign Watch',
          badgeText: `DEFCON ${lvl} MOBILIZATION`,
          actionText: 'Review Protocol',
          protocolId: 'PR-VEC-001',
        },
        ...prev.filter((a) => !a.id.startsWith('defcon-emergency-')),
      ]);
      setSwarmStatus(`DEFCON ${lvl}: CRITICAL SURGE ACTIVE`);
      showToast(`CRITICAL: DEFCON ${lvl} active across all 47 counties. Autonomous surge dispatch authorized.`);
    } else {
      setAlerts((prev) => prev.filter((a) => !a.id.startsWith('defcon-emergency-')));
      setSwarmStatus(
        lvl === 3
          ? 'DEFCON 3: ELEVATED WATCH'
          : lvl === 4
          ? 'DEFCON 4: GUARDED'
          : 'DEFCON 5: NOMINAL STANDBY'
      );
      showToast(`Orchestrator set to DEFCON ${lvl} – Swarm state reconfigured.`);
    }
  };

  // Export Snapshot handler
  const handleExportSnapshot = () => {
    const snapshotData = {
      timestamp: new Date().toISOString(),
      platform: 'VitaGrid GOV - Sovereign Health Intelligence',
      defconLevel: 4,
      availabilityIndex: 94.6,
      icuBedUtilization: 78.2,
      cliniciansLive: 14920,
      activeCriticalAlerts: alerts.filter((a) => a.urgencyLevel === 'high'),
      regions: regions.map((r) => ({
        name: r.name,
        code: r.code,
        stability: r.stabilityIndex,
        facilities: r.facilityCount,
        coldChain: r.coldChainTemp,
      })),
      consensusHash: '0x8f2d9c1b4e990a427e1f42d8d8e578a1bc4909e72f',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshotData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `VitaGrid_Snapshot_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Telemetry snapshot exported to JSON.');
  };

  // Authorize stock transfer handler
  const handleAuthorizeTransfer = (proposalId: string) => {
    setTransferProposal((prev) => ({ ...prev, status: 'authorized' }));

    // Update alert status
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.transferProposalId === proposalId
          ? {
              ...alert,
              badgeText: 'TRANSFER IN TRANSIT',
              type: 'transit',
              category: 'logistics',
              actionText: 'Track Fleet',
              description: 'Emergency Amoxicillin 250mg 3,200 units dispatched from Mombasa Hub. ETA 48 mins.',
              urgencyLevel: 'medium',
            }
          : alert
      )
    );

    // Update copilot recommendation
    setCopilotRecommendations((prev) =>
      prev.map((item) => (item.id === 'cop-1' ? { ...item, status: 'applied' } : item))
    );

    showToast('Rebalance Proposal #842 Authorized: Logistics Unit #RL-09 Dispatched.');
  };

  // Execute Vector Protocol
  const handleExecuteProtocol = (protocolId: string) => {
    setVectorProtocol((prev) => ({ ...prev, status: 'executed' }));
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.protocolId === protocolId
          ? {
              ...alert,
              badgeText: 'SUPPLY STAGED',
              type: 'telemetry',
              description: '5,000 units pediatric IV saline pre-allocation approved for Lake Basin.',
              urgencyLevel: 'low',
            }
          : alert
      )
    );

    setCopilotRecommendations((prev) =>
      prev.map((item) => (item.id === 'cop-2' ? { ...item, status: 'applied' } : item))
    );

    showToast('Lake Basin Vector Protocol Staged: 5,000 IV units dispatched.');
  };

  // Apply copilot recommendation
  const handleApplyCopilotAction = (actionId: string) => {
    if (actionId === 'cop-1') {
      setIsCopilotOpen(false);
      setIsTransferModalOpen(true);
    } else if (actionId === 'cop-2') {
      setIsCopilotOpen(false);
      setIsProtocolModalOpen(true);
    } else if (actionId === 'cop-3') {
      setCopilotRecommendations((prev) =>
        prev.map((c) => (c.id === 'cop-3' ? { ...c, status: 'applied' } : c))
      );
      showToast('Northern Corridor solar battery packs scheduled for vertiport rotation.');
    }
  };

  // Filter alerts if search query is entered
  const filteredAlerts = searchQuery
    ? alerts.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : alerts;

  if (viewMode === 'marketing') {
    return (
      <div className="min-h-screen bg-white">
        <MarketingPage
          onOpenLogin={() => {
            setViewMode('login');
          }}
          onRequestNationalAccess={() => {
            setViewMode('request-access');
          }}
          onOpenConsole={(targetModule) => {
            if (targetModule) {
              setActiveModule(targetModule);
            }
            setViewMode('console');
            showToast(targetModule ? `Navigated to ${targetModule}` : 'Signed in as Dr. V. Rao – National Director');
          }}
          onAuthorizeProposal={() => {
            setViewMode('console');
            setActiveModule('human-approvals');
            setIsTransferModalOpen(true);
          }}
        />

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'login') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <LoginPage
          onSuccessLogin={(user) => {
            if (user) {
              setCurrentUser(user);
            }
            setViewMode('console');
            showToast(`Authenticated: ${user?.name || 'Dr. V. Rao'} (FedRAMP High Enclave)`);
          }}
          onBackToHomepage={() => setViewMode('marketing')}
          onRequestAccess={() => setViewMode('request-access')}
        />

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'request-access') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <RequestNationalAccessPage
          onNavigateToLogin={() => setViewMode('login')}
          onBackToHomepage={() => setViewMode('marketing')}
          onSuccessSubmit={(docket) => {
            showToast(`Access Request ${docket.docketId} submitted for clearance review`);
          }}
        />

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-200 font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        syncSecondsAgo={syncSecondsAgo}
        unreadAlertCount={alerts.filter((a) => a.urgencyLevel === 'high').length}
        onNotificationClick={() => {
          const el = document.getElementById('alert-stream-panel');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onBackToMarketing={() => setViewMode('marketing')}
        onOpenArchitecture={() => {
          setActiveModule('architecture-stack');
          showToast('Navigated to Sovereign Multi-Agent Architecture & AI/ML Stack.');
        }}
        onSignOut={() => {
          setViewMode('login');
          showToast('Signed out to VitaGrid GOV Login Gateway.');
        }}
        currentUser={currentUser}
        activeModule={activeModule}
        setActiveModule={(mod) => {
          if (mod === 'decision-copilot') {
            setIsCopilotOpen(true);
            showToast('AI Decision Copilot activated. Ready for operational queries.');
            return;
          }
          if (mod === 'briefings') {
            setIsBriefingModalOpen(true);
            return;
          }
          setActiveModule(mod);
          if (mod !== 'command-center') {
            showToast(`Navigated to module: ${mod}. Viewing live integrated feeds.`);
          }
        }}
        onOpenAiAssist={() => {
          setIsCopilotOpen(true);
          showToast('AI Decision Copilot activated. Ready for operational queries.');
        }}
        pendingApprovalsCount={transferProposal.status === 'pending' ? 2 : 1}
      />

      {/* Main Body Layout (Full-width Command Dashboard) */}
      <div className="flex-1 w-full max-w-[1780px] mx-auto p-3 sm:p-4 lg:p-6 overflow-hidden">
        {/* Main Command Dashboard */}
        <main className="w-full min-w-0 overflow-y-auto max-h-[calc(100vh-130px)] pr-1">
          {activeModule === 'resource-intel' ? (
            <ResourceIntelligenceView
              onOptimizeStaffing={() => {
                showToast('Running multi-facility linear programming optimization...');
              }}
              onDispatchComplete={(msg) => {
                showToast(msg);
              }}
            />
          ) : activeModule === 'outbreak-radar' ? (
            <DemandRadarView
              onShareAlert={() => {
                showToast('Surveillance telemetry packet dispatched to 47 County Health Directors.');
              }}
            />
          ) : activeModule === 'supply-chain' ? (
            <SupplyChainView
              onSyncHubNodes={() => {
                setSyncSecondsAgo(0);
                showToast('Synchronized 340 essential medicines across all 5 echelons & 2,840 PHCs.');
              }}
              onOpenTransferModal={(medName) => {
                setIsTransferModalOpen(true);
              }}
            />
          ) : activeModule === 'human-approvals' ? (
            <HumanApprovalsView
              onAuthorizeProposal={() => {
                setIsTransferModalOpen(true);
              }}
              onExecuteProtocol={() => {
                setIsProtocolModalOpen(true);
              }}
            />
          ) : activeModule === 'agent-mesh' ? (
            <AgentMeshView />
          ) : activeModule === 'architecture-stack' ? (
            <ArchitectureStackView />
          ) : activeModule === 'preemptive-staging' ? (
            <PreemptiveStagingView />
          ) : ['knowledge-system', 'ml-models', 'cross-district'].includes(activeModule) ? (
            <ModuleFallbackView
              moduleId={activeModule}
              onActionClick={showToast}
              onOpenBriefing={() => setIsBriefingModalOpen(true)}
              onReturnToCommand={() => setActiveModule('command-center')}
            />
          ) : (
            <>
              {/* Main Title Banner with Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  {/* DEFCON Level Badge with Interactive Selector */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse-subtle"></span>
                    <span className="text-[11px] font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase font-mono">
                      SOVEREIGN EPIDEMIOLOGICAL WATCH
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    
                    {/* Interactive DEFCON Level Selector */}
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded px-1.5 py-0.5 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">DEFCON:</span>
                      {[5, 4, 3, 2, 1].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => handleDefconChange(lvl)}
                          className={`text-[10px] font-black font-mono px-1.5 py-0.2 rounded transition-all cursor-pointer ${
                            defconLevel === lvl
                              ? lvl <= 2 ? 'bg-red-600 text-white' : lvl === 3 ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={`Set DEFCON Level ${lvl}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>

                    {/* Agent Swarm Status Indicator */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${
                      defconLevel <= 2 
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900'
                        : defconLevel === 3
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${defconLevel <= 2 ? 'bg-red-500 animate-ping' : defconLevel === 3 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                      <span>{defconLevel <= 2 ? 'SWARM: SURGE PRIORITY (10/10 ACTIVE)' : 'SWARM: 10/10 HEALTHY'}</span>
                    </div>
                  </div>

                  {/* Title & Synchronization Status */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      National Health Command &amp; Logistics Center
                    </h1>
                    <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-900 tracking-wide font-mono">
                      SYNCHRONIZED (UTC+3)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsWhatIfOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-md text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    <span>Run What-If Simulator</span>
                  </button>

                  <button
                    onClick={handleRefreshTelemetry}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs cursor-pointer"
                  >
                    <RotateCw
                      className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`}
                    />
                    <span>Refresh Telemetry</span>
                  </button>

                  <button
                    onClick={handleExportSnapshot}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Export Snapshot</span>
                  </button>

                  <button
                    onClick={() => setIsBriefingModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate National Briefing (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Top 4 KPI Metric Cards */}
              <KpiRow
                metrics={kpiMetrics}
                onCardClick={(id) => {
                  if (id === 'critical_alerts') {
                    const el = document.getElementById('alert-stream-panel');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else if (id === 'availability') {
                    showToast('Availability Index verified at 94.6% across 47 sovereign health zones.');
                  }
                }}
              />

              {/* Surfaced TreeSHAP Root Cause Explanation Card */}
              {shapData && (
                <TreeShapRootCauseCard
                  data={shapData}
                  onOpenWhatIf={() => setIsWhatIfOpen(true)}
                  onAuthorizeTransfer={() => {
                    setActiveModule('human-approvals');
                    setIsTransferModalOpen(true);
                  }}
                />
              )}

              {/* Center Map Section and Right Live National Alert Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Main Interactive Map (7 Cols on desktop) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                  <MapSection
                    regions={regions}
                    transitPaths={transitPaths}
                    onSelectRegion={(reg) => setSelectedCountyForDetail(reg)}
                  />
                </div>

                {/* Right Live Alert Stream (5 Cols on desktop) */}
                <div
                  id="alert-stream-panel"
                  className="lg:col-span-5 xl:col-span-4 flex flex-col h-full min-h-[480px]"
                >
                  <AlertStream
                    alerts={filteredAlerts}
                    onReviewTransfer={() => setIsTransferModalOpen(true)}
                    onViewProtocol={() => setIsProtocolModalOpen(true)}
                    onOpenCopilot={() => setIsCopilotOpen(true)}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Sovereign Bottom Status Bar */}
      <BottomBar />

      {/* Persistent Context-Aware Floating AI Decision Copilot (Available on every page) */}
      <AiDecisionCopilot
        activeModule={activeModule}
        onSendForHumanApproval={(title, summary) => {
          showToast(`Action queued for Ministerial Human Approval (#AP-884): ${title}`);
        }}
        onOpenApprovalQueue={() => {
          setActiveModule('human-approvals');
        }}
      />

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Dialogs */}
      <TransferModal
        proposal={transferProposal}
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onAuthorize={handleAuthorizeTransfer}
      />

      <BriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
      />

      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        recommendations={copilotRecommendations}
        onApplyAction={handleApplyCopilotAction}
      />

      <ProtocolModal
        protocol={vectorProtocol}
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        onExecute={handleExecuteProtocol}
      />

      <CountyDetailModal
        region={selectedCountyForDetail}
        isOpen={!!selectedCountyForDetail}
        onClose={() => setSelectedCountyForDetail(null)}
      />

      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        onApplyPolicy={(summary) => {
          showToast(`Policy intervention dispatched to simulation mesh: ${summary}`);
        }}
      />
    </div>
  );
}
