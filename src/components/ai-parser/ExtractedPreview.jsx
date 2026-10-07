import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Save, Trash2, Plus, X, ChevronDown, ChevronUp, RefreshCw, AlertTriangle
} from 'lucide-react';

const SKILL_CATEGORIES = [
  'Web & System', 'AI & ML', 'Data Analytics', 'Management', 'อื่นๆ'
];

function SkillSlider({ skill, onChange, onRemove, uncertainFields }) {
  const isUncertain = uncertainFields?.includes('proficiency') || uncertainFields?.includes('skills');
  const levelText = skill.proficiency === null || skill.proficiency === undefined ? '' : skill.proficiency;
  
  return (
    <div className={`bg-slate-50 border ${isUncertain ? 'border-yellow-400' : 'border-slate-200'} rounded-lg p-3 space-y-2`}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={skill.name || ''}
          onChange={(e) => onChange({ ...skill, name: e.target.value })}
          placeholder="ชื่อทักษะ"
          className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
        />
        <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
          <X size={14} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={skill.category || 'อื่นๆ'}
          onChange={(e) => onChange({ ...skill, category: e.target.value })}
          className="text-[11px] border border-slate-200 rounded px-1.5 py-1 bg-white focus:outline-none focus:border-indigo-500"
        >
          {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex-1 flex items-center gap-2">
          <input
            type="number"
            min={0} max={100}
            value={levelText}
            onChange={(e) => {
              const val = e.target.value;
              onChange({ ...skill, proficiency: val === '' ? null : Number(val) });
            }}
            placeholder="ยังไม่ระบุ"
            className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}

export default function ExtractedPreview({ data, onSave, onClear }) {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({ ...data });
      setSaved(false);
    }
  }, [data]);

  if (!form) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs h-full min-h-[300px] text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <CheckCircle2 size={28} className="text-slate-300" />
        </div>
        <p className="font-medium text-slate-500">ผลการวิเคราะห์จะแสดงที่นี่</p>
        <p className="text-slate-400 mt-1">หลังจากอัปโหลดไฟล์</p>
      </div>
    );
  }

  const isLowConfidence = form.confidence !== undefined && form.confidence < 0.8;
  const uncertainFields = form.uncertain_fields || [];

  const updatePersonal = (field, value) => setForm(f => ({
    ...f, personal: { ...f.personal, [field]: value }
  }));

  const updateArray = (arrayName, idx, field, val) => setForm(f => ({
    ...f,
    [arrayName]: f[arrayName].map((item, i) => i === idx ? { ...item, [field]: val } : item)
  }));
  const updateArrayItem = (arrayName, idx, val) => setForm(f => ({
    ...f,
    [arrayName]: f[arrayName].map((item, i) => i === idx ? val : item)
  }));
  const addArrayItem = (arrayName, emptyItem) => setForm(f => ({
    ...f,
    [arrayName]: [...(f[arrayName] || []), emptyItem]
  }));
  const removeArrayItem = (arrayName, idx) => setForm(f => ({
    ...f,
    [arrayName]: f[arrayName].filter((_, i) => i !== idx)
  }));

  const handleSaveClick = async () => {
    try {
      await onSave(form);
      setSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getBorderColor = (field) => uncertainFields.includes(field) ? 'border-yellow-400' : 'border-slate-200';

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left space-y-5 overflow-y-auto max-h-[80vh]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
          <CheckCircle2 size={16} />
          ตรวจสอบข้อมูลที่สกัดได้
        </div>
        {onClear && (
          <button onClick={onClear} className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1">
            <RefreshCw size={12} /> ล้างข้อมูล
          </button>
        )}
      </div>

      {isLowConfidence && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold text-yellow-700 bg-yellow-50 border-yellow-200">
          <AlertTriangle size={16} /> เอกสารอาจไม่ชัดเจน กรุณาตรวจสอบข้อมูลอย่างละเอียด
        </div>
      )}

      {/* ข้อมูลส่วนตัว */}
      <section>
        <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest mb-2.5">ข้อมูลส่วนตัว</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'คำนำหน้า', field: 'title' },
            { label: 'ชื่อ', field: 'first_name' },
            { label: 'นามสกุล', field: 'last_name' },
            { label: 'ตำแหน่งงาน', field: 'position' },
            { label: 'หน่วยงาน/ฝ่าย', field: 'department' },
            { label: 'อีเมล', field: 'email' },
            { label: 'เบอร์โทรศัพท์', field: 'phone' },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="text-[11px] font-medium text-slate-500">{label}</label>
              <input
                type="text"
                value={form.personal?.[field] || ''}
                onChange={(e) => updatePersonal(field, e.target.value)}
                className={`mt-1 w-full px-2.5 py-2 border ${getBorderColor(field)} rounded-lg text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-indigo-500 focus:bg-white`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* สรุป */}
      <section>
        <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest mb-2.5">สรุป (Summary)</h4>
        <textarea
          value={form.summary || ''}
          onChange={(e) => setForm(f => ({ ...f, summary: e.target.value }))}
          className={`w-full px-2.5 py-2 border ${getBorderColor('summary')} rounded-lg text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-indigo-500 resize-none h-24`}
        />
      </section>

      {/* การศึกษา */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest">การศึกษา</h4>
          <button onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })} className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold">
            <Plus size={12} /> เพิ่ม
          </button>
        </div>
        <div className="space-y-2">
          {(form.education || []).map((edu, i) => (
            <div key={i} className="flex gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
              <input type="text" value={edu.degree || ''} onChange={(e) => updateArray('education', i, 'degree', e.target.value)} placeholder="ปริญญา" className="w-1/3 text-xs border border-slate-200 rounded px-2 py-1.5" />
              <input type="text" value={edu.institution || ''} onChange={(e) => updateArray('education', i, 'institution', e.target.value)} placeholder="สถาบัน" className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5" />
              <input type="text" value={edu.year || ''} onChange={(e) => updateArray('education', i, 'year', e.target.value)} placeholder="ปี" className="w-16 text-xs border border-slate-200 rounded px-2 py-1.5" />
              <button onClick={() => removeArrayItem('education', i)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
            </div>
          ))}
        </div>
      </section>
      
      {/* ประสบการณ์ */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest">ประสบการณ์</h4>
          <button onClick={() => addArrayItem('experience', { position: '', organization: '', description: '' })} className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold">
            <Plus size={12} /> เพิ่ม
          </button>
        </div>
        <div className="space-y-2">
          {(form.experience || []).map((exp, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-2 space-y-2">
              <div className="flex gap-2">
                <input type="text" value={exp.position || ''} onChange={(e) => updateArray('experience', i, 'position', e.target.value)} placeholder="ตำแหน่ง" className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5" />
                <button onClick={() => removeArrayItem('experience', i)} className="text-slate-400 hover:text-red-500"><X size={14}/></button>
              </div>
              <input type="text" value={exp.organization || ''} onChange={(e) => updateArray('experience', i, 'organization', e.target.value)} placeholder="องค์กร" className="w-full text-xs border border-slate-200 rounded px-2 py-1.5" />
              <textarea value={exp.description || ''} onChange={(e) => updateArray('experience', i, 'description', e.target.value)} placeholder="รายละเอียด" className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 resize-none h-16" />
            </div>
          ))}
        </div>
      </section>

      {/* ทักษะ */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest">ทักษะ</h4>
          <button onClick={() => addArrayItem('skills', { name: '', category: 'อื่นๆ', proficiency: null })} className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold">
            <Plus size={12} /> เพิ่ม
          </button>
        </div>
        <div className="space-y-2">
          {(form.skills || []).map((skill, i) => (
            <SkillSlider key={i} skill={skill} onChange={(val) => updateArrayItem('skills', i, val)} onRemove={() => removeArrayItem('skills', i)} uncertainFields={uncertainFields} />
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <button onClick={handleSaveClick} disabled={saved} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${saved ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
          <Save size={14} />
          {saved ? 'บันทึกสำเร็จ' : 'ยืนยันบันทึก'}
        </button>
      </div>
    </div>
  );
}
