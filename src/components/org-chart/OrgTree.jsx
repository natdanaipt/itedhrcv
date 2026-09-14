import React from 'react';
import { mockOrgStructure } from '../../data/mockData';
import { Users, ChevronRight, CheckCircle2, Shield } from 'lucide-react';

export default function OrgTree({ onSelectNode }) {
  const { director, executives, departments } = mockOrgStructure;

  return (
    <div className="bg-slate-100/70 p-8 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center overflow-x-auto min-w-full">
      {/* 1. กล่องผู้อำนวยการ */}
      <div 
        onClick={() => onSelectNode(director)}
        className="bg-white border-2 border-indigo-600 rounded-xl p-4 shadow-md text-center w-80 cursor-pointer hover:scale-[1.02] transition"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
          Executive Leader
        </span>
        <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full mx-auto flex items-center justify-center font-bold text-base my-2 border border-indigo-200">
          ผอ.
        </div>
        <h3 className="font-bold text-sm text-slate-900">{director.name}</h3>
        <p className="text-xs font-medium text-indigo-600">{director.role}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{director.organization}</p>
      </div>

      {/* เส้นเชื่อมลงมาระดับที่ปรึกษา / รองผู้อำนวยการ */}
      <div className="w-0.5 h-6 bg-slate-300"></div>

      {/* 2. กล่องที่ปรึกษาและรองผู้อำนวยการ */}
      <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
        {executives.map((exec, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelectNode(exec)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-center text-xs shadow-sm hover:border-indigo-400 cursor-pointer"
          >
            <p className="font-bold text-slate-800">{exec.name}</p>
            <p className="text-[11px] text-slate-500">{exec.role}</p>
          </div>
        ))}
      </div>

      {/* เส้นเชื่อมลงมา 8 แผนก/ฝ่าย */}
      <div className="w-0.5 h-8 bg-slate-300 my-1"></div>
      <div className="w-11/12 h-0.5 bg-slate-300"></div>

      {/* 3. แสดงการ์ด 8 แผนก/ฝ่าย (จัดเป็น Grid 4 คอลัมน์) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => onSelectNode(dept)}
            className={`bg-white border rounded-xl p-4 text-left transition-all cursor-pointer hover:shadow-md flex flex-col justify-between ${
              dept.isRealData 
                ? 'border-indigo-400 ring-2 ring-indigo-50/80 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex justify-between items-start gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                  dept.isRealData 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {dept.isRealData && <CheckCircle2 size={11} />}
                  {dept.isRealData ? 'โครงสร้างรอข้อมูล' : 'โครงสร้างรอข้อมูล'}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Users size={12} /> {dept.count} คน
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mt-2.5 line-clamp-1">{dept.name}</h4>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">{dept.headRole}</p>
              <p className="text-xs text-slate-600 mt-1 font-semibold">{dept.head}</p>

              {/* รายชื่อย่อย */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1">
                {dept.members.slice(0, 3).map((mem, i) => (
                  <p key={i} className="text-[11px] text-slate-500 truncate">• {mem}</p>
                ))}
                {dept.members.length > 3 && (
                  <p className="text-[10px] text-indigo-600 font-medium">+ ดูเพิ่มอีก {dept.members.length - 3} คน</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-medium">
              <span>คลิกเพื่อดูรายละเอียด</span>
              <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}