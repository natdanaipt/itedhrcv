import React from 'react';
import { Users, ChevronRight } from 'lucide-react';

export default function OrgNode({ title, role, name, count, subUnits, onSelect }) {
  return (
    <div 
      onClick={onSelect}
      className="bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md rounded-xl p-4 transition-all cursor-pointer w-72 text-left"
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
          {title}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <Users size={12} /> {count} คน
        </span>
      </div>

      <div className="mt-3">
        <h4 className="font-bold text-sm text-slate-800">{role}</h4>
        <p className="text-xs text-slate-600 mt-0.5">{name}</p>
      </div>

      {subUnits && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1">
          {subUnits.map((sub, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              {sub}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-indigo-600 font-medium">
        <span>ดูข้อมูลบุคลากรในฝ่าย</span>
        <ChevronRight size={14} />
      </div>
    </div>
  );
}
