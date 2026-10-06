import React from 'react';
import { Clock, Trash2, Zap, ZapOff, AlertTriangle } from 'lucide-react';

const URGENCY_LABEL = {
  normal:       { label: 'ปกติ',    Icon: ZapOff,        color: 'text-slate-500' },
  urgent:       { label: 'ด่วน',    Icon: Zap,           color: 'text-amber-600' },
  'urgent-high':{ label: 'ด่วนมาก', Icon: AlertTriangle, color: 'text-red-600'   }
};

export default function AssignmentHistory({ history, onClear }) {
  if (!history?.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center text-center">
        <Clock size={28} className="text-slate-300 mb-2" />
        <p className="text-xs text-slate-400">ยังไม่มีประวัติการมอบหมายงาน</p>
        <p className="text-[11px] text-slate-300 mt-1">กดปุ่ม "มอบหมายงาน" บนการ์ดผู้สมัครเพื่อบันทึก</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <Clock size={14} className="text-indigo-500" />
          ประวัติการมอบหมายงาน ({history.length} รายการ)
        </h4>
        <button onClick={onClear}
          className="text-[11px] text-red-400 hover:text-red-600 flex items-center gap-1 transition">
          <Trash2 size={11} /> ล้างประวัติ
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
              <th className="text-left px-4 py-2.5">วันที่</th>
              <th className="text-left px-4 py-2.5">ชื่องาน</th>
              <th className="text-left px-4 py-2.5">มอบหมายให้</th>
              <th className="text-center px-4 py-2.5">ระยะเวลา</th>
              <th className="text-center px-4 py-2.5">ความเร่งด่วน</th>
              <th className="text-center px-4 py-2.5">คะแนน</th>
              <th className="text-center px-4 py-2.5">+ภาระงาน</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => {
              const u = URGENCY_LABEL[h.urgency] || URGENCY_LABEL.normal;
              const date = new Date(h.assignedAt);
              return (
                <tr key={h.id}
                  className={`border-b border-slate-50 hover:bg-slate-50/60 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">
                    {date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}{' '}
                    {date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-800 max-w-[160px] truncate">{h.jobTitle}</td>
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-slate-700 truncate max-w-[130px]">{h.personName}</p>
                    <p className="text-slate-400 truncate max-w-[130px]">{h.personPosition}</p>
                  </td>
                  <td className="px-4 py-2.5 text-center text-slate-600">{h.duration} สัปดาห์</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`flex items-center justify-center gap-1 font-semibold ${u.color}`}>
                      <u.Icon size={11} /> {u.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center font-bold text-indigo-700">{h.finalScore}</td>
                  <td className="px-4 py-2.5 text-center font-bold text-red-500">+{h.workloadAdded}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
