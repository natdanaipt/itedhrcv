import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import SkillStatusBar from '../components/dashboard/SkillStatusBar';
import CompetencyBarChart from '../components/dashboard/CompetencyBarChart';
import { mockStats, mockEmployees } from '../data/mockData';
import { Users, FolderGit2, Building2, UserCheck } from 'lucide-react';

export default function DashboardPage() {
  const emp = mockEmployees[0];

  return (
    <div className="space-y-6">
      {/* 4 การ์ดสถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="บุคลากรทั้งหมด" value={`${mockStats.totalPersonnel} คน`} subtitle="สังกัดในสำนัก" icon={Users} color="indigo" />
        <StatCard title="หน่วยงานย่อย" value={`${mockStats.totalDepartments} ฝ่าย`} subtitle="ศูนย์และกลุ่มงาน" icon={Building2} color="blue" />
        <StatCard title="สัดส่วน ชาย : หญิง" value={mockStats.genderRatio} subtitle="ความสมดุลกำลังคน" icon={UserCheck} color="emerald" />
        <StatCard title="โครงการวิจัย/ผลงาน" value={`${mockStats.totalProjects} โครงการ`} subtitle="รวบรวมในระบบ" icon={FolderGit2} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status ทักษะรายคน (สไตล์ค่าสเตตัสตัวละครในเกม) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-left">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">สเตตัสความเชี่ยวชาญรายบุคคล</h4>
              <p className="text-xs text-slate-500 mt-0.5">ตัวอย่างสเตตัสของ: {emp.name}</p>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Rank: Senior
            </span>
          </div>

          <div className="space-y-4">
            {emp.skills.map((s, idx) => (
              <SkillStatusBar key={idx} skill={s.name} level={s.level} />
            ))}
          </div>
        </div>

        {/* กราฟภาพรวมสำนัก */}
        <CompetencyBarChart />
      </div>
    </div>
  );
}
