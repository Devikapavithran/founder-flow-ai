import { Lead, OutreachTemplate } from '../types';

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    companyName: 'TechNova Solutions',
    website: 'https://technova.io',
    industry: 'Cloud Computing',
    location: 'San Francisco, CA',
    size: '50-200',
    description: 'Cloud infrastructure optimization platform for mid-sized enterprises.',
    reason: 'Matches target size and industry focus on cloud cost reduction.',
    score: 8,
    status: 'prospect',
    nextAction: 'Send initial outreach email focusing on AWS cost savings.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enrichment: {
      summary: 'TechNova is a rapidly growing cloud optimization player. They recently raised Series B.',
      estimatedSize: '120 employees',
      painPoints: ['High AWS egress costs', 'Complex Kubernetes management', 'Lack of multi-cloud visibility'],
      prospectReason: 'They are expanding their engineering team and looking for efficiency tools.',
      competitors: ['CloudHealth', 'Apptio'],
      recentNews: 'Recently announced a partnership with Google Cloud.'
    }
  },
  {
    id: '2',
    companyName: 'GreenGrid Energy',
    website: 'https://greengrid.com',
    industry: 'Renewable Energy',
    location: 'Austin, TX',
    size: '201-500',
    description: 'Smart grid management software for renewable energy providers.',
    reason: 'Expanding into the TX market where our solution has a strong presence.',
    score: 6,
    status: 'discovery',
    nextAction: 'Qualify lead and identify key decision makers in operations.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    companyName: 'FlowState Systems',
    website: 'https://flowstate.so',
    industry: 'SaaS / Productivity',
    location: 'New York, NY',
    size: '11-50',
    description: 'AI-driven productivity tool for remote design teams.',
    reason: 'Recently integrated with Figma, aligning with our creative agency focus.',
    score: 9,
    status: 'contacted',
    nextAction: 'Follow up on LinkedIn regarding the recent integration demo.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const MOCK_TEMPLATES: OutreachTemplate[] = [
  {
    id: 't1',
    name: 'Value-First Cold Email',
    type: 'email',
    category: 'Cold Outreach',
    content: 'Hi {{firstName}}, I saw that {{companyName}} is growing quickly in {{industry}}. We help companies like yours reduce {{painPoint}} by 30%. Would you be open to a 10-minute chat?'
  },
  {
    id: 't2',
    name: 'LinkedIn Connection Request',
    type: 'linkedin',
    category: 'Networking',
    content: 'Hi {{firstName}}, love what you are building at {{companyName}}! I am also in the {{industry}} space and would love to connect and share insights.'
  }
];
