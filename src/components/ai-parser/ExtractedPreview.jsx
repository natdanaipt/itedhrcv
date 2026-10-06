import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Save, Trash2, Plus, X, ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react';
import { save as savePerson } from '../../data/personnelStore';

const SKILL_CATEGORIES = [
  'Web & System', 'AI & ML', 'Network & Infra', 'Data Analytics', 'Management', 'อื่นๆ'
];

function SkillSlider({ skill, onChange, onRemove }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={skill.name}
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
            type="range"
            min={0} max={100} step={5}
            value={skill.level || 0}
            onChange={(e) => onChange({ ...skill, level: Number(e.target.value) })}
            className="flex-1 h-1.5 accent-indigo-600"
          />
          <span className={`text-[11px] font-bold w-8 text-right
            ${skill.level >= 80 ? 'text-emerald-600' : skill.level >= 60 ? 'text-amber-600' : 'text-slate-400'}`}>
            {skill.level}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ proj, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          type="text"
          value={proj.title}
          onChange={(e) => onChange({ ...proj, title: e.target.value })}
          placeholder="ชื่อโครงการ"
          className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
        />
        <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-indigo-500 transition-colors">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
          <X size={14} />
        </button>
      </div>
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-slate-200 pt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={proj.role || ''}
              onChange={(e) => onChange({ ...proj, role: e.target.value })}
              placeholder="บทบาท/หน้าที่"
              className="flex-1 text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={proj.year || ''}
              onChange={(e) => onChange({ ...proj, year: e.target.value })}
              placeholder="ปี พ.ศ."
              className="w-20 text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <textarea
            value={proj.description || ''}
            onChange={(e) => onChange({ ...proj, description: e.target.value })}
            placeholder="รายละเอียด"
            rows={2}
            className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      )}
    </div>
  );
}

