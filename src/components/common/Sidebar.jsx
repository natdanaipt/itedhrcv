import React from 'react';
import { Network, FileText, BarChart3, Sparkles } from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const menuItems = [
    { id: 'org-chart', label: 'ผังองค์กร (Org Chart)', icon: Network },
    { id: 'cv-generator', label: 'ระบบสร้าง CV อัตโนมัติ', icon: FileText },
    { id: 'dashboard', label: 'แดชบอร์ดวิเคราะห์ทักษะ', icon: BarChart3 },
    { id: 'ai-parser', label: 'AI สแกน CV เก่า', icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 flex-shrink-0">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-600/30">
            HR
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">ITED</h1>
            <p className="text-xs text-slate-400">ระบบบริหาร</p>
          </div>
        </div>

        <nav className="mt-6 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">Prototype</p>
      </div>
    </aside>
  );
}
