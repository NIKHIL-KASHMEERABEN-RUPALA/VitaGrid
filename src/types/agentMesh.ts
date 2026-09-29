export interface MeshAgent {
  id: string;
  name: string;
  code: string;
  role: string;
  domain: 'Demand' | 'Supply' | 'Logistics' | 'Workforce' | 'Policy';
  status: 'active' | 'coordinating' | 'evaluating' | 'idle';
  loadPercent: number;
  latencyMs: number;
  queueDepth: number;
  processedEventsMin: number;
  activeSubscribers: number;
  currentTask: string;
  lastMessageExchange: {
    targetAgent: string;
    action: string;
    payloadSnippet: string;
    timestamp: string;
  };
  color: 'emerald' | 'blue' | 'indigo' | 'amber' | 'purple';
}

export interface MeshAgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  topic: string;
  summary: string;
  latencyMs: number;
  status: 'delivered' | 'routed' | 'verified';
  timestamp: string;
}
