import React from 'react';
import { FileText, Palette, LayoutTemplate, MonitorSmartphone } from 'lucide-react';

const templateOptions = [
  { id: 'academic', title: 'แบบยื่นเสนอโครงการ', subtitle: 'สไตล์ทางการวิชาการ', icon: FileText },
  { id: 'modern', title: 'แบบโมเดิร์น (สไตล์แถบข้าง)', subtitle: 'ดีไซน์ 2 คอลัมน์ สีกรมท่า', icon: Palette },
  { id: 'modern-top', title: 'แบบโมเดิร์น (สไตล์แถบบน)', subtitle: 'ดีไซน์แถบสีกราฟิกทันสมัย', icon: MonitorSmartphone },
  { id: 'minimal', title: 'แบบมินิมอลกระชับ', subtitle: 'เรียบง่าย เหมาะกับสรุปย่อ', icon: LayoutTemplate },
];

/**
 * CVForm รองรับทั้งโครงสร้าง projects เก่า (string[]) และใหม่ (object[])
 * employees — รายการบุคลากรจาก personnelStore (ผ่าน prop แทนการ import โดยตรง)
 */
export default function CVForm({
  employees,
  selectedEmp,
  setSelectedEmp,
  template,
  setTemplate,
  selectedProjects,
  setSelectedProjects
}) {
  // normalize projects เป็น string เสมอสำหรับ display/checkbox
  const projectTitles = (selectedEmp?.projects || []).map(p =>
    typeof p === 'string' ? p : p.title
  );

  const handleToggleProject = (title) => {
    if (selectedProjects.includes(title)) {
      setSelectedProjects(selectedProjects.filter(item => item !== title));
    } else {
      setSelectedProjects([...selectedProjects, title]);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5 text-left">
      <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
        ตั้งค่าและเลือกข้อมูลจัดทำ CV
      </h3>

      {/* 1. เลือกบุคลากร */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">เลือกบุคลากร</label>
        <select
          className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
          value={selectedEmp?.id || ''}
          onChange={(e) => {
            const found = employees.find(emp => emp.id === e.target.value || emp.id === parseInt(e.target.value));
            if (found) setSelectedEmp(found);
          }}
        >
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.position || emp.role || ''})
            </option>
          ))}
        </select>
        <p className="text-[10px] text-slate-400 mt-1">
          {employees.length} คนในระบบ — สแกน CV เพื่อเพิ่มบุคลากรใหม่
        </p>
      </div>

      {/* 2. เลือกเทมเพลต */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-xs font-semibold text-slate-600">เลือก Template เอกสาร</label>
          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
            มี {templateOptions.length} รูปแบบ
          </span>
        </div>

        <div className="space-y-2">
          {templateOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = template === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTemplate(opt.id)}
                className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>{opt.title}</p>
                    <p className="text-[10px] text-slate-500">{opt.subtitle}</p>
                  </div>
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. เลือกผลงาน */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          รายการผลงานที่ดึงมาจากฐานข้อมูลกลาง
        </label>
        <div className="space-y-2 text-xs">
          {projectTitles.length === 0 && (
            <p className="text-slate-400 italic text-[11px]">บุคลากรนี้ยังไม่มีผลงานในระบบ</p>
          )}
          {projectTitles.map((title, i) => (
            <label
              key={i}
              className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 cursor-pointer hover:bg-indigo-50 transition"
            >
              <input
                type="checkbox"
                checked={selectedProjects.includes(title)}
                onChange={() => handleToggleProject(title)}
                className="rounded text-indigo-600 mt-0.5 cursor-pointer"
              />
              <span className="text-[11px] leading-relaxed select-none">{title}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}