import React, { useState, useMemo } from 'react';
import { Users, Building2, UserCheck, FolderGit2, TrendingDown, AlertOctagon, ChevronDown } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import SkillStatusBar from '../components/dashboard/SkillStatusBar';
import { mockOrgStructure } from '../data/mockData';
import { getAll } from '../data/personnelStore';

// ─── Skill categories ─────────────────────────────────────────────────────────
const CATEGORIES = ['Web & System', 'AI & ML', 'Network & Infra', 'Data Analytics', 'Management', 'อื่นๆ'];
const CAT_COLORS = {
  'Web & System':    { bar: 'bg-indigo-500', dot: '#6366f1', stroke: '#6366f1', fill: 'rgba(99,102,241,0.12)'  },
  'AI & ML':         { bar: 'bg-purple-500', dot: '#a855f7', stroke: '#a855f7', fill: 'rgba(168,85,247,0.12)'  },
  'Network & Infra': { bar: 'bg-sky-500',    dot: '#0ea5e9', stroke: '#0ea5e9', fill: 'rgba(14,165,233,0.12)'  },
  'Data Analytics':  { bar: 'bg-emerald-500',dot: '#10b981', stroke: '#10b981', fill: 'rgba(16,185,129,0.12)'  },
  'Management':      { bar: 'bg-amber-500',  dot: '#f59e0b', stroke: '#f59e0b', fill: 'rgba(245,158,11,0.12)'  },
  'อื่นๆ':           { bar: 'bg-rose-400',   dot: '#fb7185', stroke: '#fb7185', fill: 'rgba(251,113,133,0.12)'  },
};

