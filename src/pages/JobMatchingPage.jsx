import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Briefcase, AlertTriangle, RotateCcw, Info } from 'lucide-react';
import JobForm from '../components/job-matching/JobForm';
import CandidateCard from '../components/job-matching/CandidateCard';
import RadarChartSVG from '../components/job-matching/RadarChartSVG';
import SkeletonLoading from '../components/job-matching/SkeletonLoading';
import AssignmentHistory from '../components/job-matching/AssignmentHistory';
import { getAll, save as savePerson } from '../data/personnelStore';
import { getHistory, addAssignment, clearHistory } from '../data/assignmentStore';
import {
  runJobMatching,
  getAvailabilityStatus,
  calcWorkloadIncrease,
} from '../utils/jobMatchingEngine';

export default function JobMatchingPage() {
  const [status, setStatus] = useState('idle'); // idle | loading | done | empty
  const [matchResult, setMatchResult] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const [radarPersonIds, setRadarPersonIds] = useState([]);
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [history, setHistory] = useState(() => getHistory());

  const handleAnalyze = useCallback((form) => {
    setStatus('loading');
    setMatchResult(null);
    setAssignedIds(new Set());
    setRadarPersonIds([]);
    setJobInfo(form);

    // Simulate brief loading for UX
    setTimeout(() => {
      const personnel = getAll();
      const result = runJobMatching({
        jobTitle: form.title,
        jobDescription: form.description,
        duration: form.duration,
        urgency: form.urgency,
        personnel,
      });

      if (result.isEmpty) {
        setStatus('empty');
        setMatchResult(result);
      } else {
        setMatchResult(result);
        setStatus('done');
        setRadarPersonIds(result.top3.slice(0, 3).map(c => c.personId));
      }
    }, 800);
  }, []);

  const top3 = useMemo(() => matchResult?.top3 ?? [], [matchResult]);
  const overloaded = useMemo(() => matchResult?.overloadedPersons ?? [], [matchResult]);

  const radarPersons = useMemo(() =>
    radarPersonIds
      .map(id => matchResult?.allCandidates?.find(c => c.personId === id)?.person)
      .filter(Boolean),
    [radarPersonIds, matchResult]
  );

  const toggleRadar = (personId) => {
    setRadarPersonIds(prev => {
      if (prev.includes(personId)) return prev.filter(id => id !== personId);
      if (prev.length >= 3) return prev;
      return [...prev, personId];
    });
  };

  const handleAssign = useCallback((candidate) => {
    const person = candidate.person;
    const increase = calcWorkloadIncrease(jobInfo?.duration ?? 4);
    const newWorkload = Math.min(100, (person.currentWorkload ?? 50) + increase);

    savePerson({ ...person, currentWorkload: newWorkload });

    addAssignment({
      jobTitle: jobInfo?.title,
      personId: person.id,
      personName: person.name,
      personPosition: person.position || person.role,
      duration: jobInfo?.duration,
      urgency: jobInfo?.urgency,
      workloadAdded: increase,
      matchScore: candidate.matchScore,
      finalScore: candidate.finalScore,
    });

    setHistory(getHistory());
    setAssignedIds(prev => new Set([...prev, person.id]));

    // Refresh candidate workload in result
    setMatchResult(prev => {
      if (!prev) return prev;
      const updatedCandidates = prev.allCandidates.map(c => {
        if (c.personId !== person.id) return c;
        const updPerson = { ...c.person, currentWorkload: newWorkload };
        return { ...c, person: updPerson, availabilityStatus: getAvailabilityStatus(newWorkload) };
      });
      // Re-sort top3 by finalScore (workload changes might reorder)
      const newTop3 = updatedCandidates
        .filter(c => (c.person.currentWorkload ?? 0) <= 95)
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, 3);
      return { ...prev, allCandidates: updatedCandidates, top3: newTop3 };
    });
  }, [jobInfo]);

  const topHasHighWorkload = top3[0]?.person?.currentWorkload > 80;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-left flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Briefcase size={18} className="text-violet-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-800">ระบบมอบหมายงาน — Demo Mode (Client-side)</h3>
          <p className="text-xs text-slate-500 mt-0.5">วิเคราะห์จากคีย์เวิร์ดและทักษะจริงของบุคลากรในระบบ ไม่ใช้ AI API</p>
        </div>
        <span className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-300">
          🧪 Demo Mode
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-1">
          <JobForm onAnalyze={handleAnalyze} isLoading={status === 'loading'} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">

          {/* Idle */}
          {status === 'idle' && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center min-h-[280px] justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mb-4">
                <Briefcase size={28} className="text-violet-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">กรอกรายละเอียดงานหรือเลือกตัวอย่าง</p>
              <p className="text-xs text-slate-300 mt-1">แล้วกด "วิเคราะห์หาผู้เหมาะสม"</p>
            </div>
          )}

          {/* Loading */}
          {status === 'loading' && (
            <SkeletonLoading message="กำลังวิเคราะห์ทักษะและจัดอันดับผู้สมัคร..." />
          )}

          {/* No keywords matched */}
          {status === 'empty' && (
            <div className="bg-white rounded-xl border border-amber-200 p-8 text-center space-y-3">
              <Info size={32} className="text-amber-400 mx-auto" />
              <p className="text-sm font-bold text-amber-700">ไม่พบคีย์เวิร์ดที่ชัดเจน</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                กรุณาระบุรายละเอียดงานเพิ่มเติม เช่น ทักษะที่ต้องการ เทคโนโลยีที่ใช้ หรือประเภทงาน
                ตัวอย่าง: "พัฒนาระบบเว็บ", "วิเคราะห์ข้อมูล Dashboard", "จัดอบรม IoT"
              </p>
              <button onClick={() => setStatus('idle')}
                className="mx-auto flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 transition">
                <RotateCcw size={13} /> ลองใหม่
              </button>
            </div>
          )}

          {/* Results */}
          {status === 'done' && matchResult && (
            <>
              {/* High workload warning */}
              {topHasHighWorkload && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-amber-800">
                      ⚠️ ผู้สมัครอันดับ 1 มีภาระงานสูงเกิน 80% — ควรพิจารณาอันดับถัดไปเป็นทางเลือก
                    </p>
                    {top3[1] && <p className="text-amber-600 mt-0.5">ทางเลือก: {top3[1].person?.name} (คะแนน {top3[1].finalScore})</p>}
                  </div>
                </div>
              )}

              {/* Overloaded people */}
              {overloaded.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-red-700 mb-2">🚫 ไม่แนะนำเนื่องจากภาระงานเกิน 95%</p>
                  <div className="flex flex-wrap gap-2">
                    {overloaded.map(c => (
                      <span key={c.personId} className="text-[11px] bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full font-medium">
                        {c.person.name} — ทักษะ {c.matchScore}% / ภาระงาน {c.person.currentWorkload}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Required skills */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-[11px] font-bold uppercase text-indigo-600 tracking-widest mb-3">
                  ทักษะที่งานต้องการ ({matchResult.requiredSkills.length} ทักษะ)
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchResult.requiredSkills.map((s, i) => (
                    <span key={i}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border
                        ${s.importance >= 4 ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                          s.importance >= 3 ? 'bg-violet-50 text-violet-700 border-violet-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {s.name} {'★'.repeat(s.importance)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top 3 cards */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {top3.map((c, i) => (
                  <CandidateCard
                    key={c.personId}
                    rank={i + 1}
                    candidate={c}
                    person={c.person}
                    selectedForRadar={radarPersonIds.includes(c.personId)}
                    onToggleRadar={() => toggleRadar(c.personId)}
                    onAssign={() => handleAssign(c)}
                    assigned={assignedIds.has(c.person?.id)}
                  />
                ))}
              </div>

              {/* Radar Chart */}
              {radarPersons.length > 0 && matchResult.requiredSkills.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">เปรียบเทียบทักษะ Radar Chart</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">เส้นประแดง = ระดับที่งานต้องการ · ติ๊กเลือกสูงสุด 3 คน</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{radarPersons.length}/3 คน</span>
                  </div>
                  <RadarChartSVG
                    requiredSkills={matchResult.requiredSkills}
                    persons={radarPersons}
                    size={360}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Assignment History */}
      <div>
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">ประวัติการมอบหมายงาน</h4>
        <AssignmentHistory
          history={history}
          onClear={() => { clearHistory(); setHistory([]); }}
        />
      </div>
    </div>
  );
}
