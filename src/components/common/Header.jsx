import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

export default function Header({ currentTab }) {
  const titles = {
    'org-chart': 'ระบบผังองค์กรอัตโนมัติ (Dynamic Organization Chart)',
    'cv-generator': 'ระบบจัดทำ CV อัตโนมัติ (Automated CV Generator)',
    'dashboard': 'แดชบอร์ดวิเคราะห์สถิติและสถานะทักษะบุคลากร (Analytics Dashboard)',
    'ai-parser': 'ระบบ AI สแกนและสกัดข้อมูล CV เก่า (AI CV Document Parsing)'
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{titles[currentTab]}</h2>
        <p className="text-xs text-slate-500 mt-0.5">เชื่อมโยงจากศูนย์ข้อมูลบุคลากรกลาง (Centralized Database)</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-medium">
          <Database size={14} />
          <span>ฐานข้อมูลกลาง: เชื่อมต่อแล้ว</span>
        </div>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            AD
          </div>
          <div className="text-left text-xs">
            <p className="font-semibold text-slate-700">ผู้ดูแลระบบ</p>
            <p className="text-slate-400 text-[10px]">ระดับผู้บริหาร</p>
          </div>
        </div>
      </div>
    </header>
  );
}
