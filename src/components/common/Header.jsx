import React from 'react';
import { Database, Bell } from 'lucide-react';

export default function Header({ currentTab }) {
  const titles = {
    'org-chart': 'ระบบผังองค์กรอัตโนมัติ (Dynamic Organization Chart)',
    'cv-generator': 'ระบบจัดทำ CV อัตโนมัติ (Automated CV Generator)',
    'dashboard': 'แดชบอร์ดวิเคราะห์สถิติและสถานะทักษะ (Analytics Dashboard)',
    'ai-parser': 'ระบบ AI สแกนและสกัดข้อมูล CV เก่า (AI Document Parsing)'
  };

  return (
    <header className="glass-panel border-b border-white/40 px-8 py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm backdrop-blur-2xl">
      <div className="animate-fade-in-up">
        {/* ข้อความ Header เป็น Gradient Text */}
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-indigo-800 to-violet-800 drop-shadow-sm tracking-tight">
          {titles[currentTab]}
        </h2>
        {/* Subtitle พร้อมไฟกระพริบสีคราม */}
        <p className="text-[11px] text-indigo-600/80 font-bold mt-1 flex items-center gap-2 tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          ศูนย์ข้อมูลบุคลากรกลาง (CENTRALIZED DATABASE)
        </p>
      </div>

      <div className="flex items-center gap-5">
        {/* Status Badge แบบมีออร่า */}
        <div className="relative group cursor-help">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
          <div className="relative flex items-center gap-1.5 px-4 py-1.5 bg-white/90 border border-emerald-100 text-emerald-700 rounded-full text-[11px] font-bold shadow-sm">
            <Database size={13} className="animate-pulse" />
            <span>CONNECTED</span>
          </div>
        </div>
        
        {/* กระดิ่งแจ้งเตือน */}
        <button className="relative p-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-white shadow-sm"></span>
          <Bell size={18} />
        </button>

        {/* Profile Widget กรอบเรืองแสง */}
        <div className="flex items-center gap-3 pl-5 border-l border-slate-200/60 cursor-pointer group">
          <div className="text-right">
            <p className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">ผู้ดูแลระบบ</p>
            <p className="text-slate-400 text-[9px] font-bold tracking-widest uppercase">EXECUTIVE ADMIN</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-xl blur opacity-40 group-hover:opacity-80 transition duration-300"></div>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white/50">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}