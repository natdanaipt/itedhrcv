import React, { useState } from 'react';
import { Search, Zap, ZapOff, AlertTriangle, FlaskConical } from 'lucide-react';

const EXAMPLES = [
  {
    title: 'พัฒนาระบบ e-Learning',
    description: 'พัฒนาระบบการเรียนรู้ออนไลน์สำหรับหลักสูตรฝึกอบรมสายช่างอุตสาหกรรม รองรับการสร้างบทเรียน วิดีโอ แบบทดสอบ และออกใบรับรองดิจิทัล โดยต้องเชื่อมต่อกับ Moodle LMS และฐานข้อมูลกลางของสำนัก',
    duration: 12,
    urgency: 'normal'
  },
  {
    title: 'จัดอบรมเชิงปฏิบัติการ IoT สำหรับครูอาชีวศึกษา',
    description: 'ออกแบบและจัดฝึกอบรมเชิงปฏิบัติการ IoT และ Embedded Systems สำหรับครูอาชีวศึกษาจากสถาบันเครือข่าย 50 คน ครอบคลุม Arduino, Raspberry Pi และการต่อวงจรพื้นฐาน พร้อมจัดทำคู่มือและสื่อประกอบการสอน',
    duration: 4,
    urgency: 'urgent'
  },
  {
    title: 'วิเคราะห์ข้อมูลผลการเรียนและสมรรถนะบุคลากร',
    description: 'วิเคราะห์ข้อมูลผลการเรียนและสมรรถนะบุคลากรสำนักพัฒนาเทคนิคศึกษาประจำปี 2568 จัดทำ Dashboard รายงานผล KPI ตามแผนยุทธศาสตร์ และนำเสนอต่อคณะกรรมการสำนัก',
    duration: 6,
    urgency: 'urgent'
  }
];

const URGENCY_OPTIONS = [
  { value: 'normal',      label: 'ปกติ',    icon: ZapOff,        color: 'text-slate-500',  bg: 'bg-slate-50 border-slate-200'   },
  { value: 'urgent',      label: 'ด่วน',    icon: Zap,           color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-300'   },
  { value: 'urgent-high', label: 'ด่วนมาก', icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50 border-red-300'       },
];

export default function JobForm({ onAnalyze, isLoading }) {
  const [form, setForm] = useState({ title: '', description: '', duration: 4, urgency: 'normal' });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const applyExample = (ex) => setForm({ title: ex.title, description: ex.description, duration: ex.duration, urgency: ex.urgency });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAnalyze(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 text-left">
      <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">รายละเอียดงาน</h3>

      {/* Example buttons */}
      <div>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <FlaskConical size={12} /> ตัวอย่างงาน
        </p>
        <div className="space-y-1.5">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyExample(ex)}
              className="w-full text-left text-[11px] px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 font-medium transition truncate"
            >
              #{i + 1} {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* ชื่องาน */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">ชื่องาน / โครงการ *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => update('title', e.target.value)}
          placeholder="เช่น พัฒนาระบบฐานข้อมูลกลาง"
          required
          className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-white"
        />
      </div>

      {/* รายละเอียด */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">รายละเอียดงาน</label>
        <textarea
          value={form.description}
          onChange={e => update('description', e.target.value)}
          placeholder="อธิบายขอบเขตงาน ทักษะที่ต้องการ เทคโนโลยีที่ใช้ ฯลฯ"
          rows={5}
          className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-white resize-none"
        />
      </div>

      {/* ระยะเวลา */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">
          ระยะเวลา: <span className="text-indigo-600 font-bold">{form.duration} สัปดาห์</span>
        </label>
        <input
          type="range" min={1} max={24} step={1}
          value={form.duration}
          onChange={e => update('duration', Number(e.target.value))}
          className="w-full h-2 accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>1 สัปดาห์</span><span>12 สัปดาห์</span><span>24 สัปดาห์</span>
        </div>
      </div>

      {/* ความเร่งด่วน */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-2">ระดับความเร่งด่วน</label>
        <div className="grid grid-cols-3 gap-2">
          {URGENCY_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isSelected = form.urgency === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('urgency', opt.value)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-[11px] font-bold transition
                  ${isSelected ? opt.bg + ' ' + opt.color + ' ring-1 ring-current' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
              >
                <Icon size={14} />{opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !form.title.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition shadow-sm"
      >
        <Search size={16} />
        {isLoading ? 'กำลังวิเคราะห์...' : 'วิเคราะห์หาผู้เหมาะสม'}
      </button>
    </form>
  );
}