// ─── Radar Chart (Dashboard version — categories as axes) ─────────────────────
function CategoryRadar({ persons, size = 300 }) {
  if (!persons.length) return null;
  const n = CATEGORIES.length;
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 50;
  const LEVELS = 5;
  const angle = i => (i * 2 * Math.PI / n) - Math.PI / 2;

  const pt = (i, pct) => ({
    x: cx + r * (pct / 100) * Math.cos(angle(i)),
    y: cy + r * (pct / 100) * Math.sin(angle(i)),
  });
  const lp = i => ({ x: cx + (r + 38) * Math.cos(angle(i)), y: cy + (r + 38) * Math.sin(angle(i)) });
  const toPath = pts => pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const getPersonCatLevel = (person, cat) => {
    const catSkills = (person.skills || []).filter(s => s.category === cat);
    if (!catSkills.length) return 0;
    return Math.round(catSkills.reduce((s, sk) => s + sk.level, 0) / catSkills.length);
  };

  const PERSON_COLORS = ['#6366f1','#10b981','#f59e0b'];

  return (
    <div className="space-y-3">
      <svg width={size} height={size} className="mx-auto block">
        {Array.from({ length: LEVELS }, (_, l) => {
          const pct = ((l + 1) / LEVELS) * 100;
          const gpts = CATEGORIES.map((_, i) => pt(i, pct));
          return <polygon key={l} points={toPath(gpts)}
            fill={l % 2 === 0 ? 'rgba(241,245,249,0.9)' : 'none'} stroke="#e2e8f0" strokeWidth="1" />;
        })}
        {CATEGORIES.map((_, i) => {
          const p = pt(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#cbd5e1" strokeWidth="1" />;
        })}
        {persons.map((person, pi) => {
          const col = PERSON_COLORS[pi % PERSON_COLORS.length];
          const pts = CATEGORIES.map((cat, i) => pt(i, getPersonCatLevel(person, cat)));
          return (
            <g key={pi}>
              <polygon points={toPath(pts)} fill={`${col}20`} stroke={col} strokeWidth="2" strokeLinejoin="round" />
              {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={col} />)}
            </g>
          );
        })}
        {CATEGORIES.map((cat, i) => {
          const { x, y } = lp(i);
          const short = cat.length > 10 ? cat.replace(' & ', '\n& ').split('\n') : [cat];
          return (
            <text key={i} textAnchor="middle" fontSize="9" fill="#475569" fontWeight="600">
              {short.map((line, li) => (
                <tspan key={li} x={x.toFixed(1)} y={(y + li * 11 - (short.length - 1) * 5.5).toFixed(1)}>{line}</tspan>
              ))}
            </text>
          );
        })}
      </svg>
      <div className="flex flex-wrap justify-center gap-3 text-[11px]">
        {persons.map((p, pi) => (
          <div key={pi} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: PERSON_COLORS[pi % PERSON_COLORS.length] }} />
            <span className="text-slate-600 font-medium truncate max-w-[120px]">{p.name.split(' ').slice(-1)[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Category Bar Chart (computed from real data) ─────────────────────────────
function CategoryBarChart({ employees }) {
  const catAvgs = useMemo(() => {
    return CATEGORIES.map(cat => {
      const levels = employees.flatMap(e =>
        (e.skills || []).filter(s => s.category === cat).map(s => s.level)
      );
      const avg = levels.length ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) : 0;
      return { cat, avg };
    });
  }, [employees]);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-left">
      <h4 className="text-sm font-bold text-slate-900 mb-1">ภาพรวมความเชี่ยวชาญระดับสำนัก</h4>
      <p className="text-xs text-slate-400 mb-5">คำนวณค่าเฉลี่ยจากบุคลากร {employees.length} คน</p>
      <div className="h-44 flex items-end justify-around border-b border-slate-100 pb-2 gap-2">
        {catAvgs.map(({ cat, avg }) => {
          const col = CAT_COLORS[cat]?.bar || 'bg-slate-400';
          return (
            <div key={cat} className="flex flex-col items-center gap-1 flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-600">{avg}%</span>
              <div className={`w-full max-w-[40px] rounded-t-md ${col} transition-all duration-500`}
                style={{ height: `${avg * 1.4}px` }} />
              <span className="text-[9px] font-medium text-slate-500 text-center leading-tight"
                style={{ maxWidth: 52, whiteSpace: 'normal' }}>{cat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const employees = useMemo(() => getAll(), []);
  const [selectedIds, setSelectedIds] = useState([employees[0]?.id].filter(Boolean));
  const [compareMode, setCompareMode] = useState(false);

  // Stats
  const totalPersonnel = employees.length;
  const totalProjects  = employees.reduce((s, e) => s + (e.projects?.length || 0), 0);
  const totalDepts     = mockOrgStructure.departments.length;
  const avgWorkload    = Math.round(employees.reduce((s, e) => s + (e.currentWorkload || 0), 0) / Math.max(employees.length, 1));

  const males   = employees.filter(e => e.gender === 'male').length;
  const females = employees.filter(e => e.gender === 'female').length;

  // Selected persons
  const selectedPersons = useMemo(() =>
    selectedIds.map(id => employees.find(e => e.id === id)).filter(Boolean),
    [selectedIds, employees]
  );
  const primaryPerson = selectedPersons[0] || null;

  // Category averages for skill gap
  const catAvgs = useMemo(() => {
    return CATEGORIES.map(cat => {
      const levels = employees.flatMap(e =>
        (e.skills || []).filter(s => s.category === cat).map(s => s.level)
      );
      return {
        cat,
        avg: levels.length ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) : 0,
        count: levels.length,
      };
    });
  }, [employees]);

  const skillGaps = useMemo(() =>
    [...catAvgs].sort((a, b) => a.avg - b.avg).slice(0, 3),
    [catAvgs]
  );

  const highWorkload = useMemo(() =>
    employees.filter(e => (e.currentWorkload ?? 0) > 80).sort((a, b) => b.currentWorkload - a.currentWorkload),
    [employees]
  );

  const toggleSelect = (id) => {
    if (!compareMode) {
      setSelectedIds([id]);
    } else {
      setSelectedIds(prev => {
        if (prev.includes(id)) return prev.filter(x => x !== id);
        if (prev.length >= 3) return prev;
        return [...prev, id];
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="บุคลากรทั้งหมด" value={`${totalPersonnel} คน`}
          subtitle={`ชาย ${males} · หญิง ${females}`} icon={Users} color="indigo" />
        <StatCard title="หน่วยงานย่อย" value={`${totalDepts} ฝ่าย`}
          subtitle="ศูนย์และกลุ่มงาน" icon={Building2} color="blue" />
        <StatCard title="ภาระงานเฉลี่ย" value={`${avgWorkload}%`}
          subtitle="Workload ทั้งหมด" icon={UserCheck} color="emerald" />
        <StatCard title="โครงการ/ผลงาน" value={`${totalProjects} รายการ`}
          subtitle="รวมในระบบ" icon={FolderGit2} color="amber" />
      </div>

      {/* Person selector + skill bars + radar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900">สมรรถนะรายบุคคล</h4>
            <p className="text-xs text-slate-400 mt-0.5">เลือกบุคลากรเพื่อดูทักษะ หรือเปิดโหมดเปรียบเทียบ</p>
          </div>
          {/* Compare toggle */}
          <button
            onClick={() => { setCompareMode(!compareMode); setSelectedIds([employees[0]?.id].filter(Boolean)); }}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
              compareMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}>
            {compareMode ? '🔀 โหมดเปรียบเทียบ (ON)' : 'เปรียบเทียบ'}
          </button>
          {/* Dropdown */}
          <div className="relative">
            <select
              value={compareMode ? '' : selectedIds[0] || ''}
              onChange={e => !compareMode && toggleSelect(e.target.value)}
              disabled={compareMode}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 pr-8 bg-white text-slate-700 focus:outline-none focus:border-indigo-400 disabled:opacity-50 appearance-none cursor-pointer"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Compare mode: person buttons */}
        {compareMode && (
          <div className="flex flex-wrap gap-2">
            {employees.map(e => {
              const selected = selectedIds.includes(e.id);
              return (
                <button key={e.id} onClick={() => toggleSelect(e.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition font-medium ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}>
                  {e.name.split(' ').slice(-1)[0]}
                  {selected && ` (#${selectedIds.indexOf(e.id) + 1})`}
                </button>
              );
            })}
            <span className="text-[10px] text-slate-400 self-center">(เลือกได้สูงสุด 3 คน)</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill bars */}
          <div className="space-y-3">
            {primaryPerson && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                    {primaryPerson.name.charAt(primaryPerson.name.lastIndexOf(' ') + 1)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{primaryPerson.name}</p>
                    <p className="text-[10px] text-slate-400">{primaryPerson.position}</p>
                  </div>
                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    (primaryPerson.currentWorkload || 0) > 80
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : (primaryPerson.currentWorkload || 0) >= 60
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>ภาระงาน {primaryPerson.currentWorkload}%</span>
                </div>
                {(primaryPerson.skills || []).slice(0, 7).map((s, i) => (
                  <SkillStatusBar key={i} skill={s.name} level={s.level} />
                ))}
              </>
            )}
          </div>

          {/* Radar chart */}
          <div>
            {selectedPersons.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Radar Chart {compareMode ? `(${selectedPersons.length} คน)` : ''}
                </p>
                <CategoryRadar persons={selectedPersons} size={280} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-300 text-xs">
                เลือกบุคลากรเพื่อดู Radar Chart
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: category chart + skill gap + high workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category bar chart */}
        <div className="lg:col-span-1">
          <CategoryBarChart employees={employees} />
        </div>

        {/* Skill gap */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-red-400" /> ช่องว่างทักษะของสำนัก
          </h4>
          <p className="text-xs text-slate-400 mb-4">หมวดที่มีค่าเฉลี่ยต่ำที่สุด — ควรจัดฝึกอบรมเพิ่ม</p>
          <div className="space-y-4">
            {skillGaps.map(({ cat, avg, count }) => {
              const col = CAT_COLORS[cat];
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{cat}</span>
                    <span className="font-bold text-slate-500">{avg}% <span className="font-normal text-slate-300">({count} ทักษะ)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${col.bar}`} style={{ width: `${avg}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    💡 ควรพัฒนาด้าน {cat} เพื่อเสริมศักยภาพสำนัก
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* High workload */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-left">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
            <AlertOctagon size={16} className="text-red-500" /> บุคลากรภาระงานสูง
          </h4>
          <p className="text-xs text-slate-400 mb-4">เกิน 80% — ความเสี่ยงในการรับงานเพิ่ม</p>
          {highWorkload.length === 0 ? (
            <p className="text-xs text-slate-300 text-center py-6">ไม่มีบุคลากรที่ภาระงานสูงเกิน 80%</p>
          ) : (
            <div className="space-y-3">
              {highWorkload.slice(0, 5).map(e => {
                const pct = e.currentWorkload || 0;
                const isOver95 = pct > 95;
                return (
                  <div key={e.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 truncate max-w-[130px]">
                        {e.name.split(' ').slice(-2).join(' ')}
                      </span>
                      <span className={`font-bold ${isOver95 ? 'text-red-600' : 'text-amber-600'}`}>
                        {pct}% {isOver95 ? '🚫' : '⚠️'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isOver95 ? 'bg-red-500' : 'bg-amber-400'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{e.position}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
