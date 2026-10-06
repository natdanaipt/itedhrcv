/**
 * Netlify Function: match-job
 * รับข้อมูลงานและรายชื่อบุคลากร → ส่ง Anthropic Claude วิเคราะห์ความเหมาะสม
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `คุณเป็นผู้เชี่ยวชาญด้านการบริหารทรัพยากรบุคคลขององค์กรวิชาการ สำนักพัฒนาเทคนิคศึกษา มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ

งานของคุณ:
1. สกัดทักษะที่งานต้องการ 3-8 ทักษะ พร้อม importance 1-5
2. ประเมินความเหมาะสมของบุคลากรทุกคนที่ได้รับ โดยอ้างอิงเฉพาะข้อมูลที่ส่งมาเท่านั้น ห้ามแต่งข้อมูล

ตอบเป็น JSON ล้วนๆ ไม่มี markdown ไม่มีข้อความอื่น:
{
  "requiredSkills": [
    { "name": "ชื่อทักษะ", "importance": 1-5 }
  ],
  "candidates": [
    {
      "personId": "id จากข้อมูลที่ส่งมา",
      "matchScore": 0-100,
      "matchedSkills": ["ชื่อจาก skills.name ของคนนั้นที่ตรงกับงาน"],
      "missingSkills": ["ทักษะที่งานต้องการแต่คนนี้ยังขาด"],
      "relevantProjects": ["ชื่อ title จาก projects ของคนนั้นที่เกี่ยวข้อง"],
      "reason": "เหตุผล 2-3 ประโยคภาษาไทย อ้างอิงชื่อทักษะและโครงการจริงของคนนั้น ห้ามแต่งข้อมูลใหม่",
      "suggestedTraining": "คำแนะนำพัฒนาทักษะที่ขาด หรือ empty string ถ้าไม่จำเป็น"
    }
  ]
}

กฎสำคัญ:
- matchScore วัดเฉพาะทักษะ+ประสบการณ์ (0-100) ไม่รวมภาระงาน (ระบบคำนวณเอง)
- ประเมินบุคลากรทุกคนที่ได้รับ
- matchedSkills ต้องเป็นชื่อจาก skills array ของคนนั้นเท่านั้น
- relevantProjects ต้องเป็นชื่อ title จาก projects array ของคนนั้นเท่านั้น
- reason ต้องอ้างอิงข้อมูลจริง ห้ามสร้างข้อมูลขึ้นมาเอง
- ถ้าบุคลากรไม่เหมาะสมเลย ให้ matchScore < 20`;

// Demo data ใช้เมื่อไม่มี API key
const DEMO_RESULT = {
  requiredSkills: [
    { name: 'Web Development (Frontend)', importance: 5 },
    { name: 'LMS / Moodle', importance: 4 },
    { name: 'Database Design', importance: 3 },
    { name: 'UI/UX Design', importance: 3 },
    { name: 'E-Learning & Instructional Design', importance: 4 },
    { name: 'API Integration', importance: 3 }
  ],
  candidates: [
    {
      personId: 'seed-009', matchScore: 87,
      matchedSkills: ['Frontend Development', 'UI/UX Design', 'React.js / TypeScript', 'Data Analytics & Dashboard'],
      missingSkills: ['Moodle LMS', 'E-Learning & Instructional Design'],
      relevantProjects: ['Dashboard วิเคราะห์สมรรถนะบุคลากร', 'ระบบจัดทำเอกสารรับรองดิจิทัล'],
      reason: 'นายวงศ์วรัณมีทักษะ Frontend Development ระดับ 89 และ UI/UX Design ระดับ 85 ซึ่งสูงที่สุดในทีม มีประสบการณ์พัฒนา Dashboard ที่ต้องการ UX ที่ดีโดยตรง รวมถึงพัฒนาระบบเอกสารดิจิทัลซึ่งมีความใกล้เคียงกับระบบ e-Learning',
      suggestedTraining: 'ควรฝึกอบรม Moodle Administration และหลักการออกแบบ Instructional Design เพื่อทำงาน SCORM'
    },
    {
      personId: 'seed-011', matchScore: 82,
      matchedSkills: ['E-Learning Development', 'Moodle LMS', 'Instructional Design', 'Training Facilitation'],
      missingSkills: ['React / Frontend Development', 'Database Design', 'API Integration'],
      relevantProjects: ['โครงการพัฒนาหลักสูตร E-Learning สาขาช่างอุตสาหกรรม', 'การฝึกอบรมผู้ประเมินสมรรถนะอาชีวศึกษา'],
      reason: 'นายธีรพงษ์มีความเชี่ยวชาญ E-Learning Development และ Moodle LMS โดยตรง เคยพัฒนาหลักสูตร 8 รายวิชาและจัดอบรม 3 รุ่น รวม 120 คน ถือเป็น Subject Matter Expert ที่เหมาะที่สุด',
      suggestedTraining: 'ควรพัฒนาทักษะ Frontend Development พื้นฐาน (HTML/CSS/JavaScript) เพื่อสื่อสารกับทีม Dev'
    },
    {
      personId: 'seed-005', matchScore: 78,
      matchedSkills: ['Full-Stack Development', 'Database & Cloud Design', 'System Architecture', 'React / Vue.js'],
      missingSkills: ['Moodle LMS', 'E-Learning & Instructional Design'],
      relevantProjects: ['HR & Competency Platform (ระบบปัจจุบัน)', 'ระบบบริการการศึกษาดิจิทัลและการเชื่อมต่อ API มหาวิทยาลัย'],
      reason: 'นายภาคภูมิมีประสบการณ์ Full-Stack Development และ System Architecture ระดับสูง เคยออกแบบสถาปัตยกรรมระบบที่ซับซ้อนและเชื่อมต่อ API กับมหาวิทยาลัย 5 ระบบ สามารถสร้างโครงสร้างพื้นฐาน e-Learning ได้แข็งแกร่ง',
      suggestedTraining: 'ควรศึกษา SCORM/xAPI standard และ Moodle plugin development'
    },
    { personId: 'seed-006', matchScore: 65, matchedSkills: ['Web Application Development', 'Database Administration'], missingSkills: ['Frontend Frameworks', 'Moodle LMS', 'UI/UX Design'], relevantProjects: ['โครงการพัฒนาระบบทะเบียนประวัติและจัดเก็บผลงานบุคลากร'], reason: 'ว่าที่ ร.ต.ณฐนนท์มีพื้นฐาน Web Application และ Database ที่ดี แต่ขาดทักษะ Frontend Frameworks และ E-Learning Design ที่งานนี้ต้องการหลัก สามารถร่วมโครงการในบทบาทสนับสนุนได้', suggestedTraining: 'ควรเรียน React.js เพิ่มเติมและศึกษา Moodle Administration' },
    { personId: 'seed-008', matchScore: 55, matchedSkills: ['Software Development', 'API & Backend Integration'], missingSkills: ['Frontend Development', 'UI/UX Design', 'Moodle LMS'], relevantProjects: ['ระบบบริหารงานบริการวิชาการออนไลน์'], reason: 'นายวีรวัฒน์มีทักษะ Backend และ API Integration แต่ขาดทักษะด้าน Frontend ที่งานนี้ต้องการเป็นหลัก เหมาะสำหรับงาน Backend Support', suggestedTraining: 'ควรพัฒนาทักษะ Frontend Development และ E-Learning platform' },
    { personId: 'seed-015', matchScore: 42, matchedSkills: ['IoT & Embedded Systems', 'Arduino / Raspberry Pi'], missingSkills: ['Web Development', 'Database Design', 'Moodle LMS'], relevantProjects: ['โครงการพัฒนาห้องปฏิบัติการ IoT สำหรับการฝึกอบรม'], reason: 'นายกิตติพงษ์มีทักษะ IoT ที่เกี่ยวข้องกับ e-Learning เชิงปฏิบัติ แต่ขาดทักษะ Web Development หลัก', suggestedTraining: 'ควรพัฒนา Web Development skills สำหรับ IoT Dashboard' },
    { personId: 'seed-010', matchScore: 40, matchedSkills: ['Data Analytics', 'Microsoft Power BI'], missingSkills: ['Web Development', 'Moodle LMS', 'E-Learning Design'], relevantProjects: ['ระบบรายงานผลการดำเนินงานประจำปี'], reason: 'นางสาวสุภาพรมีความเชี่ยวชาญด้านการวิเคราะห์ข้อมูลที่ไม่ตรงกับงานพัฒนาระบบ e-Learning', suggestedTraining: 'ไม่แนะนำให้รับผิดชอบงานนี้หลัก' },
    { personId: 'seed-007', matchScore: 35, matchedSkills: ['Media Production', 'Digital Content Design'], missingSkills: ['Web Development', 'Database Design', 'Moodle LMS'], relevantProjects: ['โครงการผลิตสื่อการเรียนรู้ดิจิทัลและสื่อนำเสนอองค์กร'], reason: 'นางพนิดามีทักษะด้านสื่อดิจิทัลซึ่งเกี่ยวข้องบางส่วน แต่ขาดทักษะการพัฒนาระบบที่จำเป็น', suggestedTraining: 'สามารถสนับสนุนด้านการผลิตเนื้อหาสื่อการเรียนรู้' },
    { personId: 'seed-004', matchScore: 18, matchedSkills: ['Curriculum Development'], missingSkills: ['Web Development', 'Database', 'System Design'], relevantProjects: ['การพัฒนาหลักสูตรฝึกอบรมฐานสมรรถนะมาตรฐานสากล'], reason: 'ดร.พัชรินทร์มีทักษะด้านการพัฒนาหลักสูตร แต่ขาดทักษะเทคนิคที่จำเป็น', suggestedTraining: '' },
    { personId: 'seed-014', matchScore: 22, matchedSkills: ['Content Marketing', 'Social Media Management'], missingSkills: ['Web Development', 'Database', 'E-Learning System'], relevantProjects: [], reason: 'นางสาวปิยะนาถมีทักษะสื่อสารและ Content Creation แต่ขาดทักษะเทคนิคหลัก', suggestedTraining: '' },
    { personId: 'seed-012', matchScore: 20, matchedSkills: ['HR Management'], missingSkills: ['Web Development', 'Database', 'E-Learning'], relevantProjects: [], reason: 'นางสาวกัลยาณีมีความเชี่ยวชาญด้าน HR ไม่ตรงกับงานพัฒนาระบบ e-Learning', suggestedTraining: '' },
    { personId: 'seed-001', matchScore: 15, matchedSkills: ['Strategic Planning'], missingSkills: ['Web Development', 'Database', 'E-Learning'], relevantProjects: [], reason: 'รศ.ดร.ชาญชัยเป็นผู้บริหารระดับสูงที่ควรเป็นผู้อนุมัติโครงการมากกว่าผู้ปฏิบัติ', suggestedTraining: '' },
    { personId: 'seed-002', matchScore: 10, matchedSkills: ['Educational Planning'], missingSkills: ['Web Development', 'Database', 'E-Learning'], relevantProjects: [], reason: 'นางวนิดาเป็นที่ปรึกษาด้านการบริหาร ไม่ตรงกับงานพัฒนาระบบเทคนิค', suggestedTraining: '' },
    { personId: 'seed-003', matchScore: 12, matchedSkills: ['Academic Services'], missingSkills: ['Web Development', 'Database', 'E-Learning System'], relevantProjects: [], reason: 'ผศ.ดร.วิชัยมีความเชี่ยวชาญด้านวิศวกรรมและบริการวิชาการ แต่ไม่ตรงกับงาน IT โดยตรง', suggestedTraining: '' },
    { personId: 'seed-013', matchScore: 15, matchedSkills: ['Microsoft Excel Advanced'], missingSkills: ['Web Development', 'Database', 'E-Learning'], relevantProjects: [], reason: 'นายอนุชามีความเชี่ยวชาญด้านการเงินและบัญชี ไม่ตรงกับงานพัฒนาระบบเทคนิค', suggestedTraining: '' }
  ]
};

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ demo: true, message: 'Demo Mode: ไม่พบ ANTHROPIC_API_KEY', data: DEMO_RESULT })
    };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { jobTitle, jobDescription, duration, urgency, personnel } = body;
  if (!jobTitle || !personnel) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'กรุณาส่ง jobTitle และ personnel' }) };
  }

  const urgencyLabel = urgency === 'urgent-high' ? 'ด่วนมาก' : urgency === 'urgent' ? 'ด่วน' : 'ปกติ';
  const userMessage = `งานที่ต้องวิเคราะห์:
ชื่องาน: ${jobTitle}
รายละเอียด: ${jobDescription || '-'}
ระยะเวลา: ${duration} สัปดาห์
ระดับความเร่งด่วน: ${urgencyLabel}

บุคลากรในระบบ:
${JSON.stringify(personnel, null, 2)}

กรุณาวิเคราะห์และส่งคืน JSON ตามรูปแบบที่กำหนด`;

  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: res.status, headers, body: JSON.stringify({ error: `Anthropic API error: ${res.status}`, detail: errText }) };
    }

    const result = await res.json();
    let rawText = result?.content?.[0]?.text || '';
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed;
    try { parsed = JSON.parse(rawText); }
    catch {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'AI ส่งคืนข้อมูลไม่ถูกต้อง กรุณาลองใหม่', raw: rawText.substring(0, 300) }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ demo: false, data: parsed }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', detail: err.message }) };
  }
};
