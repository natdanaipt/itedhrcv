import React from 'react';
import { mockOrgStructure } from '../../data/mockData';
import { Users, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function OrgTree({ onSelectNode, countOverrides = {} }) {
  const { director, executives, departments } = mockOrgStructure;

  return (
    <div className="glass-panel p-10 rounded-[2rem] flex flex-col items-center overflow-x-auto min-w-full relative z-10">
      
      {/* 1. กล่องผู้อำนวยการ (CEO Node) */}
      <div 
        onClick={() => onSelectNode(director)}
        className="relative group cursor-pointer"
      >
        {/* ออร่าเรืองแสงด้านหลัง - ใช้แค่ opacity ในการทำ Hover จะไม่กระตุก */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-60 blur-lg transition-opacity duration-300"></div>
        
        <div className="relative bg-white border border-slate-100 rounded-2xl p-6 shadow-xl text-center w-80 transform-gpu transition-transform duration-300 group-hover:-translate-y-1.5">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full shadow-md">
            Executive Leader
          </span>
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 mx-auto flex items-center justify-center font-bold text-xl text-white shadow-inner mb-3 ring-4 ring-slate-50">
            ผอ.
          </div>
          <h3 className="font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900">
            {director.name}
          </h3>
          <p className="text-xs font-bold text-indigo-600 mt-0.5">{director.role}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{director.organization}</p>
        </div>
      </div>

      <div className="w-1 h-8 bg-gradient-to-b from-indigo-400 to-purple-300 rounded-full my-2"></div>

      {/* 2. กล่องที่ปรึกษาและรองผู้อำนวยการ */}
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl z-10">
        {executives.map((exec, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelectNode(exec)}
            className="group bg-white border border-slate-200 rounded-xl px-5 py-3 text-center text-xs shadow-sm cursor-pointer hover:bg-slate-50 transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-indigo-300"
          >
            <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{exec.name}</p>
            <p className="text-[11px] text-slate-500 font-medium">{exec.role}</p>
          </div>
        ))}
      </div>

      <div className="w-1 h-10 bg-gradient-to-b from-purple-300 to-sky-300 rounded-full my-2"></div>
      
      {/* เส้นแนวนอน (Horizontal Connector) */}
      <div className="w-[90%] h-1 bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-sky-300 rounded-full shadow-sm relative">
        <div className="absolute -top-1 left-0 w-3 h-3 rounded-full bg-indigo-400 ring-4 ring-white shadow-sm"></div>
        <div className="absolute -top-1 right-0 w-3 h-3 rounded-full bg-sky-400 ring-4 ring-white shadow-sm"></div>
      </div>

      {/* 3. แสดงการ์ด 8 แผนก/ฝ่าย */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => onSelectNode(dept)}
            className="group relative"
          >
            {/* ตัด Blur ออก ใช้แค่เงาสี (Shadow) เพื่อให้ไม่กินสเปค */}
            <div className={`relative h-full bg-white border rounded-2xl p-5 text-left transform-gpu transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
              dept.isRealData 
                ? 'border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:border-emerald-300 hover:-translate-y-1' 
                : 'border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1'
            }`}>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase ${
                    dept.isRealData 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {dept.isRealData ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                    {dept.isRealData ? 'ข้อมูลจริง' : 'โครงสร้าง'}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg">
                    <Users size={12} /> {countOverrides[dept.name] ?? dept.count}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors">{dept.name}</h4>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-1.5">{dept.headRole}</p>
                <p className="text-xs text-slate-700 mt-0.5 font-medium">{dept.head}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                  {dept.members.slice(0, 3).map((mem, i) => (
                    <p key={i} className="text-[10px] text-slate-500 truncate flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span> {mem}
                    </p>
                  ))}
                  {dept.members.length > 3 && (
                    <p className="text-[10px] text-indigo-500 font-bold pl-2.5 mt-1">+ เพิ่มเติมอีก {dept.members.length - 3} ท่าน</p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold">
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