export default function ExtractedPreview({ data, onReset }) {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (data) {
      setForm({ ...data });
      setSaved(false);
      setSaveError('');
    }
  }, [data]);

  if (!form) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs h-full min-h-[300px] text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <CheckCircle2 size={28} className="text-slate-300" />
        </div>
        <p className="font-medium text-slate-500">ยังไม่มีข้อมูล</p>
        <p className="text-slate-400 mt-1">อัปโหลดและวิเคราะห์ CV เพื่อดูผลลัพธ์ที่นี่</p>
      </div>
    );
  }

  // ---------- helpers ----------
  const updateField = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const updateSkill = (idx, val) => setForm(f => ({
    ...f, skills: f.skills.map((s, i) => i === idx ? val : s)
  }));
  const removeSkill = (idx) => setForm(f => ({
    ...f, skills: f.skills.filter((_, i) => i !== idx)
  }));
  const addSkill = () => setForm(f => ({
    ...f, skills: [...(f.skills || []), { name: '', level: 50, category: 'อื่นๆ' }]
  }));

  const updateProject = (idx, val) => setForm(f => ({
    ...f, projects: f.projects.map((p, i) => i === idx ? val : p)
  }));
  const removeProject = (idx) => setForm(f => ({
    ...f, projects: f.projects.filter((_, i) => i !== idx)
  }));
  const addProject = () => setForm(f => ({
    ...f, projects: [...(f.projects || []), { title: '', role: '', year: '', description: '' }]
  }));

  const updateEducation = (idx, field, val) => setForm(f => ({
    ...f,
    education: f.education.map((e, i) => i === idx ? { ...e, [field]: val } : e)
  }));

  const handleSave = () => {
    try {
      setSaveError('');
      savePerson(form);
      setSaved(true);
    } catch (err) {
      setSaveError('บันทึกไม่สำเร็จ: ' + err.message);
    }
  };

  // ---------- render ----------
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left space-y-5 overflow-y-auto max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
          <CheckCircle2 size={16} />
          ข้อมูลที่ AI สกัดได้ — ตรวจสอบและแก้ไขก่อนบันทึก
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={12} /> ล้างข้อมูล
          </button>
        )}
      </div>

      {/* ข้อมูลทั่วไป */}
      <section>
        <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest mb-2.5">ข้อมูลทั่วไป</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'ชื่อ-นามสกุล (พร้อมคำนำหน้า)', field: 'name', colSpan: true },
            { label: 'ตำแหน่งงาน', field: 'position', colSpan: true },
            { label: 'หน่วยงาน/ฝ่าย', field: 'department' },
            { label: 'อีเมล', field: 'email' },
            { label: 'เบอร์โทรศัพท์', field: 'phone' },
          ].map(({ label, field, colSpan }) => (
            <div key={field} className={colSpan ? 'sm:col-span-2' : ''}>
              <label className="text-[11px] font-medium text-slate-500">{label}</label>
              <input
                type="text"
                value={form[field] || ''}
                onChange={(e) => updateField(field, e.target.value)}
                className="mt-1 w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          ))}
        </div>
      </section>

      {/* การศึกษา */}
      <section>
        <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest mb-2.5">การศึกษา</h4>
        <div className="space-y-2">
          {(form.education || []).map((edu, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                placeholder="ปริญญา/ระดับการศึกษา"
                className="col-span-3 text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => updateEducation(i, 'institution', e.target.value)}
                placeholder="สถาบัน"
                className="col-span-2 text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={edu.year || ''}
                onChange={(e) => updateEducation(i, 'year', e.target.value)}
                placeholder="ปีที่จบ"
                className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ทักษะ */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest">ทักษะ</h4>
          <button
            onClick={addSkill}
            className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            <Plus size={12} /> เพิ่มทักษะ
          </button>
        </div>
        <div className="space-y-2">
          {(form.skills || []).map((skill, i) => (
            <SkillSlider
              key={i}
              skill={skill}
              onChange={(val) => updateSkill(i, val)}
              onRemove={() => removeSkill(i)}
            />
          ))}
          {(!form.skills || form.skills.length === 0) && (
            <p className="text-xs text-slate-400 italic">ยังไม่มีทักษะ — กด "เพิ่มทักษะ" เพื่อเพิ่ม</p>
          )}
        </div>
      </section>

      {/* Workload */}
      <section>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest">ภาระงานปัจจุบัน (%)</h4>
          <span className={`text-xs font-bold ${form.currentWorkload >= 80 ? 'text-red-600' : form.currentWorkload >= 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {form.currentWorkload || 0}%
          </span>
        </div>
        <input
          type="range"
          min={0} max={100} step={5}
          value={form.currentWorkload || 0}
          onChange={(e) => updateField('currentWorkload', Number(e.target.value))}
          className="w-full h-2 accent-indigo-600"
        />
      </section>

      {/* ผลงาน/โครงการ */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest">ผลงาน / โครงการ</h4>
          <button
            onClick={addProject}
            className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            <Plus size={12} /> เพิ่มโครงการ
          </button>
        </div>
        <div className="space-y-2">
          {(form.projects || []).map((proj, i) => (
            <ProjectRow
              key={i}
              proj={proj}
              onChange={(val) => updateProject(i, val)}
              onRemove={() => removeProject(i)}
            />
          ))}
          {(!form.projects || form.projects.length === 0) && (
            <p className="text-xs text-slate-400 italic">ยังไม่มีผลงาน — กด "เพิ่มโครงการ" เพื่อเพิ่ม</p>
          )}
        </div>
      </section>

      {/* Error */}
      {saveError && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {saveError}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1 border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={saved}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition shadow-sm
            ${saved
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 cursor-default'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        >
          <Save size={14} />
          {saved ? '✅ บันทึกแล้ว — ปรากฏในระบบแล้ว' : 'บันทึกเข้าฐานข้อมูล'}
        </button>
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Trash2 size={13} /> ล้าง
          </button>
        )}
      </div>
    </div>
  );
}
