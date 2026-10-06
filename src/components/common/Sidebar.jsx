import React from 'react';
import { Network, FileText, BarChart3, Sparkles, Briefcase } from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const menuItems = [
    { id: 'org-chart',     label: 'ผังองค์กร (Org Chart)',         icon: Network   },
    { id: 'cv-generator',  label: 'ระบบสร้าง CV อัตโนมัติ',        icon: FileText  },
    { id: 'dashboard',     label: 'แดชบอร์ดวิเคราะห์ทักษะ',        icon: BarChart3 },
    { id: 'ai-parser',     label: 'AI สแกน CV เก่า',               icon: Sparkles  },
    { id: 'job-matching',  label: 'มอบหมายงาน (Job Matching)',      icon: Briefcase },
  ];

  return (
    <aside className="w-[260px] glass-sidebar text-white flex flex-col justify-between p-5 flex-shrink-0 relative z-20 transition-all">
      <div>
        {/* โลโก้พร้อมออร่าเรืองแสง */}
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-700/50 mb-6">
          <div className="relative group cursor-pointer">
            {/* แสง Glow ด้านหลังโลโก้ */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
            <div className="relative w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-lg text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-fuchsia-400">
              HR
            </div>
          </div>
          <div>
            <h1 className="font-bold text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">ITED</h1>
            <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-widest mt-0.5">ระบบบริหาร</p>
          </div>
        </div>

        {/* เมนูนำทาง (Interactive Hover Effects) */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? 'text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                    : 'text-slate-400 hover:text-white hover:translate-x-1.5'
                }`}
              >
                {/* แบ็คกราวด์ปุ่มที่ Active (Gradient Glass) */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-violet-600/80 backdrop-blur-md rounded-xl"></div>
                )}
                
                {/* แบ็คกราวด์ปุ่มตอน Hover (กระจกบางๆ) */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                )}

                <div className="relative flex items-center gap-3 z-10">
                  <Icon size={18} className={isActive ? 'text-white' : 'group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-300'} />
                  <span className="tracking-wide">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* การ์ดด้านล่างสุด */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 rounded-xl border border-slate-700/50 text-xs text-slate-400 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles size={14} className="text-amber-400" />
          <p className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Prototype</p>
        </div>
      </div>
    </aside>
  );
}