export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  pageContext: string;
  confidence?: string;
  sources?: string[];
  actionRecommendation?: {
    id: string;
    title: string;
    summary: string;
    impact: string;
    status: 'pending_dispatch' | 'sent_for_approval' | 'approved';
    approvalId?: string;
  };
}

export interface CopilotSuggestion {
  id: string;
  prompt: string;
  badge?: string;
  response: string;
  confidence: string;
  sources: string[];
  actionRecommendation?: {
    id: string;
    title: string;
    summary: string;
    impact: string;
  };
}

export interface PageCopilotContext {
  pageId: string;
  pageName: string;
  badgeLabel: string;
  badgeColor: string;
  recommendedCount: number;
  suggestions: CopilotSuggestion[];
}
