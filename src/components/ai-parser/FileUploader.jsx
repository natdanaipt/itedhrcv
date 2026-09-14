import React from 'react';
import { UploadCloud } from 'lucide-react';

export default function FileUploader({ onSimulateParse, isParsing }) {
  return (
    <div className="bg-white p-8 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <UploadCloud size={30} />
      </div>
      <h4 className="font-bold text-sm text-slate-900">อัปโหลดไฟล์ CV หรือ Resume เดิม (PDF / รูปภาพ)</h4>
      <p className="text-xs text-slate-400 mt-1 max-w-sm mb-5">
        ระบบจะใช้โมเดล AI สแกนแยกแยะฟิลด์ข้อมูล (ชื่อ, ตำแหน่ง, ประวัติการทำงาน, งานวิจัย) เข้าสู่ฐานข้อมูลกลางอัตโนมัติ
      </p>

      <button
        onClick={onSimulateParse}
        disabled={isParsing}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg text-xs font-bold transition shadow-sm"
      >
        {isParsing ? 'AI กำลังประมวลผลและแยกแยะข้อมูล...' : 'จำลองอัปโหลดและทดสอบสแกน CV'}
      </button>
    </div>
  );
}
