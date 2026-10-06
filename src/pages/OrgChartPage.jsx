import React, { useState } from 'react';
import OrgTree from '../components/org-chart/OrgTree';
import { mockEmployees } from '../data/mockData';
import { X, Mail, Phone, ShieldCheck, Sparkles, UserCircle2, Database } from 'lucide-react';

export default function OrgChartPage() {
  const [selectedNode, setSelectedNode] = useState(null);

  const getDepartmentPersonnel = () => {
    if (!selectedNode) return [];
    
    if (selectedNode.role === 'ผู้อำนวยการ' || selectedNode.name?.includes('ผู้บริหาร')) {
      return mockEmployees.filter(emp => emp.department.includes('ผู้บริหาร'));
    }
    
    if (selectedNode.name?.includes('พัฒนาระบบสารสนเทศ')) {
      return mockEmployees.filter(emp => emp.department.includes('พัฒนาระบบสารสนเทศ'));
    }

    return (selectedNode.members || []).map((m, idx) => ({
      id: `temp-${idx}`,
      name: m,
      role: 'เจ้าหน้าที่ประจำกลุ่มงาน',
      department: selectedNode.name,
      email: 'waiting.data@ited.kmutnb.ac.th',
      phone: '0-2555-2000',
      isPlaceholder: true
    }));
  };

  const personnelList = getDepartmentPersonnel();

  return (
    <div className="space-y-6 relative">
      {/* Header Info - Glass Effect */}
      <div className="glass-panel p-5 rounded-2xl flex justify-between items-center text-left relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/10 transition-colors duration-700"></div>
        <div className="relative z-10">
          <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-800 flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" /> แผนผังบุคลากรแบบ Dynamic
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            คลิกที่การ์ดฝ่ายหรือผู้บริหาร เพื่อดูรายชื่อและตำแหน่งของบุคลากรภายในหน่วยงาน (สำนักพัฒนาเทคนิคศึกษา)
          </p>
        </div>
      </div>

      {/* ผังองค์กร */}
      <OrgTree onSelectNode={(info) => setSelectedNode(info)} />

      {/* --- Premium Glassmorphism Modal --- */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in-up">
          {/* พื้นหลังเบลอ (Backdrop Blur) */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedNode(null)}
          ></div>
          
          {/* ตัวกล่อง Modal */}
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white overflow-hidden transform scale-100 transition-all">
            
            {/* Modal Header */}
            <div className="p-6 sm:px-8 sm:pt-8 border-b border-white/50 bg-gradient-to-br from-white/60 to-white/30 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-100/80 text-indigo-700 border border-indigo-200/50 shadow-sm">
                    โครงสร้างหน่วยงาน
                  </span>
                  {selectedNode.isRealData && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm flex items-center gap-1.5">
                      <ShieldCheck size={12} /> ข้อมูลจริง
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {selectedNode.name || selectedNode.role}
                </h3>
                <p className="text-xs text-indigo-600 font-bold mt-1">
                  {selectedNode.head ? `หัวหน้าหน่วยงาน: ${selectedNode.head}` : selectedNode.organization || 'สำนักพัฒนาเทคนิคศึกษา'}
                </p>
              </div>

              <button 
                onClick={() => setSelectedNode(null)}
                className="w-10 h-10 rounded-full bg-white/50 hover:bg-slate-800 hover:text-white flex items-center justify-center text-slate-500 transition-all duration-300 shadow-sm border border-white hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: รายชื่อบุคลากร */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 custom-scrollbar">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <UserCircle2 size={16} /> รายชื่อบุคลากรในสังกัด 
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{personnelList.length}</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {personnelList.map((emp) => (
                  <div 
                    key={emp.id}
                    className="group p-4 rounded-2xl bg-white/60 border border-white shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 hover:bg-white/90 transition-all duration-300 flex items-start justify-between gap-4 relative overflow-hidden"
                  >
                    {/* Hover Effect Border */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-start gap-4 z-10">
                      {/* Avatar เรืองแสง */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-inner ring-2 ring-white">
                          {emp.name.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="text-left pt-0.5">
                        <h5 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">{emp.name}</h5>
                        <p className="text-[11px] text-indigo-600 font-bold mt-0.5">{emp.role}</p>
                        
                        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[11px] text-slate-500 font-medium">
                          {emp.email && (
                            <span className="flex items-center gap-1.5">
                              <Mail size={12} className="text-slate-400 group-hover:text-indigo-400 transition-colors" /> {emp.email}
                            </span>
                          )}
                          {emp.phone && (
                            <span className="flex items-center gap-1.5">
                              <Phone size={12} className="text-slate-400 group-hover:text-indigo-400 transition-colors" /> {emp.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex-shrink-0 z-10 ${
                      emp.isPlaceholder ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {emp.isPlaceholder ? 'รอข้อมูล' : 'พร้อมใช้งาน'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 sm:px-8 border-t border-white/50 bg-white/40 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Database size={14} className="text-indigo-400" /> ดึงข้อมูลสดจาก Centralized DB
              </span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 active:scale-95"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}