import React from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Mail,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const stats = [
  { label: 'Total Leads', value: '1,284', change: '+12.5%', icon: Users, color: 'blue' },
  { label: 'Active Pipeline', value: '$45,200', change: '+8.2%', icon: Target, color: 'emerald' },
  { label: 'Conversion Rate', value: '4.8%', change: '-1.4%', icon: TrendingUp, color: 'violet' },
  { label: 'Outreach Sent', value: '452', change: '+24%', icon: Mail, color: 'amber' },
];

const growthData = [
  { name: 'Mon', leads: 40, outreach: 24 },
  { name: 'Tue', leads: 30, outreach: 13 },
  { name: 'Wed', leads: 20, outreach: 98 },
  { name: 'Thu', leads: 27, outreach: 39 },
  { name: 'Fri', leads: 18, outreach: 48 },
  { name: 'Sat', leads: 23, outreach: 38 },
  { name: 'Sun', leads: 34, outreach: 43 },
];

const statusData = [
  { name: 'Discovery', count: 400 },
  { name: 'Prospect', count: 300 },
  { name: 'Contacted', count: 200 },
  { name: 'Negotiating', count: 80 },
  { name: 'Closed', count: 50 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Growth Analytics</h2>
          <p className="text-slate-500 mt-1">Track your sales performance and lead generation progress.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div className={clsx(
                "p-3 rounded-xl",
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.color === 'violet' && "bg-violet-50 text-violet-600",
                stat.color === 'amber' && "bg-amber-50 text-amber-600",
              )}>
                <stat.icon size={24} />
              </div>
              <div className={clsx(
                "flex items-center gap-1 text-sm font-medium",
                stat.change.startsWith('+') ? "text-emerald-600" : "text-rose-600"
              )}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Lead Growth vs Outreach</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="outreach" stroke="#8b5cf6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Pipeline Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for class names
const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default Dashboard;
