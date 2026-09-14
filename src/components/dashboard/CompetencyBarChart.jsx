import React from 'react';

export default function CompetencyBarChart() {
  const categories = [
    { label: "Web & System", score: 85, color: "bg-indigo-600" },
    { label: "AI & ML", score: 70, color: "bg-purple-600" },
    { label: "Network & Infra", score: 65, color: "bg-blue-600" },
    { label: "Data Analytics", score: 80, color: "bg-emerald-600" },
    { label: "Management", score: 60, color: "bg-amber-500" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-left">
      <h4 className="text-sm font-bold text-slate-900 mb-1">ภาพรวมความเชี่ยวชาญบุคลากรระดับสำนัก</h4>
      <p className="text-xs text-slate-400 mb-6">สรุปจากฐานข้อมูลทักษะกลาง เพื่อช่วยผู้บริหารวางแผนจัดสรรอัตรากำลัง</p>

      <div className="h-48 flex items-end justify-around border-b border-slate-200 pb-2">
        {categories.map((c, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-slate-600">{c.score}%</span>
            <div 
              className={`w-10 rounded-t-md ${c.color} transition-all duration-500`}
              style={{ height: `${c.score * 1.5}px` }}
            />
            <span className="text-[11px] font-medium text-slate-600 text-center max-w-[70px]">
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
