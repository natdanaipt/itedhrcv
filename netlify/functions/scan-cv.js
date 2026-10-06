/**
 * Netlify Function: scan-cv
 * รับไฟล์ CV เป็น base64 แล้วส่งไปวิเคราะห์ด้วย Anthropic Claude
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

// Demo data ที่ใช้เมื่อไม่มี API key
const DEMO_RESULT = {
  id: '',
  name: 'นายสมชาย ตัวอย่าง',
  position: 'นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ',
  department: 'ฝ่ายพัฒนาระบบสารสนเทศ',
  email: 'somchai.t@ited.kmutnb.ac.th',
  phone: '0-2555-2000 ต่อ 2315',
  education: [
    { degree: 'วิศวกรรมศาสตรบัณฑิต (วิศวกรรมคอมพิวเตอร์)', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2560' }
  ],
  skills: [
    { name: 'Web Application Development', level: 80, category: 'Web & System' },
    { name: 'Database Administration', level: 72, category: 'Web & System' },
    { name: 'Network Configuration', level: 65, category: 'Network & Infra' },
    { name: 'Data Analytics', level: 60, category: 'Data Analytics' }
  ],
  projects: [
    { title: 'ระบบบริหารงานบริการวิชาการออนไลน์', role: 'นักพัฒนาหลัก', year: '2566', description: 'พัฒนาระบบจัดการคำขอบริการวิชาการออนไลน์สำหรับสำนักพัฒนาเทคนิคศึกษา' },
    { title: 'ระบบดูแลบำรุงรักษาเครือข่าย', role: 'ผู้ดูแลระบบ', year: '2565', description: 'บริหารจัดการเครือข่ายและเซิร์ฟเวอร์ภายในสำนัก' }
  ],
  currentWorkload: 60,
  createdAt: new Date().toISOString()
};

const SYSTEM_PROMPT = `คุณเป็น AI ผู้เชี่ยวชาญการอ่านและสกัดข้อมูลจาก CV หรือ Resume ภาษาไทย/อังกฤษ

งานของคุณคือสกัดข้อมูลจากเอกสาร CV ที่ได้รับและส่งคืนเป็น JSON ที่ถูกต้องสมบูรณ์ตามโครงสร้างที่กำหนดเท่านั้น ห้ามมีข้อความอื่นใด ห้ามใส่ markdown code block

โครงสร้าง JSON ที่ต้องการ:
{
  "id": "",
  "name": "ชื่อ-นามสกุลพร้อมคำนำหน้า (เช่น นาย/นาง/นางสาว/ดร./อาจารย์)",
  "position": "ตำแหน่งงานปัจจุบันหรือล่าสุด",
  "department": "หน่วยงาน/ฝ่าย/สังกัด",
  "email": "อีเมล",
  "phone": "เบอร์โทรศัพท์",
  "education": [
    { "degree": "ชื่อปริญญา/ระดับการศึกษา", "institution": "ชื่อสถาบัน", "year": "ปีที่จบ พ.ศ./ค.ศ." }
  ],
  "skills": [
    { "name": "ชื่อทักษะ", "level": 0-100, "category": "Web & System | AI & ML | Network & Infra | Data Analytics | Management | อื่นๆ" }
  ],
  "projects": [
    { "title": "ชื่อโครงการ", "role": "บทบาท/หน้าที่", "year": "ปี พ.ศ./ค.ศ.", "description": "รายละเอียดย่อ" }
  ],
  "currentWorkload": 50,
  "createdAt": ""
}

กฎสำคัญ:
1. ห้ามเดาข้อมูลที่ไม่มีในเอกสาร ให้เว้นว่าง ("") หรือ array ว่าง ([]) ถ้าไม่มีข้อมูล
2. level ของทักษะ: ประเมินจากประสบการณ์และผลงานที่ปรากฏจริงใน CV (0-100) ถ้าไม่มีหลักฐาน ให้ใส่ 0
3. category ของทักษะ: เลือกจาก "Web & System", "AI & ML", "Network & Infra", "Data Analytics", "Management", "อื่นๆ"
4. currentWorkload: ใส่ 50 เป็นค่าเริ่มต้น (ไม่สามารถทราบได้จาก CV)
5. createdAt: ใส่ "" (จะถูกกำหนดโดยระบบ)
6. id: ใส่ "" (จะถูกกำหนดโดยระบบ)
7. ตอบเป็น JSON อย่างเดียว ไม่มีข้อความอื่น ไม่มี \`\`\`json หรือ \`\`\``;

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Demo mode ถ้าไม่มี API key
  if (!apiKey) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        demo: true,
        message: 'ไม่พบ ANTHROPIC_API_KEY — กำลังแสดงข้อมูลตัวอย่าง (Demo Mode)',
        data: { ...DEMO_RESULT, createdAt: new Date().toISOString() }
      })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { fileBase64, mimeType, fileName } = body;

  if (!fileBase64 || !mimeType) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'กรุณาส่ง fileBase64 และ mimeType' }) };
  }

  // ตรวจสอบ mimeType ที่รองรับ
  const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(mimeType)) {
    return {
      statusCode: 400, headers,
      body: JSON.stringify({ error: `ไฟล์ประเภท ${mimeType} ไม่รองรับ รองรับเฉพาะ PDF, JPG, PNG` })
    };
  }

  // สร้าง content ตามประเภทไฟล์
  let contentBlock;
  if (mimeType === 'application/pdf') {
    contentBlock = {
      type: 'document',
      source: { type: 'base64', media_type: 'application/pdf', data: fileBase64 }
    };
  } else {
    contentBlock = {
      type: 'image',
      source: { type: 'base64', media_type: mimeType, data: fileBase64 }
    };
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: [
              contentBlock,
              {
                type: 'text',
                text: 'กรุณาสกัดข้อมูลจาก CV นี้และส่งคืนเป็น JSON ตามโครงสร้างที่กำหนด'
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Anthropic API error: ${response.status}`, detail: errText })
      };
    }

    const result = await response.json();
    let rawText = result?.content?.[0]?.text || '';

    // ตัด markdown code block ออก
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, 'Raw text:', rawText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'AI ส่งคืนข้อมูลในรูปแบบที่ไม่ถูกต้อง กรุณาลองอีกครั้ง',
          raw: rawText.substring(0, 500)
        })
      };
    }

    // ใส่ createdAt ถ้าว่าง
    if (!parsed.createdAt) {
      parsed.createdAt = new Date().toISOString();
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ demo: false, data: parsed })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', detail: err.message })
    };
  }
};
