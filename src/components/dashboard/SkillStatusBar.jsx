import React from 'react';

export default function SkillStatusBar({ skill, level, colorClass = "bg-indigo-600" }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-slate-700">{skill}</span>
        <span className="font-bold text-slate-900">Lv. {level}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`} 
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
