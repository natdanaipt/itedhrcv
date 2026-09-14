import React, { useState } from 'react';
import OrgTree from '../components/org-chart/OrgTree';
import { mockEmployees } from '../data/mockData';
import { X, Mail, Phone, Building, UserCheck, ShieldCheck } from 'lucide-react';

export default function OrgChartPage() {
  const [selectedNode, setSelectedNode] = useState(null);

  // กรองรายชื่อบุคลากรที่ตรงกับแผนกที่คลิก
  const getDepartmentPersonnel = () => {
    if (!selectedNode) return [];
    
    // ถ้าคลิกกล่อง ผอ. หรือ ผู้บริหาร
    if (selectedNode.role === 'ผู้อำนวยการ' || selectedNode.name?.includes('ผู้บริหาร')) {
      return mockEmployees.filter(emp => emp.department.includes('ผู้บริหาร'));
    }
    
    // ถ้าคลิกฝ่ายพัฒนาระบบสารสนเทศ
    if (selectedNode.name?.includes('พัฒนาระบบสารสนเทศ')) {
      return mockEmployees.filter(emp => emp.department.includes('พัฒนาระบบสารสนเทศ'));
    }

    // แผนกอื่นๆ (ที่ยังรอข้อมูลจริง) ให้สร้างรายการตัวอย่างตาม members
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
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center text-left">
        <div>
          <h3 className="text-sm font-bold text-slate-800">แผนผังบุคลากรแบบ Dynamic (สำนักพัฒนาเทคนิคศึกษา ITED)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            คลิกที่การ์ดฝ่ายหรือผู้บริหาร เพื่อดูรายชื่อและตำแหน่งของบุคลากรภายในหน่วยงาน
          </p>
        </div>
      </div>

      {/* ผังองค์กร */}
      <OrgTree onSelectNode={(info) => setSelectedNode(info)} />

      {/* --- Modal แสดงรายละเอียดบุคลากรเมื่อกดคลิก --- */}
      {selectedNode && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700">
                    โครงสร้างหน่วยงาน
                  </span>
                  {selectedNode.isRealData && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <ShieldCheck size={12} /> ข้อมูลจริงตามเอกสาร
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                  {selectedNode.name || selectedNode.role}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedNode.head ? `หัวหน้าหน่วยงาน: ${selectedNode.head}` : selectedNode.organization || 'สำนักพัฒนาเทคนิคศึกษา'}
                </p>
              </div>

              <button 
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body: รายชื่อบุคลากร */}
            <div className="p-6 overflow-y-auto space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                รายชื่อบุคลากรในสังกัด ({personnelList.length} ท่าน)
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {personnelList.map((emp) => (
                  <div 
                    key={emp.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 transition flex items-start justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-sm text-slate-900">{emp.name}</h5>
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">{emp.role}</p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
                          {emp.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={12} className="text-slate-400" /> {emp.email}
                            </span>
                          )}
                          {emp.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-slate-400" /> {emp.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex-shrink-0">
                      {emp.isPlaceholder ? 'รอข้อมูล' : 'พร้อมใช้งาน'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[11px]">ดึงข้อมูลจาก Centralized Database</span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition"
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