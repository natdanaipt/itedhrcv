import React from 'react';

const COLORS = [
  { stroke: '#6366f1', fill: 'rgba(99,102,241,0.12)'  },
  { stroke: '#10b981', fill: 'rgba(16,185,129,0.12)'  },
  { stroke: '#f59e0b', fill: 'rgba(245,158,11,0.12)'  },
];

function getPersonLevel(person, skillName) {
  if (!person?.skills) return 0;
  const lName = skillName.toLowerCase();
  const lWords = lName.split(/[\s/&(),]+/).filter(w => w.length > 2);

  let best = null;
  let bestScore = 0;

  for (const s of person.skills) {
    const sL = s.name.toLowerCase();
    if (sL.includes(lName) || lName.includes(sL)) {
      if (s.level > bestScore) { best = s; bestScore = s.level; }
      continue;
    }
    const sWords = sL.split(/[\s/&(),]+/).filter(w => w.length > 2);
    const overlap = lWords.filter(w => sWords.some(sw => sw.includes(w) || w.includes(sw))).length;
    if (overlap >= Math.max(1, Math.min(2, lWords.length - 1)) && s.level > bestScore) {
      best = s; bestScore = s.level;
    }
  }
  return best?.level ?? 0;
}

// ─── Wrap text into lines ──────────────────────────────────────────────────────
function wrapLabel(text, maxLen = 12) {
  if (text.length <= maxLen) return [text];
  // Try to split at '/' ' ' '&' '-'
  const sep = text.match(/[/& -]/)?.index;
  if (sep && sep > 3 && sep < text.length - 2) {
    return [text.slice(0, sep + 1).trim(), text.slice(sep + 1).trim()];
  }
  return [text.slice(0, maxLen), text.slice(maxLen)];
}

// ─── Label position ────────────────────────────────────────────────────────────
// Adjust anchor and offset based on angle
function getLabelAnchor(angleDeg) {
  const a = ((angleDeg % 360) + 360) % 360;
  if (a > 350 || a < 10) return 'middle';
  if (a < 90 || a > 270) return 'start';
  if (a > 90 && a < 270) return 'end';
  return 'middle';
}

export default function RadarChartSVG({ requiredSkills, persons, size = 340 }) {
  if (!requiredSkills || requiredSkills.length === 0) return null;

  const skills = requiredSkills.slice(0, 8);
  const n = skills.length;
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 60;  // extra margin for labels
  const LEVELS = 5;

  const angle    = i => (i * 2 * Math.PI / n) - Math.PI / 2;
  const angleDeg = i => ((i * 360 / n) - 90 + 360) % 360;

  const point = (i, pct) => ({
    x: cx + r * (pct / 100) * Math.cos(angle(i)),
    y: cy + r * (pct / 100) * Math.sin(angle(i)),
  });

  const labelPoint = (i) => {
    const offset = r + 42;
    return {
      x: cx + offset * Math.cos(angle(i)),
      y: cy + offset * Math.sin(angle(i)),
    };
  };

  const toPath = pts => pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Required polygon: importance × 20 (max 100)
  const requiredPts = skills.map((s, i) => point(i, Math.min((s.importance || 1) * 20, 100)));

  return (
    <div className="space-y-3">
      <svg width={size} height={size} className="mx-auto block overflow-visible">
        {/* Grid */}
        {Array.from({ length: LEVELS }, (_, l) => {
          const pct = ((l + 1) / LEVELS) * 100;
          const pts = skills.map((_, i) => point(i, pct));
          return (
            <polygon key={l} points={toPath(pts)}
              fill={l % 2 === 0 ? 'rgba(241,245,249,0.9)' : 'none'}
              stroke="#e2e8f0" strokeWidth="1" />
          );
        })}

        {/* Axes */}
        {skills.map((_, i) => {
          const p = point(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)}
            stroke="#cbd5e1" strokeWidth="1" />;
        })}

        {/* Level labels */}
        {Array.from({ length: LEVELS }, (_, l) => {
          const pct = ((l + 1) / LEVELS) * 100;
          const p   = point(0, pct);
          return <text key={l} x={(p.x + 3).toFixed(1)} y={p.y.toFixed(1)}
            fontSize="8" fill="#94a3b8" dominantBaseline="middle">{pct.toFixed(0)}</text>;
        })}

        {/* Required polygon */}
        <polygon points={toPath(requiredPts)}
          fill="rgba(239,68,68,0.07)" stroke="#ef4444" strokeWidth="1.5"
          strokeDasharray="5 3" />

        {/* Person polygons */}
        {persons.map((person, pi) => {
          const col = COLORS[pi % COLORS.length];
          const pts = skills.map((s, i) => point(i, getPersonLevel(person, s.name)));
          return (
            <g key={pi}>
              <polygon points={toPath(pts)} fill={col.fill} stroke={col.stroke}
                strokeWidth="2" strokeLinejoin="round" />
              {skills.map((s, i) => {
                const p = point(i, getPersonLevel(person, s.name));
                return <circle key={`${pi}-${i}`} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill={col.stroke} />;
              })}
            </g>
          );
        })}

        {/* Skill labels */}
        {skills.map((s, i) => {
          const lp    = labelPoint(i);
          const aDeg  = angleDeg(i);
          const anchor = getLabelAnchor(aDeg);
          const lines  = wrapLabel(s.name, 13);
          const lineH  = 11;
          const startY = lp.y - ((lines.length - 1) * lineH) / 2;

          return (
            <text key={i} textAnchor={anchor} fontSize="9" fill="#475569" fontWeight="600">
              {lines.map((line, li) => (
                <tspan key={li} x={lp.x.toFixed(1)} y={(startY + li * lineH).toFixed(1)}>{line}</tspan>
              ))}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0 border-t-2 border-dashed border-red-400" />
          <span className="text-slate-500">ระดับที่งานต้องการ</span>
        </div>
        {persons.map((p, pi) => (
          <div key={pi} className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded" style={{ background: COLORS[pi % COLORS.length].stroke }} />
            <span className="text-slate-600 font-medium truncate max-w-[100px]">
              {p?.name?.split(' ').slice(-1)[0] ?? `คนที่ ${pi + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
