/**
 * personnelStore.js — ชั้นข้อมูลบุคลากรกลาง
 * Backend: localStorage (สลับเป็น Supabase ได้โดยแก้ไฟล์นี้ไฟล์เดียว)
 */

const STORAGE_KEY = 'ited_personnel_v1';

// ─── Departments ──────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  'ผู้บริหารสำนักพัฒนาเทคนิคศึกษา',
  'ฝ่ายพัฒนาระบบสารสนเทศ',
  'สำนักงานผู้อำนวยการ',
  'ฝ่ายบริการวิชาการและพัฒนานวัตกรรม',
  'ศูนย์กลางการให้บริการวิชาการ',
  'ศูนย์ส่งเสริมเทคโนโลยีการศึกษา',
  'ฝ่ายสื่อการเรียนการสอน',
  'ศูนย์รับรองสมรรถนะบุคคลตามมาตรฐานอาชีพ',
];

// ─── Seed Data — 20 คน ครอบคลุม 8 ฝ่าย ────────────────────────────────────────
const SEED_DATA = [
  // ── ผู้บริหารสำนักพัฒนาเทคนิคศึกษา (4 คน) ──
  {
    id: 'seed-001', gender: 'male',
    name: 'รศ.ดร.ชาญชัย ทองประสิทธิ์',
    position: 'ผู้อำนวยการสำนักพัฒนาเทคนิคศึกษา',
    department: 'ผู้บริหารสำนักพัฒนาเทคนิคศึกษา',
    email: 'chanchai.t@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2301',
    education: [{ degree: 'ปริญญาเอก', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2548' }],
    skills: [
      { name: 'Strategic Planning',       level: 96, category: 'Management' },
      { name: 'Educational Technology',   level: 92, category: 'อื่นๆ' },
      { name: 'Organizational Management',level: 94, category: 'Management' },
      { name: 'Project Management',       level: 88, category: 'Management' },
      { name: 'Academic Policy',          level: 90, category: 'Management' },
    ],
    projects: [
      { title: 'นโยบายพัฒนานวัตกรรมการศึกษาดิจิทัล สำนัก ITED', role: 'ผู้อำนวยการ', year: '2566', description: 'วางแผนยุทธศาสตร์' },
      { title: 'ยกระดับมาตรฐานสมรรถนะวิชาชีพร่วมภาคอุตสาหกรรม', role: 'ผู้บริหาร', year: '2567', description: 'MOU 15 บริษัท' },
    ],
    currentWorkload: 65, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-002', gender: 'female',
    name: 'นางวนิดา บุญสนอง',
    position: 'ที่ปรึกษาผู้อำนวยการ สำนักพัฒนาเทคนิคศึกษา',
    department: 'ผู้บริหารสำนักพัฒนาเทคนิคศึกษา',
    email: 'wanida.b@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2303',
    education: [{ degree: 'ปริญญาโท', institution: 'จุฬาลงกรณ์มหาวิทยาลัย', year: '2542' }],
    skills: [
      { name: 'Institutional Advisory',  level: 93, category: 'Management' },
      { name: 'Educational Planning',    level: 89, category: 'Management' },
      { name: 'Public Relations',        level: 86, category: 'Management' },
      { name: 'Budget Management',       level: 82, category: 'Management' },
    ],
    projects: [
      { title: 'โครงการที่ปรึกษาการบริหารจัดการองค์กรเพื่อความยั่งยืน', role: 'ที่ปรึกษา', year: '2566', description: '' },
      { title: 'พัฒนาระบบสนับสนุนการบริหารจัดการภายในสำนัก', role: 'ผู้กำกับโครงการ', year: '2567', description: '' },
    ],
    currentWorkload: 45, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-003', gender: 'male',
    name: 'ผศ.ดร.วิชัย รุ่งเรืองอนันต์',
    position: 'รองผู้อำนวยการฝ่ายบริการวิชาการและอุตสาหกรรมสัมพันธ์',
    department: 'ผู้บริหารสำนักพัฒนาเทคนิคศึกษา',
    email: 'vichai.r@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2302',
    education: [{ degree: 'ปริญญาเอก', institution: 'King Mongkut University of Technology North Bangkok', year: '2551' }],
    skills: [
      { name: 'Industry Relations',      level: 94, category: 'Management' },
      { name: 'Academic Services',       level: 91, category: 'อื่นๆ' },
      { name: 'Engineering Consultancy', level: 89, category: 'อื่นๆ' },
      { name: 'Project Management',      level: 85, category: 'Management' },
      { name: 'Training Facilitation',   level: 80, category: 'อื่นๆ' },
    ],
    projects: [
      { title: 'ความร่วมมือบริการวิชาการกับภาคอุตสาหกรรมยานยนต์', role: 'หัวหน้าโครงการ', year: '2567', description: '' },
      { title: 'จัดตั้งศูนย์บ่มเพาะและถ่ายทอดเทคโนโลยีวิศวกรรม', role: 'ผู้รับผิดชอบ', year: '2566', description: '' },
    ],
    currentWorkload: 78, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-004', gender: 'female',
    name: 'ดร.พัชรินทร์ ผาสุกูล',
    position: 'รองผู้อำนวยการฝ่ายวิชาการและกิจการพิเศษ',
    department: 'ผู้บริหารสำนักพัฒนาเทคนิคศึกษา',
    email: 'phatcharin.h@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2304',
    education: [{ degree: 'ปริญญาเอก', institution: 'มหาวิทยาลัยศิลปากร', year: '2553' }],
    skills: [
      { name: 'Curriculum Development',  level: 93, category: 'อื่นๆ' },
      { name: 'Academic Affairs',        level: 90, category: 'Management' },
      { name: 'Training Facilitation',   level: 87, category: 'อื่นๆ' },
      { name: 'Project Management',      level: 84, category: 'Management' },
    ],
    projects: [
      { title: 'พัฒนาหลักสูตรฝึกอบรมฐานสมรรถนะมาตรฐานสากล', role: 'ผู้อำนวยการหลักสูตร', year: '2567', description: '' },
      { title: 'โครงการพัฒนากิจการพิเศษเพื่อการเรียนรู้ตลอดชีวิต', role: 'หัวหน้าโครงการ', year: '2566', description: '' },
    ],
    currentWorkload: 72, createdAt: '2024-01-01T00:00:00.000Z',
  },

  // ── ฝ่ายพัฒนาระบบสารสนเทศ (5 คน) ──
  {
    id: 'seed-005', gender: 'male',
    name: 'นายภาคภูมิ อัศววงศ์อารยะ',
    position: 'หัวหน้าฝ่ายพัฒนาระบบสารสนเทศ',
    department: 'ฝ่ายพัฒนาระบบสารสนเทศ',
    email: 'pakpoom.a@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2315',
    education: [{ degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี', year: '2558' }],
    skills: [
      { name: 'Full-Stack Development',  level: 92, category: 'Web & System' },
      { name: 'System Architecture',     level: 94, category: 'Web & System' },
      { name: 'Database Design',         level: 88, category: 'Web & System' },
      { name: 'Project Management',      level: 87, category: 'Management' },
      { name: 'API Integration',         level: 85, category: 'Web & System' },
      { name: 'Web Development',         level: 90, category: 'Web & System' },
    ],
    projects: [
      { title: 'HR & Competency Platform (ระบบปัจจุบัน)', role: 'Lead Developer', year: '2567', description: 'ระบบบริหารบุคลากรและสมรรถนะ' },
      { title: 'ระบบบริการการศึกษาดิจิทัลและการเชื่อมต่อ API มหาวิทยาลัย', role: 'System Architect', year: '2566', description: 'เชื่อมต่อ 5 ระบบ' },
      { title: 'โครงการพัฒนาระบบสารสนเทศเพื่อการบริหารจัดการสำนัก', role: 'Project Lead', year: '2565', description: '' },
    ],
    currentWorkload: 88, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-006', gender: 'male',
    name: 'ว่าที่ ร.ต.ณฐนนท์ รมยะมาลี',
    position: 'นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ',
    department: 'ฝ่ายพัฒนาระบบสารสนเทศ',
    email: 'nathanon.r@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2316',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2562' }],
    skills: [
      { name: 'Web Development',         level: 82, category: 'Web & System' },
      { name: 'Database Design',         level: 78, category: 'Web & System' },
      { name: 'Network & Infrastructure',level: 75, category: 'Network & Infra' },
      { name: 'API Integration',         level: 70, category: 'Web & System' },
    ],
    projects: [
      { title: 'โครงการพัฒนาระบบทะเบียนประวัติและจัดเก็บผลงานบุคลากร', role: 'Developer', year: '2567', description: '' },
      { title: 'ระบบดูแลบำรุงรักษาเครือข่ายและเซิร์ฟเวอร์สำนัก', role: 'System Support', year: '2566', description: '' },
    ],
    currentWorkload: 60, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-007', gender: 'female',
    name: 'นางพนิดา หอมแพน',
    position: 'นักวิชาการโสตทัศนศึกษา ระดับปฏิบัติการ',
    department: 'ฝ่ายพัฒนาระบบสารสนเทศ',
    email: 'panida.h@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2317',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยสุโขทัยธรรมาธิราช', year: '2556' }],
    skills: [
      { name: 'Media Production',        level: 91, category: 'อื่นๆ' },
      { name: 'Digital Content Design',  level: 88, category: 'อื่นๆ' },
      { name: 'UI/UX Design',            level: 72, category: 'Web & System' },
      { name: 'E-Learning / Instructional Design', level: 65, category: 'อื่นๆ' },
    ],
    projects: [
      { title: 'โครงการผลิตสื่อการเรียนรู้ดิจิทัลและสื่อนำเสนอองค์กร', role: 'Media Producer', year: '2567', description: '12 ชุดสื่อ' },
      { title: 'จัดทำกราฟิกและอินโฟกราฟิกประชาสัมพันธ์ระบบสารสนเทศ', role: 'Graphic Designer', year: '2566', description: '' },
    ],
    currentWorkload: 55, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-008', gender: 'male',
    name: 'นายวีรวัฒน์ จิตต์โสภณ',
    position: 'นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ',
    department: 'ฝ่ายพัฒนาระบบสารสนเทศ',
    email: 'weerawat.j@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2318',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเกษตรศาสตร์', year: '2560' }],
    skills: [
      { name: 'Web Development',         level: 84, category: 'Web & System' },
      { name: 'API Integration',         level: 82, category: 'Web & System' },
      { name: 'Network & Infrastructure',level: 79, category: 'Network & Infra' },
      { name: 'Database Design',         level: 74, category: 'Web & System' },
    ],
    projects: [
      { title: 'ระบบบริหารงานบริการวิชาการออนไลน์', role: 'Developer', year: '2566', description: '' },
      { title: 'การพัฒนาระบบเชื่อมโยงข้อมูลโครงการวิจัย', role: 'Backend Developer', year: '2567', description: '' },
    ],
    currentWorkload: 97, createdAt: '2024-01-01T00:00:00.000Z', // งานล้นมาก (> 95%)
  },
  {
    id: 'seed-009', gender: 'male',
    name: 'นายวงศ์วรัณ จิรเรืองกุล',
    position: 'นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ',
    department: 'ฝ่ายพัฒนาระบบสารสนเทศ',
    email: 'wongwaran.j@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2319',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2563' }],
    skills: [
      { name: 'Web Development',         level: 89, category: 'Web & System' },
      { name: 'UI/UX Design',            level: 85, category: 'Web & System' },
      { name: 'Data Analytics',          level: 80, category: 'Data Analytics' },
      { name: 'API Integration',         level: 76, category: 'Web & System' },
      { name: 'Database Design',         level: 72, category: 'Web & System' },
    ],
    projects: [
      { title: 'Dashboard วิเคราะห์สมรรถนะบุคลากร', role: 'Frontend Developer', year: '2567', description: '' },
      { title: 'ระบบจัดทำเอกสารรับรองดิจิทัล', role: 'Developer', year: '2566', description: '' },
    ],
    currentWorkload: 68, createdAt: '2024-01-01T00:00:00.000Z',
  },

  // ── สำนักงานผู้อำนวยการ (3 คน) ──
  {
    id: 'seed-012', gender: 'female',
    name: 'นางสาวกัลยาณี สวัสดิ์ทอง',
    position: 'นักทรัพยากรบุคคล ระดับปฏิบัติการ',
    department: 'สำนักงานผู้อำนวยการ',
    email: 'kanyanee.s@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2305',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยรามคำแหง', year: '2558' }],
    skills: [
      { name: 'HR Management',           level: 88, category: 'Management' },
      { name: 'Recruitment & Selection', level: 85, category: 'Management' },
      { name: 'Training Facilitation',   level: 76, category: 'อื่นๆ' },
      { name: 'Data Analytics',          level: 62, category: 'Data Analytics' },
    ],
    projects: [
      { title: 'โครงการพัฒนาระบบประเมินสมรรถนะบุคลากรประจำปี', role: 'HR Specialist', year: '2567', description: '' },
      { title: 'จัดทำแผนพัฒนาบุคลากรสำนัก 5 ปี', role: 'ผู้จัดทำ', year: '2566', description: '' },
    ],
    currentWorkload: 50, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-013', gender: 'male',
    name: 'นายอนุชา เพ็ชรงาม',
    position: 'นักการเงินและบัญชี ระดับปฏิบัติการ',
    department: 'สำนักงานผู้อำนวยการ',
    email: 'anucha.p@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2306',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยธรรมศาสตร์', year: '2559' }],
    skills: [
      { name: 'Budget Management',       level: 90, category: 'Management' },
      { name: 'Financial Analysis',      level: 87, category: 'Data Analytics' },
      { name: 'Data Analytics',          level: 75, category: 'Data Analytics' },
      { name: 'Microsoft Excel Advanced',level: 88, category: 'Data Analytics' },
    ],
    projects: [
      { title: 'จัดทำรายงานงบประมาณประจำปีสำนัก', role: 'ผู้รับผิดชอบ', year: '2567', description: '' },
      { title: 'วิเคราะห์ต้นทุนโครงการบริการวิชาการ', role: 'นักวิเคราะห์', year: '2566', description: '' },
    ],
    currentWorkload: 42, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-016', gender: 'female',
    name: 'นางสาวรุ่งทิพย์ พงษ์ไพบูลย์',
    position: 'นักวิเคราะห์นโยบายและแผน ระดับปฏิบัติการ',
    department: 'สำนักงานผู้อำนวยการ',
    email: 'rungthip.p@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2307',
    education: [{ degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยเกษตรศาสตร์', year: '2562' }],
    skills: [
      { name: 'Strategic Planning',      level: 84, category: 'Management' },
      { name: 'Data Analytics',          level: 79, category: 'Data Analytics' },
      { name: 'Project Management',      level: 77, category: 'Management' },
      { name: 'Microsoft Excel Advanced',level: 82, category: 'Data Analytics' },
      { name: 'Public Relations',        level: 70, category: 'Management' },
    ],
    projects: [
      { title: 'จัดทำแผนยุทธศาสตร์สำนัก ITED พ.ศ. 2566–2570', role: 'ผู้จัดทำหลัก', year: '2566', description: '' },
      { title: 'รายงานผลการดำเนินงานประจำปีสำนักพัฒนาเทคนิคศึกษา', role: 'ผู้รวบรวมข้อมูล', year: '2567', description: '' },
    ],
    currentWorkload: 63, createdAt: '2024-01-01T00:00:00.000Z',
  },

  // ── ฝ่ายบริการวิชาการและพัฒนานวัตกรรม (3 คน) ──
  {
    id: 'seed-017', gender: 'male',
    name: 'นายสุวัฒน์ มั่นคงกิจการ',
    position: 'วิศวกรบริการวิชาการ ระดับชำนาญการ',
    department: 'ฝ่ายบริการวิชาการและพัฒนานวัตกรรม',
    email: 'suwat.m@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2320',
    education: [{ degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2555' }],
    skills: [
      { name: 'Engineering Consultancy', level: 90, category: 'อื่นๆ' },
      { name: 'Industry Relations',      level: 86, category: 'Management' },
      { name: 'Training Facilitation',   level: 82, category: 'อื่นๆ' },
      { name: 'Project Management',      level: 80, category: 'Management' },
      { name: 'IoT & Embedded Systems',  level: 75, category: 'อื่นๆ' },
    ],
    projects: [
      { title: 'โครงการบริการวิชาการด้านระบบอัตโนมัติโรงงาน', role: 'หัวหน้าโครงการ', year: '2567', description: '8 โรงงาน' },
      { title: 'อบรมเชิงปฏิบัติการ PLC และ Automation ภาคอุตสาหกรรม', role: 'วิทยากรหลัก', year: '2566', description: '150 คน' },
    ],
    currentWorkload: 83, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-018', gender: 'female',
    name: 'นางสาวปัทมาวดี ชลอวงษ์',
    position: 'นักวิชาการฝึกอบรม ระดับปฏิบัติการ',
    department: 'ฝ่ายบริการวิชาการและพัฒนานวัตกรรม',
    email: 'pattamawadee.c@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2321',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2561' }],
    skills: [
      { name: 'Training Facilitation',   level: 87, category: 'อื่นๆ' },
      { name: 'Curriculum Development',  level: 83, category: 'อื่นๆ' },
      { name: 'E-Learning / Instructional Design', level: 78, category: 'อื่นๆ' },
      { name: 'Project Management',      level: 72, category: 'Management' },
    ],
    projects: [
      { title: 'จัดอบรมทักษะดิจิทัลสำหรับบุคลากรอาชีวศึกษา 200 คน', role: 'ผู้ประสานงาน', year: '2567', description: '' },
      { title: 'พัฒนาหลักสูตรฝึกอบรมฐานสมรรถนะช่างไฟฟ้า', role: 'นักออกแบบหลักสูตร', year: '2566', description: '' },
    ],
    currentWorkload: 38, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-019', gender: 'male',
    name: 'นายกฤษณ์ วงศ์เจริญ',
    position: 'นักวิจัยและพัฒนานวัตกรรม ระดับปฏิบัติการ',
    department: 'ฝ่ายบริการวิชาการและพัฒนานวัตกรรม',
    email: 'krit.w@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2322',
    education: [{ degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยมหิดล', year: '2563' }],
    skills: [
      { name: 'AI & Machine Learning',   level: 82, category: 'AI & ML' },
      { name: 'Data Analytics',          level: 85, category: 'Data Analytics' },
      { name: 'Python Data Science',     level: 80, category: 'AI & ML' },
      { name: 'Web Development',         level: 65, category: 'Web & System' },
      { name: 'API Integration',         level: 68, category: 'Web & System' },
    ],
    projects: [
      { title: 'วิจัยการประยุกต์ AI ในการประเมินสมรรถนะอาชีพ', role: 'นักวิจัยหลัก', year: '2567', description: '' },
      { title: 'Dashboard วิเคราะห์แนวโน้มทักษะตลาดแรงงาน', role: 'Data Analyst', year: '2566', description: '' },
    ],
    currentWorkload: 90, createdAt: '2024-01-01T00:00:00.000Z',
  },

  // ── ศูนย์กลางการให้บริการวิชาการ (2 คน) ──
  {
    id: 'seed-010', gender: 'female',
    name: 'นางสาวสุภาพร เจตนาดี',
    position: 'เจ้าหน้าที่ประสานงานการฝึกอบรม',
    department: 'ศูนย์กลางการให้บริการวิชาการ',
    email: 'suphaporn.j@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2325',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยบูรพา', year: '2560' }],
    skills: [
      { name: 'Training Facilitation',   level: 82, category: 'อื่นๆ' },
      { name: 'Data Analytics',          level: 74, category: 'Data Analytics' },
      { name: 'Project Management',      level: 70, category: 'Management' },
      { name: 'Microsoft Excel Advanced',level: 79, category: 'Data Analytics' },
    ],
    projects: [
      { title: 'ประสานงานโครงการฝึกอบรมวิชาชีพประจำปี 2566–2567', role: 'ผู้ประสานงาน', year: '2567', description: '' },
      { title: 'รายงานสถิติผู้เข้าอบรมและผลการประเมิน', role: 'ผู้จัดทำ', year: '2567', description: '' },
    ],
    currentWorkload: 48, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-020', gender: 'male',
    name: 'นายธีระพล ใจซื่อ',
    position: 'เจ้าหน้าที่ทดสอบมาตรฐานอาชีพ',
    department: 'ศูนย์กลางการให้บริการวิชาการ',
    email: 'teeraphon.j@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2326',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี', year: '2559' }],
    skills: [
      { name: 'Academic Services',       level: 80, category: 'อื่นๆ' },
      { name: 'Training Facilitation',   level: 76, category: 'อื่นๆ' },
      { name: 'Data Analytics',          level: 65, category: 'Data Analytics' },
    ],
    projects: [
      { title: 'ทดสอบสมรรถนะบุคคลตามมาตรฐานอาชีพ ระดับ 3-5', role: 'เจ้าหน้าที่', year: '2567', description: '' },
      { title: 'จัดทำคู่มือทดสอบมาตรฐานสาขาช่างอิเล็กทรอนิกส์', role: 'ผู้จัดทำ', year: '2566', description: '' },
    ],
    currentWorkload: 52, createdAt: '2024-01-01T00:00:00.000Z',
  },

  // ── ศูนย์ส่งเสริมเทคโนโลยีการศึกษา (2 คน) ──
  {
    id: 'seed-011', gender: 'male',
    name: 'นายธีรพงษ์ สุขสวัสดิ์',
    position: 'นักเทคโนโลยีการศึกษา ระดับชำนาญการ',
    department: 'ศูนย์ส่งเสริมเทคโนโลยีการศึกษา',
    email: 'teerapong.s@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2330',
    education: [{ degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยเกษตรศาสตร์', year: '2557' }],
    skills: [
      { name: 'E-Learning / Instructional Design', level: 92, category: 'อื่นๆ' },
      { name: 'Moodle LMS',              level: 90, category: 'อื่นๆ' },
      { name: 'Training Facilitation',   level: 87, category: 'อื่นๆ' },
      { name: 'Curriculum Development',  level: 85, category: 'อื่นๆ' },
      { name: 'Media Production',        level: 72, category: 'อื่นๆ' },
    ],
    projects: [
      { title: 'พัฒนาหลักสูตร E-Learning สาขาช่างอุตสาหกรรม 8 รายวิชา', role: 'Instructional Designer', year: '2567', description: '' },
      { title: 'อบรมผู้ประเมินสมรรถนะอาชีวศึกษา 3 รุ่น 120 คน', role: 'วิทยากร', year: '2566', description: '' },
      { title: 'โครงการพัฒนาระบบ LMS สำนัก ITED บน Moodle', role: 'หัวหน้าโครงการ', year: '2565', description: '' },
    ],
    currentWorkload: 75, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-021', gender: 'female',
    name: 'นางสาวภัทรนันท์ รื่นจิตต์',
    position: 'นักเทคโนโลยีการศึกษา ระดับปฏิบัติการ',
    department: 'ศูนย์ส่งเสริมเทคโนโลยีการศึกษา',
    email: 'phattranun.r@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2331',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยศิลปากร', year: '2564' }],
    skills: [
      { name: 'E-Learning / Instructional Design', level: 80, category: 'อื่นๆ' },
      { name: 'Digital Content Design',  level: 82, category: 'อื่นๆ' },
      { name: 'Media Production',        level: 78, category: 'อื่นๆ' },
      { name: 'UI/UX Design',            level: 68, category: 'Web & System' },
    ],
    projects: [
      { title: 'ออกแบบบทเรียนออนไลน์สาขาช่างกลโรงงาน', role: 'Content Developer', year: '2567', description: '' },
      { title: 'ผลิตวิดีโอการเรียนการสอน 20 ตอน', role: 'Producer', year: '2566', description: '' },
    ],
    currentWorkload: 58, createdAt: '2024-01-01T00:00:00.000Z',
  },

  // ── ฝ่ายสื่อการเรียนการสอน (2 คน) ──
  {
    id: 'seed-014', gender: 'female',
    name: 'นางสาวปิยะนาถ ดาวเรือง',
    position: 'นักประชาสัมพันธ์ ระดับปฏิบัติการ',
    department: 'ฝ่ายสื่อการเรียนการสอน',
    email: 'piyanat.d@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2335',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยสงขลานครินทร์', year: '2562' }],
    skills: [
      { name: 'Media Production',        level: 85, category: 'อื่นๆ' },
      { name: 'Digital Content Design',  level: 83, category: 'อื่นๆ' },
      { name: 'UI/UX Design',            level: 70, category: 'Web & System' },
      { name: 'E-Learning / Instructional Design', level: 62, category: 'อื่นๆ' },
    ],
    projects: [
      { title: 'ผลิตสื่อประชาสัมพันธ์ดิจิทัลสำนัก ITED', role: 'Content Creator', year: '2567', description: '' },
      { title: 'ออกแบบอินโฟกราฟิกแผนยุทธศาสตร์สำนัก', role: 'Graphic Designer', year: '2566', description: '' },
    ],
    currentWorkload: 40, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-022', gender: 'male',
    name: 'นายชัยวัฒน์ แสงทอง',
    position: 'นักวิชาการโสตทัศนศึกษา ระดับปฏิบัติการ',
    department: 'ฝ่ายสื่อการเรียนการสอน',
    email: 'chaiwat.s@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2336',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร', year: '2563' }],
    skills: [
      { name: 'Media Production',        level: 88, category: 'อื่นๆ' },
      { name: 'E-Learning / Instructional Design', level: 75, category: 'อื่นๆ' },
      { name: 'Digital Content Design',  level: 80, category: 'อื่นๆ' },
      { name: 'Training Facilitation',   level: 65, category: 'อื่นๆ' },
    ],
    projects: [
      { title: 'ผลิตสื่อวิดีโอการเรียนการสอนสายช่างอุตสาหกรรม', role: 'Video Producer', year: '2567', description: '24 ตอน' },
      { title: 'บันทึกการบรรยายออนไลน์ผ่านระบบ Zoom / Teams', role: 'Technical Support', year: '2566', description: '' },
    ],
    currentWorkload: 100, createdAt: '2024-01-01T00:00:00.000Z', // งานล้นเต็ม (> 95%)
  },

  // ── ศูนย์รับรองสมรรถนะบุคคลตามมาตรฐานอาชีพ (2 คน) ──
  {
    id: 'seed-015', gender: 'male',
    name: 'นายกิตติพงษ์ รักษ์ฉัตร',
    position: 'วิศวกรระบบ IoT และนวัตกรรมการเรียนรู้',
    department: 'ศูนย์รับรองสมรรถนะบุคคลตามมาตรฐานอาชีพ',
    email: 'kittipong.r@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2340',
    education: [{ degree: 'ปริญญาโท', institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2561' }],
    skills: [
      { name: 'IoT & Embedded Systems',  level: 92, category: 'อื่นๆ' },
      { name: 'Network & Infrastructure',level: 80, category: 'Network & Infra' },
      { name: 'Training Facilitation',   level: 78, category: 'อื่นๆ' },
      { name: 'Web Development',         level: 65, category: 'Web & System' },
      { name: 'AI & Machine Learning',   level: 62, category: 'AI & ML' },
    ],
    projects: [
      { title: 'พัฒนาห้องปฏิบัติการ IoT สำหรับการฝึกอบรม', role: 'หัวหน้าโครงการ', year: '2567', description: '' },
      { title: 'อบรมเชิงปฏิบัติการ IoT สำหรับครูอาชีวศึกษา 3 รุ่น', role: 'วิทยากร', year: '2566', description: '90 คน' },
    ],
    currentWorkload: 62, createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-023', gender: 'female',
    name: 'นางสาวอรอนงค์ ทรงพุฒิ',
    position: 'ผู้ประเมินสมรรถนะบุคคลตามมาตรฐานอาชีพ',
    department: 'ศูนย์รับรองสมรรถนะบุคคลตามมาตรฐานอาชีพ',
    email: 'onanong.s@ited.kmutnb.ac.th', phone: '0-2555-2000 ต่อ 2341',
    education: [{ degree: 'ปริญญาตรี', institution: 'มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี', year: '2558' }],
    skills: [
      { name: 'Academic Services',       level: 86, category: 'อื่นๆ' },
      { name: 'Training Facilitation',   level: 82, category: 'อื่นๆ' },
      { name: 'Curriculum Development',  level: 78, category: 'อื่นๆ' },
      { name: 'Data Analytics',          level: 68, category: 'Data Analytics' },
    ],
    projects: [
      { title: 'ประเมินสมรรถนะบุคคลสาขาช่างไฟฟ้า ระดับ 1-3 ปี 2567', role: 'ผู้ประเมินหลัก', year: '2567', description: '250 คน' },
      { title: 'พัฒนาเครื่องมือประเมินสมรรถนะอาชีพอิเล็กทรอนิกส์', role: 'ผู้ร่วมพัฒนา', year: '2566', description: '' },
    ],
    currentWorkload: 20, createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// ─── Store API ─────────────────────────────────────────────────────────────────
function _load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return null;
}

function _persist(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function _init() {
  const existing = _load();
  if (!existing) {
    _persist(SEED_DATA);
  } else {
    // Merge: add any new seed IDs that don't exist yet
    const ids = new Set(existing.map(p => p.id));
    const merged = [...existing];
    for (const s of SEED_DATA) {
      if (!ids.has(s.id)) merged.push(s);
    }
    if (merged.length !== existing.length) _persist(merged);
  }
}

_init();

export function getAll() {
  return _load() || SEED_DATA;
}

export function getById(id) {
  return getAll().find(p => p.id === id) || null;
}

export function save(person) {
  const all = getAll();
  const idx = all.findIndex(p => p.id === person.id);
  let updated;
  if (idx >= 0) {
    updated = all.map(p => p.id === person.id ? { ...p, ...person } : p);
  } else {
    const newPerson = {
      id: person.id || `emp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      currentWorkload: 0,
      ...person,
    };
    updated = [...all, newPerson];
  }
  _persist(updated);
  return person;
}

export function remove(id) {
  _persist(getAll().filter(p => p.id !== id));
}

export function resetToSeed() {
  _persist(SEED_DATA);
}

export default { getAll, getById, save, remove, resetToSeed, DEPARTMENTS };
