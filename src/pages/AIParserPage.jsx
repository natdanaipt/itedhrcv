import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertTriangle, RefreshCw, Save, Trash2, X } from 'lucide-react';
import ExtractedPreview from '../components/ai-parser/ExtractedPreview';
import FileUploader from '../components/ai-parser/FileUploader';
import { getAll, save as savePerson } from '../data/personnelStore';

// ─── 4 ชุดข้อมูล Demo ──────────────────────────────────────────────────────────
const DEMO_DATASETS = [
  {
    name: 'นายสมชาย ใจดี',
    position: 'นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ',
    department: 'ฝ่ายพัฒนาระบบสารสนเทศ',
    email: 'somchai.j@demo.example.com',
    phone: '08x-xxx-xxxx',
    gender: 'male',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2565' }],
    skills: [
      { name: 'Web Development',   level: 82, category: 'Web & System' },
      { name: 'Database Design',   level: 78, category: 'Web & System' },
      { name: 'API Integration',   level: 70, category: 'Web & System' },
      { name: 'Network & Infrastructure', level: 65, category: 'Network & Infra' },
    ],
    projects: [
      { title: 'ระบบบริหารงานออนไลน์สำนักฝึกอบรม', role: 'Developer', year: '2566', description: 'พัฒนาด้วย Node.js + React' },
      { title: 'พัฒนา API Gateway เชื่อมระบบ ERP มหาวิทยาลัย', role: 'Backend Developer', year: '2567', description: '' },
    ],
    currentWorkload: 0,
  },
  {
    name: 'นางสาวสุดา แสนดี',
    position: 'นักวิชาการศึกษา ระดับปฏิบัติการ',
    department: 'ศูนย์ส่งเสริมเทคโนโลยีการศึกษา',
    email: 'suda.s@demo.example.com',
    phone: '08x-xxx-xxxx',
    gender: 'female',
    education: [{ degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยศิลปากร', year: '2563' }],
    skills: [
      { name: 'E-Learning / Instructional Design', level: 88, category: 'อื่นๆ' },
      { name: 'Training Facilitation', level: 85, category: 'อื่นๆ' },
      { name: 'Curriculum Development', level: 82, category: 'อื่นๆ' },
      { name: 'Moodle LMS', level: 79, category: 'อื่นๆ' },
      { name: 'Media Production', level: 65, category: 'อื่นๆ' },
    ],
    projects: [
      { title: 'พัฒนาหลักสูตร e-Learning สาขาอิเล็กทรอนิกส์อุตสาหกรรม', role: 'Instructional Designer', year: '2566', description: '6 รายวิชา' },
      { title: 'โครงการอบรมครูอาชีวศึกษาด้านการสอนออนไลน์', role: 'วิทยากร', year: '2567', description: '80 คน' },
    ],
    currentWorkload: 0,
  },
  {
    name: 'นายวิทยา ชำนาญ',
    position: 'ช่างเทคนิคอิเล็กทรอนิกส์ ระดับชำนาญงาน',
    department: 'ศูนย์รับรองสมรรถนะบุคคลตามมาตรฐานอาชีพ',
    email: 'wittaya.c@demo.example.com',
    phone: '08x-xxx-xxxx',
    gender: 'male',
    education: [{ degree: 'ปวส.', institution: 'วิทยาลัยเทคนิคนนทบุรี', year: '2557' }],
    skills: [
      { name: 'IoT & Embedded Systems', level: 90, category: 'อื่นๆ' },
      { name: 'Network & Infrastructure', level: 82, category: 'Network & Infra' },
      { name: 'Training Facilitation', level: 75, category: 'อื่นๆ' },
      { name: 'Web Development', level: 55, category: 'Web & System' },
    ],
    projects: [
      { title: 'ออกแบบและติดตั้งห้องปฏิบัติการ IoT อัจฉริยะ', role: 'Lead Engineer', year: '2566', description: '' },
      { title: 'อบรมเชิงปฏิบัติการ Embedded Systems ครูช่าง 40 คน', role: 'วิทยากร', year: '2567', description: '' },
    ],
    currentWorkload: 0,
  },
  {
    name: 'นางสาวพิมพ์ใจ มานะ',
    position: 'นักวิเคราะห์ข้อมูล ระดับปฏิบัติการ',
    department: 'สำนักงานผู้อำนวยการ',
    email: 'phimjai.m@demo.example.com',
    phone: '08x-xxx-xxxx',
    gender: 'female',
    education: [{ degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยมหิดล', year: '2564' }],
    skills: [
      { name: 'Data Analytics', level: 91, category: 'Data Analytics' },
      { name: 'Microsoft Excel Advanced', level: 88, category: 'Data Analytics' },
      { name: 'AI & Machine Learning', level: 76, category: 'AI & ML' },
      { name: 'Web Development', level: 58, category: 'Web & System' },
      { name: 'Project Management', level: 72, category: 'Management' },
    ],
    projects: [
      { title: 'Dashboard วิเคราะห์ผลการดำเนินงาน KPI สำนัก', role: 'Data Analyst', year: '2567', description: '' },
      { title: 'รายงานสถิติบุคลากรและสมรรถนะประจำปี', role: 'ผู้วิเคราะห์', year: '2566', description: '' },
    ],
    currentWorkload: 0,
  },
];

// ─── Hash filename → dataset index ────────────────────────────────────────────
function hashFileName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = Math.imul(31, h) + name.charCodeAt(i) | 0;
  }
  return Math.abs(h) % DEMO_DATASETS.length;
}

function makeDemoData(fileName) {
  const base = DEMO_DATASETS[hashFileName(fileName)];
  return {
    ...base,
    id: `scanned-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}

// ─── Status display ────────────────────────────────────────────────────────────
const STATUS_MSG = {
  reading:   { text: 'กำลังอ่านไฟล์...', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  analyzing: { text: 'กำลังประมวลผล (Demo Mode)...', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  done:      { text: '✅ วิเคราะห์สำเร็จ (ข้อมูลสาธิต)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  error:     { text: '❌ เกิดข้อผิดพลาด', color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function AIParserPage() {
  const [scanStatus, setScanStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleFileSelected = async (file) => {
    setSaved(false);
    setFileName(file.name);
    setExtractedData(null);
    setScanStatus('analyzing');
    setStatusMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาดในการวิเคราะห์');
      setExtractedData(data);
      setScanStatus('done');
    } catch (err) {
      console.error(err);
      setStatusMsg(err.message);
      setScanStatus('error');
    }
  };

  const handleSave = async (data) => {
    try {
      const res = await fetch('/api/cv/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'บันทึกไม่สำเร็จ');
      
      // Update local storage so other pages see the new person immediately
      const newPerson = {
        id: 'emp-' + resData.id,
        name: [data.personal?.title, data.personal?.first_name, data.personal?.last_name].filter(Boolean).join(' '),
        position: data.personal?.position,
        department: data.personal?.department,
        email: data.personal?.email,
        phone: data.personal?.phone,
        education: data.education || [],
        skills: (data.skills || []).map(s => ({ name: s.name, level: s.proficiency || 0, category: s.category })),
        projects: data.projects || [],
        currentWorkload: 0,
      };
      savePerson(newPerson);
      
      setSaved(true);
      setTimeout(() => {
        handleClear();
      }, 2000);
    } catch (err) {
      alert('Error: ' + err.message);
      throw err;
    }
  };

  const handleClear = () => {
    setExtractedData(null);
    setScanStatus('idle');
    setFileName('');
    setSaved(false);
    setStatusMsg('');
  };

  const handleGenerateMock = () => {
    setFileName('mock_cv_test.pdf');
    setScanStatus('done');
    setStatusMsg('');
    setExtractedData({
      personal: {
        title: 'ดร.',
        first_name: 'สมหญิง',
        last_name: 'รักเรียน',
        position: 'นักวิจัยอาวุโส',
        department: 'ฝ่ายบริการวิชาการและพัฒนานวัตกรรม',
        organization: 'มหาวิทยาลัยทดสอบ',
        email: 'somying.r@example.com',
        phone: '089-999-9999'
      },
      education: [{ degree: 'ปริญญาเอก', major: 'วิศวกรรมซอฟต์แวร์', institution: 'มหาวิทยาลัยเทคโนโลยีมหานคร', year: '2560' }],
      experience: [
        { position: 'หัวหน้าทีมวิจัย', organization: 'สถาบันวิจัย AI', start: '2561', end: 'ปัจจุบัน', description: 'วิจัยด้าน Generative AI' }
      ],
      skills: [
        { name: 'Machine Learning', proficiency: 95, category: 'AI & ML' },
        { name: 'Python', proficiency: 90, category: 'Web & System' },
        { name: 'Project Management', proficiency: 85, category: 'Management' }
      ],
      projects: [
        { name: 'ระบบแนะนำหลักสูตรอัจฉริยะ', role: 'Project Manager', year: '2566', description: 'ใช้ AI สร้างแผนการเรียน', technologies: ['Python', 'React'] }
      ],
      certifications: [
        { name: 'AWS Certified Machine Learning – Specialty', issuer: 'AWS', year: '2565' }
      ],
      languages: [
        { language: 'English', level: 'Fluent' }
      ],
      summary: 'ผู้เชี่ยวชาญด้าน AI มีประสบการณ์กว่า 5 ปีในการพัฒนาระบบอัจฉริยะ',
      uncertain_fields: [],
      confidence: 0.95
    });
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-5 text-white text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold bg-emerald-400 text-emerald-900 px-2 py-0.5 rounded-full">⚡ Live</span>
            <span className="text-xs text-indigo-200">ประมวลผลด้วย AI จริง</span>
          </div>
          <h3 className="text-base font-bold">AI สแกน CV / ข้อมูลบุคลากร</h3>
          <p className="text-xs text-indigo-200 mt-1">
            อัปโหลดไฟล์ PDF, PNG, JPG เพื่อสกัดข้อมูลอัตโนมัติด้วย AI แล้วบันทึกลงฐานข้อมูล
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload area */}
        <div className="space-y-4">
          <FileUploader
            onScan={handleFileSelected}
            status={scanStatus}
          />

          {/* Status indicator */}
          {scanStatus !== 'idle' && STATUS_MSG[scanStatus] && (
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold ${STATUS_MSG[scanStatus].color}`}>
              {(scanStatus === 'reading' || scanStatus === 'analyzing') && (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
              <span>{scanStatus === 'error' && statusMsg ? statusMsg : STATUS_MSG[scanStatus].text}</span>
              {fileName && scanStatus !== 'error' && <span className="text-slate-400 font-normal">({fileName})</span>}
            </div>
          )}

          {/* Saved confirmation */}
          {saved && (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
              <CheckCircle2 size={14} /> บันทึกเข้าระบบสำเร็จ — ปรากฏในทุกหน้าแล้ว
            </div>
          )}

          {/* Mock Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleGenerateMock}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              🚀 จำลองข้อมูล CV (Bypass AI)
            </button>
          </div>

          {/* Tip */}
          <div className="text-[11px] text-slate-400 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
            💡 ลอง: อัปโหลดไฟล์ชื่อ "resume_a.pdf" แล้ว "resume_b.pdf" จะได้ข้อมูลต่างกัน
          </div>
        </div>

        {/* Preview */}
        <div>
          {extractedData ? (
            <ExtractedPreview
              data={extractedData}
              onSave={handleSave}
              onClear={handleClear}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Upload size={22} className="text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">ผลการวิเคราะห์จะแสดงที่นี่</p>
              <p className="text-xs text-slate-300 mt-1">หลังจากอัปโหลดไฟล์</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
