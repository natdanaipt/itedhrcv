import React from 'react';
import { Mail, Phone, Building2, Award, Briefcase, Download, Sparkles, MapPin, CheckCircle2, GraduationCap } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function CVPreview({ emp, template, selectedProjects = [] }) {

  // ฟังก์ชันดาวน์โหลด PDF คุณภาพสูง (คมชัด A4)
  const handleExportPDF = () => {
    const element = document.getElementById('cv-export-area');
    const opt = {
      margin: 0,
      filename: `CV_${emp.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Sparkles size={16} className="text-indigo-600 animate-pulse" />
          <span className="font-medium">พรีวิวเอกสาร CV สไตล์ Executive ขนาด A4 สัดส่วนมาตรฐาน</span>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition active:scale-95"
        >
          <Download size={15} /> ดาวน์โหลดเป็นไฟล์ PDF จริง
        </button>
      </div>

      {/* กระดาษเอกสาร A4 (กว้าง 210mm x สูง 297mm สัดส่วนมาตรฐานสากล) */}
      <div 
        id="cv-export-area" 
        className="bg-white rounded-xl shadow-2xl mx-auto overflow-hidden border border-slate-200/80 text-left text-slate-800"
        style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
      >
        {template === 'modern' && <ExecutiveModernTemplate emp={emp} selectedProjects={selectedProjects} />}
        {template === 'modern-top' && <ExecutiveModernTopTemplate emp={emp} selectedProjects={selectedProjects} />}
        {template === 'academic' && <AcademicFormalTemplate emp={emp} selectedProjects={selectedProjects} />}
        {template === 'minimal' && <CleanMinimalTemplate emp={emp} selectedProjects={selectedProjects} />}
      </div>
    </div>
  );
}

/* =========================================================================
   TEMPLATE 1: แบบโมเดิร์นหรู (Executive Modern Portfolio)
   ========================================================================= */
function ExecutiveModernTemplate({ emp, selectedProjects }) {
  return (
    <div className="grid grid-cols-12 min-h-[297mm]">
      {/* แถบซ้าย */}
      <aside className="col-span-4 bg-slate-900 text-slate-100 p-8 flex flex-col justify-between border-r border-slate-800 relative">
        <div className="space-y-6">
          <div className="relative mx-auto w-36 h-36">
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 p-1 shadow-xl">
              <div className="w-full h-full rounded-[14px] bg-slate-800 overflow-hidden flex items-center justify-center text-3xl font-bold text-indigo-300">
                {emp.name.charAt(0)}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900 shadow">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-center pt-2">
            <h3 className="font-bold text-base text-white tracking-tight leading-snug">{emp.name}</h3>
            <p className="text-xs text-indigo-400 font-medium mt-1">{emp.role}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{emp.department}</p>
          </div>
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-[10px] font-bold text-indigo-300 tracking-wider uppercase">ข้อมูลติดต่อ</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0"><Mail size={12} /></div>
                <span className="truncate text-[11px]">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0"><Phone size={12} /></div>
                <span className="text-[11px]">{emp.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0"><Building2 size={12} /></div>
                <span className="text-[11px]">สำนักพัฒนาเทคนิคศึกษา (ITED)</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-[10px] font-bold text-indigo-300 tracking-wider uppercase">ความเชี่ยวชาญ & สมรรถนะ</h4>
            <div className="space-y-3">
              {emp.skills.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-slate-300">{s.name}</span>
                    <span className="text-indigo-400 font-bold">{s.level}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full rounded-full" style={{ width: `${s.level}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-slate-800/80 text-center">
          <p className="text-[10px] text-slate-500 tracking-wide uppercase font-semibold">ITED • KMUTNB E-PORTFOLIO</p>
        </div>
      </aside>

      {/* แถบขวา */}
      <main className="col-span-8 p-10 flex flex-col justify-between bg-white">
        <div className="space-y-7">
          <div className="border-b border-slate-200 pb-5">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-widest border border-indigo-100">
              Curriculum Vitae • Executive Profile
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">ประวัติและผลงานวิชาการ</h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              บุคลากรสายวิชาการและสนับสนุน สังกัดสำนักพัฒนาเทคนิคศึกษา มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
            </p>
          </div>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5">
              <GraduationCap size={16} className="text-indigo-600" /> ประวัติการทำงานและตำแหน่งหน้าที่
            </h3>
            <div className="space-y-3 pl-3 text-xs">
              <div className="relative pl-4 border-l-2 border-indigo-100 space-y-1">
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
                <p className="font-bold text-slate-900">{emp.role}</p>
                <p className="text-indigo-600 text-[11px] font-medium">{emp.department} • ปัจจุบัน</p>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  กำกับดูแลและบริหารงานด้านการพัฒนาระบบเทคโนโลยีสารสนเทศ การจัดการฐานข้อมูล และโครงสร้างพื้นฐานระบบดิจิทัลประจำสำนัก
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-l-4 border-indigo-600 pl-2.5">
              <Briefcase size={16} className="text-indigo-600" /> ประสบการณ์โครงการและผลงานวิชาการ
            </h3>
            <div className="space-y-2.5 pl-3">
              {selectedProjects.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 border border-dashed rounded-lg bg-slate-50/50">- ยังไม่ได้เลือกผลงาน -</p>
              ) : (
                selectedProjects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-200/80 transition space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-xs text-slate-900 leading-snug">{proj}</h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-indigo-700 border border-slate-200 shadow-2xs flex-shrink-0">
                        โครงการหลัก
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      บทบาท: หัวหน้าโครงการ / ผู้รับผิดชอบหลักในการออกแบบสถาปัตยกรรมและขับเคลื่อนระบบสารสนเทศ
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">สำนักพัฒนาเทคนิคศึกษา (ITED)</p>
            <p className="text-[10px]">เอกสารสร้างจากระบบสารสนเทศกลางอัตโนมัติ</p>
          </div>
          <div className="text-center space-y-1">
            <div className="w-36 border-b border-slate-400 mx-auto"></div>
            <p className="font-bold text-slate-800 text-xs mt-1">({emp.name})</p>
            <p className="text-[10px] text-slate-500">{emp.role}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================================
   TEMPLATE 2: แบบทางการวิชาการ (Academic Formal Template)
   ========================================================================= */
function AcademicFormalTemplate({ emp, selectedProjects }) {
  return (
    <div className="p-12 space-y-7 text-xs font-sans min-h-[297mm] flex flex-col justify-between">
      <div className="space-y-6">
        <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start">
          <div className="space-y-1.5 max-w-lg">
            <span className="text-[11px] font-bold tracking-widest text-indigo-900 uppercase bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
              แบบประวัติผู้ทรงคุณวุฒิและผลงานวิจัย (CURRICULUM VITAE)
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight pt-2">{emp.name}</h1>
            <p className="text-sm font-bold text-indigo-700">{emp.role}</p>
            <p className="text-xs text-slate-600">{emp.department} • สำนักพัฒนาเทคนิคศึกษา (ITED)</p>
            <div className="flex gap-4 pt-2 text-[11px] text-slate-600">
              <span><strong>อีเมล:</strong> {emp.email}</span>
              <span><strong>โทรศัพท์:</strong> {emp.phone}</span>
            </div>
          </div>
          <div className="w-28 h-36 bg-slate-50 border-2 border-slate-300 rounded-lg flex flex-col items-center justify-center p-2 text-center text-slate-400 shadow-inner">
            <span className="text-xs font-bold text-slate-500">รูปถ่าย</span>
            <span className="text-[10px]">ขนาด 1-2 นิ้ว</span>
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
            1. ข้อมูลส่วนบุคคลและตำแหน่งงาน
          </h3>
          <div className="grid grid-cols-2 gap-3 pl-2 text-slate-700">
            <p><strong>ชื่อ-นามสกุล:</strong> {emp.name}</p>
            <p><strong>ตำแหน่ง:</strong> {emp.role}</p>
            <p><strong>หน่วยงาน:</strong> {emp.department}</p>
            <p><strong>สถาบัน:</strong> มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
            2. สาขาความเชี่ยวชาญและสมรรถนะวิชาชีพ (Competencies)
          </h3>
          <div className="grid grid-cols-2 gap-2 pl-2">
            {emp.skills.map((s, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                <span className="font-semibold text-slate-800">{s.name}</span>
                <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">ระดับ {s.level}%</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
            3. ประวัติการดำเนินโครงการและผลงานวิชาการ
          </h3>
          <ul className="space-y-2 pl-4 text-slate-700 list-disc">
            {selectedProjects.length === 0 ? (
              <li className="text-slate-400 italic list-none -ml-4">- ยังไม่ได้เลือกผลงาน -</li>
            ) : (
              selectedProjects.map((proj, idx) => (
                <li key={idx} className="leading-relaxed font-medium">{proj}</li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="pt-8 text-right text-xs text-slate-600 space-y-6">
        <p>ขอรับรองว่าประวัติและผลงานดังกล่าวข้างต้นเป็นความจริงทุกประการ</p>
        <div className="inline-block text-center space-y-1">
          <div className="w-48 border-b border-slate-400 mb-1"></div>
          <p className="font-bold text-slate-900">({emp.name})</p>
          <p className="text-[11px]">{emp.role}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TEMPLATE 3: แบบคลีนมินิมอล (Clean & Minimal Template)
   ========================================================================= */
function CleanMinimalTemplate({ emp, selectedProjects }) {
  return (
    <div className="p-12 space-y-8 text-xs font-sans min-h-[297mm]">
      <div className="text-center space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-light text-slate-900 tracking-tight">{emp.name}</h1>
        <p className="text-xs font-semibold text-indigo-600 tracking-widest uppercase">{emp.role}</p>
        <p className="text-slate-500 text-[11px]">{emp.department} • {emp.email} • {emp.phone}</p>
      </div>

      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Core Competencies</h3>
        <div className="flex flex-wrap gap-2">
          {emp.skills.map((s, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full border border-slate-300 font-medium text-slate-700 bg-white">
              {s.name} • {s.level}%
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Projects & Publications</h3>
        <div className="space-y-3">
          {selectedProjects.length === 0 ? (
            <p className="text-slate-400 italic">- ยังไม่ได้เลือกผลงาน -</p>
          ) : (
            selectedProjects.map((proj, i) => (
              <div key={i} className="border-l-2 border-slate-900 pl-4 py-1">
                <p className="font-bold text-slate-800 text-xs">{proj}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">สำนักพัฒนาเทคนิคศึกษา มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TEMPLATE 4: แบบโมเดิร์นแถบบน (Modern Top Banner / Teal-Emerald)
   ========================================================================= */
function ExecutiveModernTopTemplate({ emp, selectedProjects }) {
  return (
    <div className="min-h-[297mm] flex flex-col bg-white">
      <header className="h-[240px] bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-500 relative flex flex-col justify-center px-12 text-white shadow-md">
        <div className="absolute -bottom-14 left-12 w-36 h-36 rounded-full border-[6px] border-white bg-slate-800 flex items-center justify-center text-4xl font-bold text-emerald-300 shadow-xl z-10 overflow-hidden">
          {emp.name.charAt(0)}
        </div>
        <div className="pl-44 -mt-4">
          <h1 className="text-3xl font-black tracking-tight">{emp.name}</h1>
          <p className="text-emerald-100 font-semibold text-sm mt-1.5">{emp.role}</p>
          <p className="text-emerald-200 text-[11px] font-medium mt-0.5 opacity-90">{emp.department} • สำนักพัฒนาเทคนิคศึกษา</p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-10 px-12 pt-20 pb-12">
        <div className="col-span-4 space-y-8">
          <section className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b-2 border-emerald-500 pb-1.5 inline-block">ช่องทางการติดต่อ</h4>
            <div className="space-y-3 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Mail size={12} /></div><span>{emp.email}</span></div>
              <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Phone size={12} /></div><span>{emp.phone}</span></div>
              <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><Building2 size={12} /></div><span>มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</span></div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b-2 border-emerald-500 pb-1.5 inline-block">สมรรถนะวิชาชีพ</h4>
            <div className="space-y-3">
              {emp.skills.map((s, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-700"><span>{s.name}</span><span className="text-emerald-600">{s.level}%</span></div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${s.level}%` }}/></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-8 space-y-8">
          <section className="space-y-5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b-2 border-slate-200 pb-2 flex items-center gap-2">
              <Briefcase size={16} className="text-emerald-600" /> โครงการและผลงานเชิงประจักษ์
            </h4>
            
            <div className="space-y-4">
              {selectedProjects.length === 0 ? (
                <p className="text-slate-400 italic text-xs">- ยังไม่ได้เลือกผลงาน -</p>
              ) : (
                selectedProjects.map((proj, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-emerald-200 space-y-1">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-2 border-emerald-500"></span>
                    <h5 className="font-bold text-xs text-slate-900 leading-snug">{proj}</h5>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">หัวหน้าผู้รับผิดชอบโครงการ</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed pt-1">พัฒนาระบบและบูรณาการข้อมูลเทคโนโลยีสารสนเทศร่วมกับฐานข้อมูลกลาง เพื่อเพิ่มประสิทธิภาพการปฏิบัติงานของบุคลากรภายในสำนัก</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      
      <div className="text-center py-6 text-[10px] text-slate-400 border-t border-slate-100 bg-slate-50">
        Generated by Centralized HRMS Platform • ITED KMUTNB
      </div>
    </div>
  );
}