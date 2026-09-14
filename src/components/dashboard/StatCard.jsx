import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-left flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}
