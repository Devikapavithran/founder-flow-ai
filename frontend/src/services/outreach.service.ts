import { api } from '@/lib/api';
import { emitter } from '@/agentSdk';
import { OutreachTemplate, OutreachMessage, Lead } from '../types';
import { MOCK_TEMPLATES } from '../data/mockData';

const AGENT_ID = '435bcf6d-4c20-443b-8dfe-76e20136bb68';

export const outreachService = {
  getTemplates: async (): Promise<OutreachTemplate[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      const stored = localStorage.getItem('founderflow_templates');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('founderflow_templates', JSON.stringify(MOCK_TEMPLATES));
      return MOCK_TEMPLATES;
    }
    const response = await api.get('/templates');
    return response.data;
  },

  generateDraft: async (lead: Lead, type: 'email' | 'linkedin' | 'follow-up'): Promise<string> => {
    // Agent sync event for outreach draft
    const result = await emitter.emit({
      agentId: AGENT_ID,
      event: 'outreach_draft_requested',
      payload: { 
        leadId: lead.id, 
        type, 
        companyName: lead.companyName,
        industry: lead.industry,
        painPoints: lead.enrichment?.painPoints || []
      },
      uid: crypto.randomUUID()
    });

    if (result && typeof result === 'string') {
      return result;
    }

    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      return `Hi, I noticed ${lead.companyName} is doing great things in ${lead.industry}. Given your focus on ${lead.enrichment?.painPoints?.[0] || 'efficiency'}, I thought our solution could help.`;
    }

    const response = await api.post('/outreach/generate', { leadId: lead.id, type });
    return response.data.content;
  },

  saveTemplate: async (template: Omit<OutreachTemplate, 'id'>): Promise<OutreachTemplate> => {
    const newTemplate = { ...template, id: crypto.randomUUID() };
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      const templates = await outreachService.getTemplates();
      const updated = [...templates, newTemplate];
      localStorage.setItem('founderflow_templates', JSON.stringify(updated));
      return newTemplate;
    }
    const response = await api.post('/templates', template);
    return response.data;
  }
};
