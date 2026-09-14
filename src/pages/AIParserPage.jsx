import React, { useState } from 'react';
import FileUploader from '../components/ai-parser/FileUploader';
import ExtractedPreview from '../components/ai-parser/ExtractedPreview';

export default function AIParserPage() {
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleSimulate = () => {
    setIsParsing(true);
    setTimeout(() => {
      setParsedData({
        name: "นายภาคภูมิ สันติวงษ์",
        role: "หัวหน้าฝ่ายพัฒนาระบบ",
        projects: [
          "โครงการพัฒนาระบบ ERP กลางสำหรับมหาวิทยาลัย (พ.ศ. 2568)",
          "การพัฒนาระบบคลาวด์สารสนเทศสำนัก (พ.ศ. 2567)"
        ]
      });
      setIsParsing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-left">
        <h3 className="text-sm font-bold text-slate-800">ระบบ AI สแกนเอกสาร CV เก่า</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          ลดภาระการพิมพ์ประวัติและผลงานเดิมเข้าสู่ระบบใหม่ โดยใช้โมเดลตรวจจับข้อความและแยกแยะหมวดหมู่
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileUploader onSimulateParse={handleSimulate} isParsing={isParsing} />
        <ExtractedPreview data={parsedData} />
      </div>
    </div>
  );
}
