import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ExternalLink, 
  MoreVertical, 
  Star, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Zap,
  Loader2
} from 'lucide-react';
import { leadService } from '@/services/lead.service';
import { Lead, LeadStatus } from '@/types';

const statusConfig: Record<LeadStatus, { label: string, color: string }> = {
  discovery: { label: 'Discovery', color: 'bg-blue-100 text-blue-700' },
  prospect: { label: 'Prospect', color: 'bg-indigo-100 text-indigo-700' },
  contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-700' },
  negotiating: { label: 'Negotiating', color: 'bg-violet-100 text-violet-700' },
  'closed-won': { label: 'Closed Won', color: 'bg-emerald-100 text-emerald-700' },
  'closed-lost': { label: 'Closed Lost', color: 'bg-rose-100 text-rose-700' },
};

const LeadDatabase = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [enriching, setEnriching] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    try {
      const updated = await leadService.updateLeadStatus(leadId, status);
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
      if (selectedLead?.id === leadId) setSelectedLead(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnrich = async (lead: Lead) => {
    setEnriching(true);
    try {
      const enrichment = await leadService.enrichLead(lead.id);
      const updatedLead = { ...lead, enrichment };
      // Save it back to storage
      const allLeads = await leadService.getLeads();
      const updatedAll = allLeads.map(l => l.id === lead.id ? updatedLead : l);
      localStorage.setItem('founderflow_leads', JSON.stringify(updatedAll));
      
      setLeads(updatedAll);
      setSelectedLead(updatedLead);
    } catch (err) {
      console.error(err);
    } finally {
      setEnriching(false);
    }
  };

  const exportLeads = () => {
    leadService.exportToCSV(leads);
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Lead Database</h2>
          <p className="text-slate-500 mt-1">Manage your pipeline and get AI-powered insights for every lead.</p>
        </div>
        <button 
          onClick={exportLeads}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Next Action</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.companyName}</span>
                      <span className="text-xs text-slate-500">{lead.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{lead.industry}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                        lead.score >= 8 ? "bg-emerald-50 text-emerald-600" :
                        lead.score >= 5 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {lead.score}
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            className={i < Math.floor(lead.score/2) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      statusConfig[lead.status].color
                    )}>
                      {statusConfig[lead.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-slate-500 truncate">{lead.nextAction}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrichment Sidebar/Modal Placeholder */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white h-screen overflow-y-auto p-8 shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-400">
                  {selectedLead.companyName[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedLead.companyName}</h3>
                  <a href={selectedLead.website} target="_blank" rel="noreferrer" className="text-blue-600 flex items-center gap-1 hover:underline text-sm font-medium mt-1">
                    {selectedLead.website.replace('https://', '')}
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lead Score</p>
                <p className="text-2xl font-bold text-slate-900">{selectedLead.score}/10</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company Size</p>
                <p className="text-sm font-bold text-slate-900 mt-1.5">{selectedLead.enrichment?.estimatedSize || selectedLead.size}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Industry</p>
                <p className="text-sm font-bold text-slate-900 mt-1.5 truncate px-1">{selectedLead.industry}</p>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-blue-600" />
                  <h4 className="font-bold text-slate-900">AI Sales Insight</h4>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <p className="text-slate-700 leading-relaxed italic">
                    {selectedLead.enrichment?.summary || selectedLead.description}
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={20} className="text-rose-500" />
                  <h4 className="font-bold text-slate-900">Potential Pain Points</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {selectedLead.enrichment?.painPoints.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{p}</span>
                    </div>
                  )) || <p className="text-sm text-slate-400 italic">No enrichment data yet.</p>}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={20} className="text-amber-500" />
                  <h4 className="font-bold text-slate-900">Why Prospect?</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                  {selectedLead.enrichment?.prospectReason || selectedLead.reason}
                </p>
              </section>

              <div className="pt-8 border-t border-slate-100 space-y-4">
                <div className="flex gap-4">
                  <select 
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                  >
                    {Object.entries(statusConfig).map(([val, config]) => (
                      <option key={val} value={val}>{config.label}</option>
                    ))}
                  </select>
                  {!selectedLead.enrichment && (
                    <button 
                      onClick={() => handleEnrich(selectedLead)}
                      disabled={enriching}
                      className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {enriching ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} />}
                      Run Deep Enrichment
                    </button>
                  )}
                </div>
                <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                  Generate Personalized Outreach
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default LeadDatabase;
