import React, { useState, useEffect } from 'react';
import CVForm from '../components/cv-generator/CVForm';
import CVPreview from '../components/cv-generator/CVPreview';
import { getAll } from '../data/personnelStore';

export default function CVGeneratorPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [template, setTemplate] = useState('academic');
  const [selectedProjects, setSelectedProjects] = useState([]);

  // โหลดบุคลากรจาก personnelStore ทุกครั้งที่หน้าแสดง
  useEffect(() => {
    const all = getAll();
    setEmployees(all);
    if (!selectedEmp && all.length > 0) {
      // เริ่มต้นที่คนที่ 5 (index 4) หรือคนแรกถ้าน้อยกว่านั้น
      const defaultEmp = all[Math.min(4, all.length - 1)];
      setSelectedEmp(defaultEmp);
    }
  }, []);

  // เมื่อเปลี่ยนบุคลากร ให้เลือกผลงานทั้งหมดของคนนั้น
  useEffect(() => {
    if (selectedEmp) {
      // รองรับทั้งโครงสร้างเก่า (projects เป็น string[]) และใหม่ (projects เป็น object[])
      const projects = (selectedEmp.projects || []).map(p =>
        typeof p === 'string' ? p : p.title
      );
      setSelectedProjects(projects);
    }
  }, [selectedEmp]);

  if (!selectedEmp) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        กำลังโหลดข้อมูลบุคลากร...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <CVForm
          employees={employees}
          selectedEmp={selectedEmp}
          setSelectedEmp={setSelectedEmp}
          template={template}
          setTemplate={setTemplate}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
        />
      </div>
      <div className="lg:col-span-2">
        <CVPreview
          emp={selectedEmp}
          template={template}
          selectedProjects={selectedProjects}
        />
      </div>
    </div>
  );
}