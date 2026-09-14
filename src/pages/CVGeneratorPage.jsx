import React, { useState } from 'react';
import CVForm from '../components/cv-generator/CVForm';
import CVPreview from '../components/cv-generator/CVPreview';
import { mockEmployees } from '../data/mockData';

export default function CVGeneratorPage() {
  const [selectedEmp, setSelectedEmp] = useState(mockEmployees[4]); // เริ่มต้นที่ อ.ภาคภูมิ
  const [template, setTemplate] = useState('academic'); // เริ่มต้นที่แบบยื่นเสนอโครงการ

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <CVForm 
          selectedEmp={selectedEmp}
          setSelectedEmp={setSelectedEmp}
          template={template}
          setTemplate={setTemplate}
        />
      </div>
      <div className="lg:col-span-2">
        <CVPreview emp={selectedEmp} template={template} />
      </div>
    </div>
  );
}