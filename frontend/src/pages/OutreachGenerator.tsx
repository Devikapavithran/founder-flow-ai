import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Mail, 
  Linkedin, 
  Copy, 
  Check, 
  Save, 
  Loader2, 
  Sparkles,
  Search,
  ChevronRight,
  Plus
} from 'lucide-react';
import { outreachService } from '@/services/outreach.service';
import { leadService } from '@/services/lead.service';
import { Lead, OutreachTemplate } from '@/types';

const OutreachGenerator = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [templates, setTemplates] = useState<OutreachTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'email' | 'linkedin' | 'follow-up'>('email');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [l, t] = await Promise.all([
      leadService.getLeads(),
      outreachService.getTemplates()
    ]);
    setLeads(l);
    setTemplates(t);
  };

  const handleGenerate = async () => {
    if (!selectedLead) return;
    setLoading(true);
    try {
      const draft = await outreachService.generateDraft(selectedLead, activeTab);
      setMessage(draft);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyTemplate = (content: string) => {
    if (!selectedLead) return;
    const processed = content
      .replace('{{companyName}}', selectedLead.companyName)
      .replace('{{industry}}', selectedLead.industry)
      .replace('{{painPoint}}', selectedLead.enrichment?.painPoints[0] || 'efficiency');
    setMessage(processed);
  };

  const filteredLeads = leads.filter(l => 
    l.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
      {/* Lead Selector Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Select Lead</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {filteredLeads.map(lead => (
              <button
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={clsx(
                  "w-full text-left p-4 rounded-xl transition-all border flex items-center justify-between group",
                  selectedLead?.id === lead.id 
                    ? "bg-blue-50 border-blue-200 shadow-sm" 
                    : "bg-white border-transparent hover:border-slate-200"
                )}
              >
                <div>
                  <p className={clsx(
                    "font-bold text-sm",
                    selectedLead?.id === lead.id ? "text-blue-700" : "text-slate-900"
                  )}>{lead.companyName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{lead.industry}</p>
                </div>
                <ChevronRight size={16} className={clsx(
                  "transition-transform",
                  selectedLead?.id === lead.id ? "text-blue-500 translate-x-1" : "text-slate-300 group-hover:translate-x-1"
                )} />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="font-bold flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-blue-400" />
              AI Outreach Tips
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personalized emails have a 3x higher response rate. Focus on their pain points mentioned in enrichment.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 bg-blue-600/20 h-24 w-24 rounded-full blur-2xl group-hover:bg-blue-600/30 transition-all duration-700" />
        </div>
      </div>

      {/* Main Generator Area */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full min-h-[600px]">
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('email')}
              className={clsx(
                "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all",
                activeTab === 'email' ? "text-blue-600 bg-blue-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Mail size={18} /> Email
            </button>
            <button 
              onClick={() => setActiveTab('linkedin')}
              className={clsx(
                "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all border-x border-slate-100",
                activeTab === 'linkedin' ? "text-blue-600 bg-blue-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Linkedin size={18} /> LinkedIn
            </button>
            <button 
              onClick={() => setActiveTab('follow-up')}
              className={clsx(
                "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all",
                activeTab === 'follow-up' ? "text-blue-600 bg-blue-50/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Send size={18} /> Follow-up
            </button>
          </div>

          <div className="p-8 flex-1 flex flex-col space-y-6">
            {!selectedLead ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
                  <Plus size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Choose a lead to start</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Select a company from the sidebar to generate a personalized message.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-600">
                      {selectedLead.companyName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Message for {selectedLead.companyName}</h4>
                      <p className="text-xs text-slate-500">Targeting {activeTab} channel</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    Generate with AI
                  </button>
                </div>

                <div className="flex-1 relative group">
                  <textarea 
                    className="w-full h-full min-h-[300px] p-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all font-mono text-sm leading-relaxed"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Message will appear here..."
                  />
                  <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={handleCopy}
                      className="p-2 bg-white shadow-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                    <button 
                      className="p-2 bg-white shadow-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
                      title="Save as template"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Templates</h5>
                  <div className="flex flex-wrap gap-2">
                    {templates.filter(t => t.type === activeTab).map(template => (
                      <button
                        key={template.id}
                        onClick={() => applyTemplate(template.content)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                      >
                        {template.name}
                      </button>
                    ))}
                    <button className="px-4 py-2 border border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-all flex items-center gap-1.5">
                      <Plus size={14} /> New Template
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default OutreachGenerator;
