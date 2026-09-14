import React from 'react';
import { CheckCircle2, Save } from 'lucide-react';

export default function ExtractedPreview({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs h-full">
        ยังไม่มีข้อมูลสกัด โปรดกดอัปโหลดไฟล์เพื่อทดสอบ
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left space-y-3">
      <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold border-b border-slate-100 pb-2.5">
        <CheckCircle2 size={16} /> ข้อมูลที่ AI สกัดแยกแยะได้ (Parsed Result)
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">ชื่อ - นามสกุลที่ตรวจพบ</label>
        <input 
          type="text" 
          defaultValue={data.name} 
          className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800" 
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">ตำแหน่งงานปัจจุบัน</label>
        <input 
          type="text" 
          defaultValue={data.role} 
          className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800" 
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500">ผลงาน / โครงการที่จำแนกได้</label>
        <textarea 
          rows={3} 
          defaultValue={data.projects.join('\n')}
          className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700" 
        />
      </div>

      <button className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm mt-2">
        <Save size={14} /> บันทึกระเบียนลงฐานข้อมูลกลาง
      </button>
    </div>
  );
}
