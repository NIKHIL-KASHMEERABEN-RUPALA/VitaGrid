import { PageCopilotContext } from '../types/copilot';

export const COPILOT_PAGE_CONTEXTS: Record<string, PageCopilotContext> = {
  'resource-intel': {
    pageId: 'resource-intel',
    pageName: 'Resource Intelligence',
    badgeLabel: 'Resource Intelligence',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    recommendedCount: 3,
    suggestions: [
      {
        id: 'ri-1',
        prompt: 'Which facilities currently breach safe clinician-to-patient ratios?',
        badge: 'Critical Staffing',
        confidence: '98.5% • Biometric Shift Logs',
        sources: ['National Biometric Roster', 'PHC Daily Census', 'MoH Ratio Standard §8.1'],
        response:
          '3 facilities are in acute breach of the 1:12 safe clinician-to-patient threshold:\n1. Lodwar District Clinic: 1:24 ratio (84 inpatients, 3 MDs/nurses on shift)\n2. Kisumu Central PHC: 1:22 ratio (95 inpatients, vector surge compression)\n3. Kilifi Referral Hospital: 1:19 ratio (160 inpatients, pediatric ward overloaded).',
        actionRecommendation: {
          id: 'act-ri-1',
          title: 'Deploy Regional Float Pool to Lodwar & Kisumu',
          summary: 'Dispatch 6 reserve clinical officers from Kakuma and Nakuru staging depots.',
          impact: 'Brings Lodwar ratio down from 1:24 to 1:14 within 3 hours.',
        },
      },
      {
        id: 'ri-2',
        prompt: 'Propose dynamic float pool redistribution for Turkana North',
        badge: 'Workforce Balancing',
        confidence: '96.4% • Transit GIS Model',
        sources: ['Kakuma Buffer Depot Roster', 'Turkana County Health Registry', 'Road Network A1'],
        response:
          'Optimal staffing transfer calculated: Kakuma Buffer Depot has 14 clinical officers in reserve. Route 4 Pediatric MDs + 2 Portable O₂ Pods down the A1 highway corridor (ETA 2.4h). Clinician fatigue index in Lodwar will decrease from 0.84 to 0.48.',
        actionRecommendation: {
          id: 'act-ri-2',
          title: 'Execute Lodwar Staff Surge Mitigation Directive',
          summary: 'Kakuma Depot → Lodwar District Clinic via A1 Highway (4 MDs, 2 O₂ Pods).',
          impact: 'Averts clinical exhaustion and ensures 24/7 emergency trauma coverage.',
        },
      },
      {
        id: 'ri-3',
        prompt: 'Show ICU bed occupancy vs oxygen reserve headroom nationwide',
        badge: 'Bio-Medical Telemetry',
        confidence: '99.1% • Oxygen Sensor Mesh',
        sources: ['National Oxygen Grid', 'ICU Census Ingestion', '980 Operational Ventilators'],
        response:
          'National ICU bed occupancy is nominal at 78.2% (1,420 / 1,815 beds). Oxygen reserve headroom averages 41 days nationwide. However, local pressure exists in Lodwar (1.4 days O₂ buffer) and Kisumu Central (1.8 days O₂ buffer). Central hub liquid oxygen bulk tanks are at 94.1% capacity.',
      },
    ],
  },

  'command-center': {
    pageId: 'command-center',
    pageName: 'National Command Center',
    badgeLabel: 'National Command Center',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    recommendedCount: 3,
    suggestions: [
      {
        id: 'cmd-1',
        prompt: 'Which districts are at highest risk of stock-outs in the next 72 hours?',
        badge: 'Critical 72h',
        confidence: '98.2% • Live Telemetry Mesh',
        sources: ['Sentinel Feed #7702', 'Kilifi North EHR', 'Mandera East Logistics API'],
        response:
          'Based on real-time burn velocity across 2,840 PHCs, two sub-counties will breach critical buffer within 72h: Kilifi North (Amoxicillin 250mg: 1.8 days remaining, 254 units vs daily burn of 142) and Mandera East (Tetanus Toxoid: 36h buffer). A third sub-county, Garissa Central, is on cold-chain watch with 3.4 days of insulin buffer remaining.',
        actionRecommendation: {
          id: 'act-cmd-1',
          title: 'Dispatch Emergency Rebalance #842 (Mombasa to Kilifi)',
          summary: 'Transfer 3,200 units Amoxicillin 250mg via road courier RL-09. Restores buffer to 22.4 days.',
          impact: 'Averts antibiotic stockout across 12 coastal PHCs serving 48,000 residents.',
        },
      },
      {
        id: 'cmd-2',
        prompt: 'Generate a 60-second national situation brief for the Director',
        badge: 'Executive Brief',
        confidence: '99.4% • Consensus Validated',
        sources: ['47 County Telemetry Streams', 'Copernicus Precipitation Feed', 'ISO-27001 Gateway'],
        response:
          'SOVEREIGN SITREP (UTC+3): National availability stands at 94.6% against the >92.0% statutory threshold. ICU surge capacity is nominal at 78.2% with 41 days oxygen reserve headroom. Primary alert: Lake Basin malaria surge (+41.2% 7d velocity, R₀ 1.48) triggered by +34mm precipitation anomaly. One urgent logistics rebalance (#842 Kilifi) awaiting Director sign-off. All 2,840 PHCs connected with zero PII egress.',
      },
      {
        id: 'cmd-3',
        prompt: 'Show facilities with both high bed occupancy and low medicine availability',
        badge: 'Dual Vulnerability',
        confidence: '95.1% • Cross-EHR Correlation',
        sources: ['County Hospital Telemetry', 'PHC Daily Admissions Log', 'District Depot Ledgers'],
        response:
          'Cross-referencing ICU occupancy (>85%) against critical drug stock (<3 days) highlights 3 high-concurrency facilities:\n1. Kisumu County Referral Hospital (ICU: 98.3%, IV Saline buffer: 2.1 days)\n2. Kilifi County Hospital (ICU: 91.4%, Pediatric Antibiotics: 1.8 days)\n3. Lodwar District Hospital (ICU: 88.0%, Antimalarial artemether: 2.4 days).',
        actionRecommendation: {
          id: 'act-cmd-3',
          title: 'Priority Staging Protocol #PS-09',
          summary: 'Pre-allocate combined emergency ICU packs (IV fluids + broad-spectrum antibiotics) from Nairobi Central.',
          impact: 'Protects critical care operations for 220 acute in-patients.',
        },
      },
    ],
  },

  'supply-chain': {
    pageId: 'supply-chain',
    pageName: 'Supply Chain Intelligence',
    badgeLabel: 'Supply Chain Intelligence',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    recommendedCount: 3,
    suggestions: [
      {
        id: 'sc-1',
        prompt: 'Which essential medicines will stock out first at current burn rates?',
        badge: 'Depletion Matrix',
        confidence: '97.6% • SARIMA Model',
        sources: ['National Depletion Ledger', 'KEMSA Central Hub', '2,840 Dispensary Scans'],
        response:
          'Top 3 imminent depletion vectors across national dispensaries:\n1. Amoxicillin 250mg Suspension: 1.8 days runout (254 units, burn 142/day)\n2. Rabies Post-Exposure Prophylaxis: 2.1 days runout (42 vials remaining across Northern corridor)\n3. Oxytocin 10 IU/ml Ampoules: 2.3 days runout (88 amps in Coastal regional secondary depots).',
        actionRecommendation: {
          id: 'act-sc-1',
          title: 'Trigger Multi-Echelon Rebalance Wave #44',
          summary: 'Release 15,000 units Amoxicillin and 400 rabies vials from Nairobi Central Strategic Reserve.',
          impact: 'Eliminates acute stockout risk in 6 high-burn border districts.',
        },
      },
      {
        id: 'sc-2',
        prompt: 'Propose optimal redistribution for Amoxicillin in the Coast region',
        badge: 'Algorithmic Transfer',
        confidence: '96.2% • Linear Logistics Optimization',
        sources: ['Mombasa Port Hub Inventory', 'Kilifi Road Network GIS', 'Vehicle Telematics Unit #RL-09'],
        response:
          'Optimal routing solution computed: Mombasa Central Depot holds 24,500 surplus units. Transport via Fast Road Logistics RL-09 across 34.2 km (ETA 48 minutes) to Kilifi PHC-08. Transport cost index: 0.12 USD/km-unit. Temperature controlled ambient (+15°C to +25°C) confirmed.',
        actionRecommendation: {
          id: 'act-sc-2',
          title: 'Send Rebalance Proposal #842 for Human Approval',
          summary: 'Mombasa Hub-02 → Kilifi PHC-08 (3,200 units Amoxicillin 250mg suspension).',
          impact: 'Restores Kilifi buffer to 22.4 days with zero depot disruption.',
        },
      },
      {
        id: 'sc-3',
        prompt: 'Show all cold-chain temperature breaches in the last 24 hours',
        badge: 'IoT Sensors',
        confidence: '99.8% • Edge Telemetry Cryptographic Audit',
        sources: ['Wajir Depot IoT #12', 'Garissa Vertiport Cool-Box #04', 'Lamu Solar Fridge #02'],
        response:
          '1 transient alert detected: Lamu Island Dispensary cool-box logged +8.4°C for 22 minutes during grid solar changeover at 04:15 UTC. Automated thermal recovery brought chamber back to +3.8°C. Biological viability calculation confirms 0% vaccine degradation. Wajir Depot (#12) and Garissa Vertiport are nominal at +3.2°C and +4.1°C.',
      },
    ],
  },

  'outbreak-radar': {
    pageId: 'outbreak-radar',
    pageName: 'Demand & Outbreak Radar',
    badgeLabel: 'Demand & Outbreak Radar',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    recommendedCount: 3,
    suggestions: [
      {
        id: 'ob-1',
        prompt: 'Which pathogen is showing the strongest acceleration right now?',
        badge: 'Early Warning',
        confidence: '94.8% • Syndromic Ingestion Cycle 12m',
        sources: ['18 Sentinel Nodes Lake Basin', 'KEMRI Genotyping Stream', 'Copernicus GPM Anomaly'],
        response:
          'Plasmodium falciparum (Malaria) is exhibiting the highest exponential acceleration at +41.2% weekly velocity with effective reproduction rate R₀ = 1.48. Primary epicenter: Lake Basin drainage corridor across 18 sentinel PHCs. Secondary acceleration: Pediatric Rotavirus (+18.4% weekly velocity, R₀ = 1.15) in Western & Rift Valley peripheries.',
        actionRecommendation: {
          id: 'act-ob-1',
          title: 'Deploy Lake Basin Vector Surge Protocol (VS-19)',
          summary: 'Pre-allocate 5,000 IV units (Ringer Lactate & Normal Saline) and 12,000 ACT courses to Kisumu Central.',
          impact: 'Buffers predicted epidemiological peak arriving in T+10 days.',
        },
      },
      {
        id: 'ob-2',
        prompt: 'Correlate the current malaria spike with recent rainfall anomalies',
        badge: 'Bio-Climatic Correlation',
        confidence: '91.8% • Multi-Decadal Historical Match',
        sources: ['Copernicus Precipitation Grid', 'Sentinel-2 Soil Moisture', 'MoH 10-Year Case Archive'],
        response:
          'A +34mm precipitation anomaly logged over Lake Victoria and Rift Valley sub-basins 9 days ago has created 1,420 km² of standing water breeding zones. Historical lag model indicates peak vector emergence occurs 9–11 days post-rainfall with a 2.4× surge in clinical fevers. The current trajectory tracks within 3.2% of the 2022 high-transmission baseline.',
      },
      {
        id: 'ob-3',
        prompt: 'What would a 25% rise in rotavirus cases do to ORS demand?',
        badge: 'Scenario Simulation',
        confidence: '93.5% • Monte Carlo Stress Test',
        sources: ['Pediatric Admission Velocity', 'EHR Consumption Metrics', 'Sub-County Stock Buffers'],
        response:
          'A 25% surge above baseline would require an additional 1,840 packs of ORS + Zinc per day across the Western cluster. Current buffer (714 packs in immediate PHCs) would be completely exhausted in under 36 hours. Nakuru regional depot has sufficient buffer (14,200 packs) to support cross-district replenishment if staged immediately.',
        actionRecommendation: {
          id: 'act-ob-3',
          title: 'Pre-Stage 4,500 ORS Co-Packs to Western Outpatient Hubs',
          summary: 'Transfer from Nakuru reserve to 8 peripheral rural clinics prior to weekend surge.',
          impact: 'Maintains minimum 7-day buffer against acute pediatric dehydration.',
        },
      },
    ],
  },

  'human-approvals': {
    pageId: 'human-approvals',
    pageName: 'Human Approvals & Governance',
    badgeLabel: 'Human Approvals',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    recommendedCount: 2,
    suggestions: [
      {
        id: 'ha-1',
        prompt: 'Which pending recommendation has the highest impact-to-risk ratio?',
        badge: 'Priority Triage',
        confidence: '97.2% • Multi-Criteria Decision Framework',
        sources: ['Sovereign Decision Matrix', 'Clinical Impact Model', 'Supply Chain Security Audit'],
        response:
          'Emergency Rebalance Proposal #842 (Kilifi Amoxicillin Transfer) has the highest impact-to-risk score (9.4/10). Impact: Prevents total stockout for 48,000 residents across 12 PHCs. Risk: Low (donor Mombasa hub retains 21,300 units, well above safety threshold; 34.2 km secure road corridor).',
        actionRecommendation: {
          id: 'act-ha-1',
          title: 'Sign & Authorize Sovereign Transfer #842',
          summary: 'Authorize dispatch of vehicle RL-09 from Mombasa Depot to Kilifi PHC-08.',
          impact: 'Generates immutable cryptographic sign-off token on national ledger.',
        },
      },
      {
        id: 'ha-2',
        prompt: 'Draft an approval note for the current redistribution proposal',
        badge: 'Audit Documentation',
        confidence: '99.0% • Sovereign Compliance Engine',
        sources: ['National Health Act Cap 242', 'ISO-27001 Cryptographic Scheme', 'Audit Log #842'],
        response:
          'DRAFT APPROVAL NOTE:\n"Pursuant to Republic Health Grid Directive §14.2 on Sovereign Pharmaceutical Continuity, I hereby authorize Emergency Stock Rebalance #842. Donor Facility: Mombasa Hub-02. Receiver: Kilifi PHC-08. Commodity: 3,200 units Amoxicillin 250mg suspension. Transport mode: RL-09 road logistics unit with continuous temperature logging. Token: 0x8f2d...9e72f. Certified by Dr. V. Rao, National Director."',
      },
    ],
  },

  'agent-mesh': {
    pageId: 'agent-mesh',
    pageName: 'Multi-Agent Mesh',
    badgeLabel: 'Multi-Agent Mesh',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    recommendedCount: 2,
    suggestions: [
      {
        id: 'am-1',
        prompt: 'Which agent is currently the bottleneck in the system?',
        badge: 'Mesh Diagnostics',
        confidence: '99.1% • Consensus Telemetry',
        sources: ['Zone-Alpha Distributed Event Bus', 'Agent Heartbeat Monitor', 'gRPC Latency Tracing'],
        response:
          'The Cold-Chain Telemetry Aggregator (Node #7702-C) has seen mean processing latency increase from 18ms to 42ms due to high-frequency polling from 420 remote solar sensors during solar peak hours. It remains fully responsive and within the 100ms SLA, but is currently the relative bottleneck.',
        actionRecommendation: {
          id: 'act-am-1',
          title: 'Allocate 2 Edge Worker Pods to Node #7702-C',
          summary: 'Auto-scale cold-chain stream ingestion to reduce latency back to sub-20ms.',
          impact: 'Guarantees real-time vaccine temperature alerts during midday heat peak.',
        },
      },
      {
        id: 'am-2',
        prompt: 'Show the last coordination cycle between Demand and Logistics agents',
        badge: 'Inter-Agent Consensus',
        confidence: '98.7% • Audit Trail 0x4a99',
        sources: ['Agent Coordination Bus', 'Consensus Ledger #ALRT-092', 'Logistics Dispatch Queue'],
        response:
          'Last coordination cycle completed 4 minutes ago (Cycle #8,941):\n1. Demand Agent flagged +41.2% malaria surge in Lake Basin (confidence: 94.1%).\n2. Logistics Agent verified Nakuru regional depot surplus (24,500 units IV saline, 38,000 ACTs).\n3. Rebalance Engine formulated Protocol #VS-19 proposing 5,000 IV units dispatch.\n4. Human-in-the-Loop policy gate queued protocol for Director review.',
      },
    ],
  },

  'architecture-stack': {
    pageId: 'architecture-stack',
    pageName: 'Architecture & AI Stack',
    badgeLabel: 'Architecture & AI Stack',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    recommendedCount: 3,
    suggestions: [
      {
        id: 'arch-1',
        prompt: 'Explain the 5-layer sovereign execution flow and zero-PII enclave boundary',
        badge: 'System Architecture',
        confidence: '99.9% • FIPS 140-3 Specification',
        sources: ['VitaGrid Sovereign Architecture Whitepaper', 'FedRAMP High Security Specification §4.2'],
        response:
          'The VitaGrid GOV architecture executes across 5 sovereign layers:\n1. Ingestion & Zero-PII Enclave: Strips citizen identifiers from 2,840 PHCs before model ingestion.\n2. Event Mesh & Store: Redis Pub/Sub event bus with sub-2ms latency + 28 continuous feature tensors.\n3. Specialist Agent Swarm: 10 coordinated autonomous agents running under Commander Orchestrator.\n4. Sovereign HITL Governance Gate: FIPS 140-3 Rule A-42 enforcement blocking autonomous dispatch.\n5. Real-Time UI & Presentation: WebSocket feeds powering React 19 + MapLibre GL dashboards.',
      },
      {
        id: 'arch-2',
        prompt: 'How does the Primal-Dual LP optimizer interact with the Cori Rt epidemic model?',
        badge: 'Model Pipeline',
        confidence: '98.4% • Algorithmic Contract',
        sources: ['PuLP LP Solver Engine', 'Cori et al. Bayesian Renewal Model §3.1'],
        response:
          'The Epidemic Prediction Agent computes instantaneous transmission rate R_t and Doubling Time, forecasting 14/30/60/90-day case trajectories. If case acceleration exceeds threshold, it publishes an `epidemic.surge.detected` event. The Logistics Agent ingests the projected regional deficit and executes the Primal-Dual Simplex optimizer to compute ton-km cost-minimized inter-depot transfers while guaranteeing a 14-day minimum clinical buffer.',
      },
      {
        id: 'arch-3',
        prompt: 'Verify append-only Merkle SHA-256 ledger integrity across all 10 agents',
        badge: 'Cryptographic Audit',
        confidence: '100% • Merkle Root Verified',
        sources: ['Merkle Tree Block #1042', 'HMAC-SHA256 Validator', 'Audit Ledger Module'],
        response:
          'All 1,042 blocks in the sovereign audit ledger have been verified. Zero block corruption or replay attacks detected. All Action Dockets contain valid ECDSA SHA-256 signatures and reversible Rollback Tokens (RBK-XXXX).',
      },
    ],
  },
};
