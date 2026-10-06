import React, { useState, useMemo } from 'react';
import OrgTree from '../components/org-chart/OrgTree';
import { getAll } from '../data/personnelStore';
import { X, Mail, Phone, ShieldCheck, Sparkles, UserCircle2, Database, Users } from 'lucide-react';

export default function OrgChartPage() {
  const [selectedNode, setSelectedNode] = useState(null);

  // โหลดบุคลากรจาก store จริง
  const allPersonnel = useMemo(() => getAll(), []);

  // คำนวณจำนวนคนต่อฝ่ายจาก store
  const deptCounts = useMemo(() => {
    const map = {};
    allPersonnel.forEach(p => {
      const dept = p.department || 'ไม่ระบุ';
      map[dept] = (map[dept] || 0) + 1;
    });
    return map;
  }, [allPersonnel]);

  // หาบุคลากรของฝ่ายที่เลือก
  const getDepartmentPersonnel = () => {
    if (!selectedNode) return [];

    // Director node
    if (selectedNode.role === 'ผู้อำนวยการ' || selectedNode.id === 'director-node') {
      return allPersonnel.filter(e =>
        e.department?.includes('ผู้บริหาร')
      );
    }

    // Executive node (no dept, just name/role)
    if (selectedNode.role && !selectedNode.id) {
      return allPersonnel.filter(e => e.name === selectedNode.name);
    }

    // Department card
    if (selectedNode.name) {
      const found = allPersonnel.filter(e => e.department === selectedNode.name);
      if (found.length > 0) return found;
    }

    // Fallback: placeholder
    return (selectedNode.members || []).map((m, idx) => ({
      id: `temp-${idx}`,
      name: typeof m === 'string' ? m : m.name || 'ไม่ระบุ',
      position: 'เจ้าหน้าที่ประจำหน่วยงาน',
      department: selectedNode.name,
      email: '-',
      phone: '-',
      isPlaceholder: true,
    }));
  };

  const personnelList = getDepartmentPersonnel();

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl flex justify-between items-center text-left relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-800 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" /> แผนผังบุคลากรแบบ Dynamic
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            คลิกที่การ์ดฝ่ายเพื่อดูบุคลากร — จำนวนคำนวณจากฐานข้อมูลจริง (บุคลากร {allPersonnel.length} คน)
          </p>
        </div>
      </div>

      {/* Org Tree — ส่ง countOverrides เพื่อให้การ์ดแสดงจำนวนจริง */}
      <OrgTree
        onSelectNode={(info) => setSelectedNode(info)}
        countOverrides={deptCounts}
      />

      {/* Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in-up">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedNode(null)} />

          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 sm:px-8 sm:pt-8 border-b border-white/50 bg-gradient-to-br from-white/60 to-white/30 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-100/80 text-indigo-700 border border-indigo-200/50">
                    โครงสร้างหน่วยงาน
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    <Users size={10} /> {personnelList.length} คน
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{selectedNode.name || selectedNode.role}</h3>
                <p className="text-xs text-indigo-600 font-bold mt-1">
                  {selectedNode.head ? `หัวหน้า: ${selectedNode.head}` : selectedNode.organization || 'สำนักพัฒนาเทคนิคศึกษา'}
                </p>
              </div>
              <button onClick={() => setSelectedNode(null)}
                className="w-10 h-10 rounded-full bg-white/50 hover:bg-slate-800 hover:text-white flex items-center justify-center text-slate-500 transition-all shadow-sm border border-white hover:rotate-90">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-3 custom-scrollbar">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <UserCircle2 size={16} /> รายชื่อบุคลากรในสังกัด
              </div>

              {personnelList.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">ยังไม่มีข้อมูลบุคลากรในหน่วยงานนี้</p>
              )}

              <div className="grid grid-cols-1 gap-3">
                {personnelList.map((emp) => {
                  const workload = emp.currentWorkload;
                  const isPlaceholder = emp.isPlaceholder;
                  return (
                    <div key={emp.id}
                      className="group p-4 rounded-2xl bg-white/60 border border-white shadow-sm hover:shadow-lg hover:bg-white/90 transition-all flex items-start justify-between gap-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-start gap-4 z-10 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-full blur opacity-30 group-hover:opacity-70 transition" />
                          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-inner ring-2 ring-white">
                            {(emp.name || '?').charAt(0)}
                          </div>
                        </div>
                        <div className="text-left min-w-0">
                          <h5 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors truncate">{emp.name}</h5>
                          <p className="text-[11px] text-indigo-600 font-bold mt-0.5 truncate">{emp.position || emp.role || ''}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[10px] text-slate-400">
                            {emp.email && emp.email !== '-' && (
                              <span className="flex items-center gap-1"><Mail size={10} /> {emp.email}</span>
                            )}
                            {emp.phone && emp.phone !== '-' && (
                              <span className="flex items-center gap-1"><Phone size={10} /> {emp.phone}</span>
                            )}
                          </div>
                          {/* Workload mini bar */}
                          {workload !== undefined && !isPlaceholder && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${workload > 80 ? 'bg-red-400' : workload >= 60 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                  style={{ width: `${Math.min(workload, 100)}%` }} />
                              </div>
                              <span className={`text-[9px] font-bold ${workload > 80 ? 'text-red-500' : workload >= 60 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                {workload}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg flex-shrink-0 z-10 ${
                        isPlaceholder ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {isPlaceholder ? 'รอข้อมูล' : 'พร้อม'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 sm:px-8 border-t border-white/50 bg-white/40 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Database size={13} className="text-indigo-400" /> ดึงข้อมูลจาก Centralized DB
              </span>
              <button onClick={() => setSelectedNode(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-md transition-all active:scale-95">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}