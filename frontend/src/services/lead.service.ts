import { api } from '@/lib/api';
import { emitter } from '@/agentSdk';
import { Lead, LeadStatus, LeadEnrichment } from '../types';
import { MOCK_LEADS } from '../data/mockData';

const AGENT_ID = '435bcf6d-4c20-443b-8dfe-76e20136bb68';

export const leadService = {
  getLeads: async (): Promise<Lead[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      const stored = localStorage.getItem('founderflow_leads');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('founderflow_leads', JSON.stringify(MOCK_LEADS));
      return MOCK_LEADS;
    }
    const response = await api.get('/leads');
    return response.data;
  },

  discoverLeads: async (criteria: { industry: string; location: string; size: string; target: string }): Promise<Lead[]> => {
    // Agent sync event available
    const result = await emitter.emit({
      agentId: AGENT_ID,
      event: 'lead_discovery_submitted',
      payload: criteria,
      uid: crypto.randomUUID()
    });

    if (result) {
      // In a real app, the agent result might be the discovered leads
      // For this prototype, we'll merge them with our local storage
      const currentLeads = await leadService.getLeads();
      const newLeads = Array.isArray(result) ? result : [result]; // Assuming result is leads
      const updated = [...newLeads, ...currentLeads];
      localStorage.setItem('founderflow_leads', JSON.stringify(updated));
      return newLeads;
    }

    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      // Simulate discovery with mock data
      return MOCK_LEADS.slice(0, 2);
    }
    
    const response = await api.post('/leads/discover', criteria);
    return response.data;
  },

  updateLeadStatus: async (leadId: string, status: LeadStatus): Promise<Lead> => {
    const leads = await leadService.getLeads();
    const leadIndex = leads.findIndex(l => l.id === leadId);
    if (leadIndex === -1) throw new Error('Lead not found');

    const updatedLead = { 
      ...leads[leadIndex], 
      status, 
      updatedAt: new Date().toISOString() 
    };

    // Agent sync event for status change
    const result = await emitter.emit({
      agentId: AGENT_ID,
      event: 'lead_status_change',
      payload: { leadId, status, lead: updatedLead },
      uid: crypto.randomUUID()
    });

    // If agent returns updated data (score, next action), use it
    const finalLead = result ? { ...updatedLead, ...result } : updatedLead;

    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      leads[leadIndex] = finalLead;
      localStorage.setItem('founderflow_leads', JSON.stringify(leads));
      return finalLead;
    }

    const response = await api.patch(`/leads/${leadId}`, { status });
    return response.data;
  },

  enrichLead: async (leadId: string): Promise<LeadEnrichment> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      const leads = await leadService.getLeads();
      const lead = leads.find(l => l.id === leadId);
      return lead?.enrichment || {
        summary: 'Deeply analyzed company profile.',
        estimatedSize: '50-100',
        painPoints: ['Manual sales processes', 'High churn rate'],
        prospectReason: 'Aligned with our new automation suite.',
        competitors: ['Incumbent A', 'Incumbent B']
      };
    }
    const response = await api.post(`/leads/${leadId}/enrich`);
    return response.data;
  },

  exportToCSV: async (leads: Lead[]): Promise<void> => {
    const headers = ['Company', 'Website', 'Industry', 'Status', 'Score', 'Next Action'];
    const rows = leads.map(l => [
      l.companyName,
      l.website,
      l.industry,
      l.status,
      l.score,
      l.nextAction
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "founderflow_leads.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
