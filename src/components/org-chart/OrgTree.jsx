import React from 'react';
import { mockOrgStructure } from '../../data/mockData';
import { Users, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function OrgTree({ onSelectNode }) {
  const { director, executives, departments } = mockOrgStructure;

  return (
    <div className="glass-panel p-10 rounded-[2rem] flex flex-col items-center overflow-x-auto min-w-full relative z-10 border-white/80">
      
      {/* 1. กล่องผู้อำนวยการ (CEO Node - Glow Effect) */}
      <div 
        onClick={() => onSelectNode(director)}
        className="relative group cursor-pointer animate-fade-in-up"
      >
        {/* ออร่าเรืองแสงด้านหลัง */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
        
        <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-xl text-center w-80 transform transition duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full shadow-md">
            Executive Leader
          </span>
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 mx-auto flex items-center justify-center font-bold text-xl text-white shadow-inner mb-3 ring-4 ring-white">
            ผอ.
          </div>
          <h3 className="font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900">
            {director.name}
          </h3>
          <p className="text-xs font-bold text-indigo-600 mt-0.5">{director.role}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{director.organization}</p>
        </div>
      </div>

      {/* เส้นเชื่อมลงมาระดับที่ปรึกษา (Gradient Line) */}
      <div className="w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-300 rounded-full my-2 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>

      {/* 2. กล่องที่ปรึกษาและรองผู้อำนวยการ (Glass Pills) */}
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl z-10">
        {executives.map((exec, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelectNode(exec)}
            className="group relative bg-white/60 backdrop-blur-md border border-white/80 rounded-xl px-5 py-3 text-center text-xs shadow-sm cursor-pointer hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/20"
          >
            <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{exec.name}</p>
            <p className="text-[11px] text-slate-500 font-medium">{exec.role}</p>
          </div>
        ))}
      </div>

      {/* เส้นเชื่อมลงมา 8 แผนก/ฝ่าย */}
      <div className="w-1 h-10 bg-gradient-to-b from-purple-300 to-sky-300 rounded-full my-2 shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
      
      {/* เส้นแนวนอน (Horizontal Connector) */}
      <div className="w-[90%] h-1 bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-sky-300 rounded-full shadow-sm relative">
        {/* จุดเชื่อม */}
        <div className="absolute -top-1 left-0 w-3 h-3 rounded-full bg-indigo-400 ring-4 ring-white shadow-sm"></div>
        <div className="absolute -top-1 right-0 w-3 h-3 rounded-full bg-sky-400 ring-4 ring-white shadow-sm"></div>
      </div>

      {/* 3. แสดงการ์ด 8 แผนก/ฝ่าย (Glassmorphism Grid) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {departments.map((dept, index) => (
          <div
            key={dept.id}
            onClick={() => onSelectNode(dept)}
            className="group relative animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Glow Effect สำหรับข้อมูลจริง */}
            {dept.isRealData && (
              <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            )}
            
            <div className={`relative h-full bg-white/70 backdrop-blur-xl border rounded-2xl p-5 text-left transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
              dept.isRealData 
                ? 'border-white ring-1 ring-emerald-200/50 hover:bg-white/90 shadow-xl shadow-emerald-900/5 hover:-translate-y-1.5' 
                : 'border-white/60 hover:bg-white/80 hover:border-white shadow-lg shadow-slate-900/5 hover:-translate-y-1'
            }`}>
              
              {/* ตกแต่งมุมการ์ด */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase ${
                    dept.isRealData 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white' 
                      : 'bg-slate-200/80 text-slate-500'
                  }`}>
                    {dept.isRealData ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                    {dept.isRealData ? 'ข้อมูลจริง' : 'โครงสร้าง'}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-indigo-600 font-bold bg-indigo-50/80 px-2 py-1 rounded-lg">
                    <Users size={12} /> {dept.count}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">{dept.name}</h4>
                <p className="text-[10px] text-indigo-500/80 font-bold uppercase tracking-wider mt-1.5">{dept.headRole}</p>
                <p className="text-xs text-slate-700 mt-0.5 font-medium">{dept.head}</p>

                {/* รายชื่อย่อย */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5">
                  {dept.members.slice(0, 3).map((mem, i) => (
                    <p key={i} className="text-[10px] text-slate-500 truncate flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-400"></span> {mem}
                    </p>
                  ))}
                  {dept.members.length > 3 && (
                    <p className="text-[10px] text-indigo-500 font-bold pl-2.5 mt-1">+ เพิ่มเติมอีก {dept.members.length - 3} ท่าน</p>
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-indigo-600 font-bold">
                <span className="group-hover:translate-x-1 transition-transform">ดูรายละเอียด</span>
                <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}