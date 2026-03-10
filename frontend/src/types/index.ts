export type LeadStatus = 'discovery' | 'prospect' | 'contacted' | 'negotiating' | 'closed-won' | 'closed-lost';

export interface Lead {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  reason: string;
  enrichment?: LeadEnrichment;
  score: number; // 1-10
  status: LeadStatus;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadEnrichment {
  summary: string;
  estimatedSize: string;
  painPoints: string[];
  prospectReason: string;
  competitors: string[];
  recentNews?: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  type: 'email' | 'linkedin' | 'follow-up';
  content: string;
  category: string;
}

export interface OutreachMessage {
  id: string;
  leadId: string;
  type: 'email' | 'linkedin' | 'follow-up';
  content: string;
  status: 'draft' | 'sent';
  createdAt: string;
}

export interface AnalyticsData {
  totalLeads: number;
  conversionRate: number;
  avgScore: number;
  leadsByStatus: Record<LeadStatus, number>;
  dailyGrowth: { date: string; count: number }[];
}
