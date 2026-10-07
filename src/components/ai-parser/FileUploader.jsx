import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, Image, X, ShieldAlert, Info } from 'lucide-react';

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = {
  'application/pdf': { label: 'PDF', ext: '.pdf' },
  'image/jpeg': { label: 'JPG', ext: '.jpg/.jpeg' },
  'image/png': { label: 'PNG', ext: '.png' },
};

export default function FileUploader({ onScan, status }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const validateFile = (f) => {
    if (!ACCEPTED_TYPES[f.type]) {
      return `ไม่รองรับไฟล์ประเภท "${f.type}" — รองรับเฉพาะ PDF, JPG, PNG`;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `ไฟล์ใหญ่เกินไป (${(f.size / 1024 / 1024).toFixed(1)} MB) — จำกัดที่ ${MAX_SIZE_MB} MB`;
    }
    return null;
  };

  const handleFile = useCallback((f) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
    e.target.value = '';
  };

  const handleScan = () => {
    if (!file) return;
    onScan(file);
  };

  const clearFile = () => {
    setFile(null);
    setError('');
  };

  const isParsing = status === 'reading' || status === 'analyzing';

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
        className={`relative bg-white rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${file ? 'border-emerald-400 bg-emerald-50/50 cursor-default' : ''}
          ${dragOver ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' : ''}
          ${!file && !dragOver ? 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50' : ''}
          flex flex-col items-center justify-center text-center p-8 min-h-[220px]`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleInputChange}
          className="hidden"
        />

        {!file ? (
          <>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
              ${dragOver ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              <UploadCloud size={30} />
            </div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">
              {dragOver ? 'วางไฟล์ที่นี่' : 'ลากวางหรือคลิกเพื่อเลือกไฟล์'}
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              รองรับ PDF, JPG, PNG — ขนาดไม่เกิน {MAX_SIZE_MB} MB
            </p>
            <span className="text-[11px] px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold">
              เลือกไฟล์ CV
            </span>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center gap-3 bg-white border border-emerald-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                {file.type === 'application/pdf' ? <FileText size={20} /> : <Image size={20} />}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {ACCEPTED_TYPES[file.type]?.label} · {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* PDPA Notice */}
      <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
        <Info size={13} className="flex-shrink-0 mt-0.5 text-amber-500" />
        <span>
          <strong className="text-amber-700">แจ้งการประมวลผลข้อมูล (PDPA):</strong>{' '}
          ไฟล์ CV ของท่านจะถูกส่งไปประมวลผลโดย AI (Anthropic Claude) เพื่อสกัดข้อมูลเท่านั้น{' '}
          <strong>ไม่มีการเก็บไฟล์ต้นฉบับไว้ในเซิร์ฟเวอร์</strong> ข้อมูลที่สกัดได้จะถูกเก็บในฐานข้อมูลของระบบนี้เท่านั้น
        </span>
      </div>

      {/* Status */}
      {isParsing && (
        <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span className="text-xs font-semibold text-indigo-700">
            {status === 'reading' ? 'กำลังอ่านไฟล์...' : 'AI กำลังวิเคราะห์ข้อมูล CV...'}
          </span>
        </div>
      )}
      {status === 'done' && (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <span>✅</span> วิเคราะห์เสร็จสิ้น — ตรวจสอบและแก้ไขข้อมูลด้านขวา
        </div>
      )}
      {status === 'demo' && (
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <span>🔑</span>
          <span>
            <strong>Demo Mode:</strong> ยังไม่ได้ตั้งค่า <code className="bg-amber-100 px-1 rounded">ANTHROPIC_API_KEY</code> ใน Netlify Environment Variables —
            กำลังแสดงข้อมูลตัวอย่างแทน
          </span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span>❌</span> เกิดข้อผิดพลาด — กรุณาลองอีกครั้งหรือตรวจสอบไฟล์
        </div>
      )}

      {/* Scan Button */}
      <button
        onClick={handleScan}
        disabled={!file || isParsing}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed
          text-white rounded-xl text-sm font-bold transition shadow-sm flex items-center justify-center gap-2"
      >
        <UploadCloud size={16} />
        {isParsing ? 'กำลังประมวลผล...' : 'เริ่มวิเคราะห์ CV ด้วย AI'}
      </button>
    </div>
  );
}
