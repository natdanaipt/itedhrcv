import React, { useState } from 'react';
import { Award, Briefcase, BookOpen, CheckSquare, ChevronDown, ChevronUp } from 'lucide-react';

const RANK_STYLE = [
  { bg: 'bg-amber-400', label: '🥇', shadow: 'shadow-amber-100' },
  { bg: 'bg-slate-300',  label: '🥈', shadow: 'shadow-slate-100' },
  { bg: 'bg-orange-300', label: '🥉', shadow: 'shadow-orange-100' },
];

const AVAIL_STYLE = {
  'ว่าง':              { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'ภาระงานปานกลาง':   { bar: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-700 border-amber-200'   },
  'งานล้น':           { bar: 'bg-red-500',     badge: 'bg-red-100 text-red-700 border-red-200'         },
};

function ScoreCircle({ score, size = 72 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="14" fontWeight="800" fill={color}>{score}</text>
      <text x={size/2} y={size/2 + 13} textAnchor="middle" dominantBaseline="middle"
        fontSize="8" fill="#94a3b8">คะแนน</text>
    </svg>
  );
}

export default function CandidateCard({
  rank, candidate, person,
  selectedForRadar, onToggleRadar, onAssign, assigned
}) {
  const [expanded, setExpanded] = useState(false);
  const rankStyle = RANK_STYLE[rank - 1] || RANK_STYLE[2];
  const statusLabel = candidate.availabilityStatus?.label || 'ว่าง';
  const availStyle = AVAIL_STYLE[statusLabel] || AVAIL_STYLE['ว่าง'];
  const workload = person?.currentWorkload ?? 50;

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all
      ${rank === 1 ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'}`}>

      {/* Header: rank + name + score */}
      <div className="p-4 flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl ${rankStyle.bg} flex items-center justify-center text-lg flex-shrink-0 shadow ${rankStyle.shadow}`}>
          {rankStyle.label}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-snug truncate">{person?.name ?? '–'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{person?.position ?? person?.role}</p>
          <p className="text-[10px] text-indigo-600 font-medium truncate">{person?.department}</p>
        </div>
        <ScoreCircle score={candidate.finalScore} />
      </div>

      {/* Workload bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-slate-500 font-medium">ภาระงานปัจจุบัน</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${availStyle.badge}`}>
            {statusLabel} · {workload}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${availStyle.bar}`}
            style={{ width: `${Math.min(workload, 100)}%` }} />
        </div>
        {candidate.workloadPenalty > 0 && (
          <p className="text-[10px] text-amber-600 mt-1">
            ⚠ ภาระงานลดคะแนน {candidate.workloadPenalty} จุด (AI: {candidate.matchScore} → Final: {candidate.finalScore})
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="px-4 pb-3 space-y-2">
        {candidate.matchedSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {candidate.matchedSkills.map((s, i) => (
              <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                ✓ {s}
              </span>
            ))}
          </div>
        )}
        {candidate.missingSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {candidate.missingSkills.map((s, i) => (
              <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                ✗ {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reason */}
      <div className="px-4 pb-3">
        <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
          {candidate.reason}
        </p>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 text-[11px] text-slate-400 hover:text-indigo-600 py-2 border-t border-slate-100 transition"
      >
        {expanded
          ? <><ChevronUp size={12} /> ซ่อนรายละเอียด</>
          : <><ChevronDown size={12} /> ดูรายละเอียดเพิ่มเติม</>}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-3 space-y-3 border-t border-slate-100 pt-3">
          {candidate.relevantProjects?.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Briefcase size={12} className="text-indigo-500" /> ผลงานที่เกี่ยวข้อง
              </p>
              <ul className="space-y-1">
                {candidate.relevantProjects.map((p, i) => (
                  <li key={i} className="text-[11px] text-slate-600 pl-3 border-l-2 border-indigo-200">{p}</li>
                ))}
              </ul>
            </div>
          )}
          {candidate.suggestedTraining && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-[11px] font-bold text-blue-700 flex items-center gap-1.5 mb-1">
                <BookOpen size={12} /> คำแนะนำพัฒนาทักษะ
              </p>
              <p className="text-[11px] text-blue-600">{candidate.suggestedTraining}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer: radar + assign */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer hover:text-indigo-600">
          <input
            type="checkbox"
            checked={selectedForRadar}
            onChange={onToggleRadar}
            className="rounded text-indigo-600 w-3.5 h-3.5"
          />
          เปรียบเทียบ Radar
        </label>

        {assigned ? (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckSquare size={13} /> มอบหมายแล้ว
          </span>
        ) : (
          <button
            onClick={onAssign}
            className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            <Award size={13} /> มอบหมายงาน
          </button>
        )}
      </div>
    </div>
  );
}
