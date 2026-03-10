import React, { useState } from 'react';
import { Search, Globe, Info, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { leadService } from '@/services/lead.service';
import { Lead } from '@/types';

const LeadDiscovery = () => {
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [criteria, setCriteria] = useState({
    industry: '',
    location: '',
    size: '11-50',
    target: ''
  });
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await leadService.discoverLeads(criteria);
      setLeads(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveLead = (id: string) => {
    setSavedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">AI Lead Finder</h2>
        <p className="text-slate-500 mt-1">Tell us who you're looking for, and our AI will find the best matches.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Industry</label>
            <input 
              type="text" 
              placeholder="e.g. FinTech, Healthcare"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={criteria.industry}
              onChange={e => setCriteria({...criteria, industry: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Location</label>
            <input 
              type="text" 
              placeholder="e.g. London, Remote"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={criteria.location}
              onChange={e => setCriteria({...criteria, location: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Company Size</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
              value={criteria.size}
              onChange={e => setCriteria({...criteria, size: e.target.value})}
            >
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              Find Leads
            </button>
          </div>
        </form>
      </div>

      {leads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{lead.companyName}</h3>
                  <a href={lead.website} target="_blank" rel="noreferrer" className="text-blue-600 text-sm flex items-center gap-1 hover:underline mt-1">
                    <Globe size={14} />
                    {lead.website.replace('https://', '')}
                  </a>
                </div>
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  {lead.industry}
                </div>
              </div>
              
              <p className="text-slate-600 text-sm flex-1 leading-relaxed">
                {lead.description}
              </p>

              <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Info size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Why it's a lead</span>
                </div>
                <p className="text-sm text-slate-700 italic">
                  "{lead.reason}"
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => saveLead(lead.id)}
                  disabled={savedIds.has(lead.id)}
                  className={clsx(
                    "flex-1 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    savedIds.has(lead.id) 
                      ? "bg-emerald-50 text-emerald-600 cursor-default" 
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  )}
                >
                  {savedIds.has(lead.id) ? (
                    <>
                      <CheckCircle2 size={18} />
                      Added to DB
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Save Lead
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default LeadDiscovery;
