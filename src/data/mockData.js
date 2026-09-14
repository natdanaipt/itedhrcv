// ข้อมูลรายชื่อบุคลากร (ข้อมูลจริงตาม PDF: ผู้บริหาร + ฝ่ายพัฒนาระบบสารสนเทศ)
export const mockEmployees = [
  // --- คณะผู้บริหาร ---
  {
    id: 1,
    name: "รศ.ดร.ชาญชัย ทองประสิทธิ์",
    role: "ผู้อำนวยการสำนักพัฒนาเทคนิคศึกษา",
    department: "ผู้บริหารสำนักพัฒนาเทคนิคศึกษา",
    email: "chanchai.t@ited.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2301",
    status: "active",
    skills: [
      { name: "Executive Leadership", level: 98 },
      { name: "Educational Technology", level: 95 },
      { name: "Strategic Planning", level: 92 },
      { name: "Organizational Management", level: 96 }
    ],
    projects: [
      "นโยบายการพัฒนานวัตกรรมการศึกษาดิจิทัล สำนักพัฒนาเทคนิคศึกษา",
      "โครงการยกระดับมาตรฐานสมรรถนะวิชาชีพร่วมกับภาคอุตสาหกรรม"
    ]
  },
  {
    id: 2,
    name: "นางวนิดา บุญสนอง",
    role: "ที่ปรึกษาผู้อำนวยการ สำนักพัฒนาเทคนิคศึกษา",
    department: "ผู้บริหารสำนักพัฒนาเทคนิคศึกษา",
    email: "wanida.b@ited.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2303",
    status: "active",
    skills: [
      { name: "Institutional Advisory", level: 94 },
      { name: "Educational Planning", level: 90 },
      { name: "Public Relations", level: 88 }
    ],
    projects: [
      "โครงการที่ปรึกษาการบริหารจัดการองค์กรเพื่อความยั่งยืน",
      "การพัฒนาระบบสนับสนุนการบริหารจัดการภายในสำนัก"
    ]
  },
  {
    id: 3,
    name: "ผศ.ดร.วิชัย รุ่งเรืองอนันต์",
    role: "รองผู้อำนวยการฝ่ายบริการวิชาการและอุตสาหกรรมสัมพันธ์",
    department: "ผู้บริหารสำนักพัฒนาเทคนิคศึกษา",
    email: "vichai.r@eng.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2301",
    status: "active",
    skills: [
      { name: "Industry Relations", level: 95 },
      { name: "Academic Services", level: 92 },
      { name: "Engineering Consultancy", level: 90 }
    ],
    projects: [
      "โครงการความร่วมมือบริการวิชาการกับภาคอุตสาหกรรมยานยนต์และไฟฟ้า",
      "โครงการจัดตั้งศูนย์บ่มเพาะและถ่ายทอดเทคโนโลยีวิศวกรรม"
    ]
  },
  {
    id: 4,
    name: "ดร.พัชรินทร์ ผาสุกูล",
    role: "รองผู้อำนวยการฝ่ายวิชาการและกิจการพิเศษ",
    department: "ผู้บริหารสำนักพัฒนาเทคนิคศึกษา",
    email: "phatcharin.h@ited.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2302",
    status: "active",
    skills: [
      { name: "Curriculum Development", level: 94 },
      { name: "Academic Affairs", level: 91 },
      { name: "Special Affairs & Events", level: 89 }
    ],
    projects: [
      "การพัฒนาหลักสูตรฝึกอบรมฐานสมรรถนะมาตรฐานสากล",
      "โครงการพัฒนากิจการพิเศษเพื่อการเรียนรู้ตลอดชีวิต"
    ]
  },

  // --- ฝ่ายพัฒนาระบบสารสนเทศ (ข้อมูลจริงจาก PDF) ---
  {
    id: 5,
    name: "นายภาคภูมิ อัศววงศ์อารยะ",
    role: "หัวหน้าฝ่ายพัฒนาระบบสารสนเทศ",
    department: "ฝ่ายพัฒนาระบบสารสนเทศ",
    email: "pakpoom.a@ited.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2315",
    status: "active",
    skills: [
      { name: "System Architecture", level: 94 },
      { name: "Full-Stack Development", level: 90 },
      { name: "Database & Cloud Design", level: 88 },
      { name: "Project Management", level: 86 }
    ],
    projects: [
      "โครงการพัฒนาระบบฐานข้อมูลกลางและสารสนเทศสำนัก (HR & Competency Platform)",
      "โครงการพัฒนาระบบสารสนเทศเพื่อการบริหารจัดการสำนักพัฒนาเทคนิคศึกษา",
      "ระบบบริการการศึกษาดิจิทัลและการเชื่อมต่อ API มหาวิทยาลัย"
    ]
  },
  {
    id: 6,
    name: "ว่าที่ ร.ต.ณฐนนท์ รมยะมาลี",
    role: "นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ",
    department: "ฝ่ายพัฒนาระบบสารสนเทศ",
    email: "nathanon.r@ited.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2315",
    status: "active",
    skills: [
      { name: "Web Application Dev", level: 88 },
      { name: "System Support & Maintenance", level: 85 },
      { name: "Database Administration", level: 82 }
    ],
    projects: [
      "โครงการพัฒนาระบบทะเบียนประวัติและจัดเก็บผลงานบุคลากร",
      "ระบบดูแลบำรุงรักษาเครือข่ายและเซิร์ฟเวอร์สำนัก"
    ]
  },
  {
    id: 7,
    name: "นางพนิดา หอมแพน",
    role: "นักวิชาการโสตทัศนศึกษา ระดับปฏิบัติการ",
    department: "ฝ่ายพัฒนาระบบสารสนเทศ",
    email: "panida.h@ited.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2315",
    status: "active",
    skills: [
      { name: "Media Production", level: 92 },
      { name: "Audiovisual Technology", level: 88 },
      { name: "Digital Content Design", level: 85 }
    ],
    projects: [
      "โครงการผลิตสื่อการเรียนรู้ดิจิทัลและสื่อนำเสนอองค์กร",
      "การจัดทำกราฟิกและอินโฟกราฟิกประชาสัมพันธ์ระบบสารสนเทศ"
    ]
  },
  {
    id: 8,
    name: "นายวีรวัฒน์ จิตต์โสภณ",
    role: "นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ",
    department: "ฝ่ายพัฒนาระบบสารสนเทศ",
    email: "weerawat.j@ited.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2315",
    status: "active",
    skills: [
      { name: "Software Development", level: 86 },
      { name: "API & Backend Integration", level: 84 },
      { name: "Network Configuration", level: 80 }
    ],
    projects: [
      "ระบบบริหารงานบริการวิชาการออนไลน์",
      "การพัฒนาระบบเชื่อมโยงข้อมูลโครงการวิจัย"
    ]
  },
  {
    id: 9,
    name: "นายวงศ์วรัณ จิรเรืองกุล",
    role: "นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ",
    department: "ฝ่ายพัฒนาระบบสารสนเทศ",
    email: "wongwaran.j@ited.kmutnb.ac.th",
    phone: "0-2555-2000 ต่อ 2315",
    status: "active",
    skills: [
      { name: "Frontend Development", level: 89 },
      { name: "UI/UX Design", level: 85 },
      { name: "Data Analytics & Dashboard", level: 82 }
    ],
    projects: [
      "โครงการออกแบบและพัฒนา Dashboard วิเคราะห์สมรรถนะบุคลากร",
      "ระบบจัดทำเอกสารรับรองดิจิทัล"
    ]
  }
];

// โครงสร้าง 8 แผนก/ฝ่าย ตามเอกสาร ITED
export const mockOrgStructure = {
  director: {
    id: 1,
    name: "รศ.ดร.ชาญชัย ทองประสิทธิ์",
    role: "ผู้อำนวยการ",
    organization: "สำนักพัฒนาเทคนิคศึกษา (ITED)"
  },
  executives: [
    { name: "นางวนิดา บุญสนอง", role: "ที่ปรึกษาผู้อำนวยการ" },
    { name: "ผศ.ดร.วิชัย รุ่งเรืองอนันต์", role: "รองผู้อำนวยการฝ่ายบริการวิชาการฯ" },
    { name: "ดร.พัชรินทร์ ผาสุกูล", role: "รองผู้อำนวยการฝ่ายวิชาการฯ" }
  ],
  departments: [
    {
      id: "dept-1",
      name: "ฝ่ายพัฒนาระบบสารสนเทศ",
      head: "นายภาคภูมิ อัศววงศ์อารยะ",
      headRole: "หัวหน้าฝ่ายพัฒนาระบบสารสนเทศ",
      isRealData: true,
      count: 5,
      members: [
        "นายภาคภูมิ อัศววงศ์อารยะ (หัวหน้าฝ่าย)",
        "ว่าที่ ร.ต.ณฐนนท์ รมยะมาลี (นักวิชาการคอมพิวเตอร์)",
        "นางพนิดา หอมแพน (นักวิชาการโสตทัศนศึกษา)",
        "นายวีรวัฒน์ จิตต์โสภณ (นักวิชาการคอมพิวเตอร์)",
        "นายวงศ์วรัณ จิรเรืองกุล (นักวิชาการคอมพิวเตอร์)"
      ]
    },
    {
      id: "dept-2",
      name: "สำนักงานผู้อำนวยการ",
      head: "นางสาวสมหมาย สุขใจ (ตัวอย่าง)",
      headRole: "หัวหน้าสำนักงานผู้อำนวยการ",
      isRealData: false,
      count: 6,
      members: ["กลุ่มงานสารบรรณ", "กลุ่มงานการเงินและพัสดุ", "กลุ่มงานแผนงาน"]
    },
    {
      id: "dept-3",
      name: "ฝ่ายบริการวิชาการและพัฒนานวัตกรรม",
      head: "นายสมเกียรติ มั่นคง (ตัวอย่าง)",
      headRole: "หัวหน้าฝ่ายบริการวิชาการฯ",
      isRealData: false,
      count: 4,
      members: ["กลุ่มงานบริการวิชาการ", "กลุ่มงานพัฒนานวัตกรรม"]
    },
    {
      id: "dept-4",
      name: "ศูนย์กลางการให้บริการวิชาการ",
      head: "ดร.สุรศักดิ์ เชี่ยวชาญ (ตัวอย่าง)",
      headRole: "หัวหน้าศูนย์กลางการให้บริการวิชาการ",
      isRealData: false,
      count: 3,
      members: ["กลุ่มงานประสานงานฝึกอบรม", "กลุ่มงานทดสอบมาตรฐาน"]
    },
    {
      id: "dept-5",
      name: "ศูนย์ส่งเสริมเทคโนโลยีการศึกษา",
      head: "นายธีระ วัฒนากุล (ตัวอย่าง)",
      headRole: "หัวหน้าศูนย์ส่งเสริมเทคโนโลยีการศึกษา",
      isRealData: false,
      count: 4,
      members: ["กลุ่มงานพัฒนาบทเรียนออนไลน์", "กลุ่มงานเทคโนโลยีการสอน"]
    },
    {
      id: "dept-6",
      name: "ฝ่ายสื่อการเรียนการสอน",
      head: "นางกานดา สื่อสร้างสรรค์ (ตัวอย่าง)",
      headRole: "หัวหน้าฝ่ายสื่อการเรียนการสอน",
      isRealData: false,
      count: 5,
      members: ["กลุ่มงานผลิตสื่อวิดีโอ", "กลุ่มงานผลิตสื่อสิ่งพิมพ์ดิจิทัล"]
    },
    {
      id: "dept-7",
      name: "ศูนย์รับรองสมรรถนะบุคคลตามมาตรฐานอาชีพ",
      head: "ผศ.ประสิทธิ์ มาตรฐาน (ตัวอย่าง)",
      headRole: "หัวหน้าศูนย์รับรองสมรรถนะบุคคลฯ",
      isRealData: false,
      count: 4,
      members: ["กลุ่มงานประเมินสมรรถนะ", "กลุ่มงานรับรองคุณวุฒิวิชาชีพ"]
    },
    {
      id: "dept-8",
      name: "ผู้บริหารสำนักพัฒนาเทคนิคศึกษา",
      head: "รศ.ดร.ชาญชัย ทองประสิทธิ์",
      headRole: "คณะผู้บริหารสำนัก",
      isRealData: true,
      count: 4,
      members: [
        "รศ.ดร.ชาญชัย ทองประสิทธิ์ (ผู้อำนวยการ)",
        "นางวนิดา บุญสนอง (ที่ปรึกษาผู้อำนวยการ)",
        "ผศ.ดร.วิชัย รุ่งเรืองอนันต์ (รองผู้อำนวยการ)",
        "ดร.พัชรินทร์ ผาสุกูล (รองผู้อำนวยการ)"
      ]
    }
  ]
};

export const mockStats = {
  totalPersonnel: 35,
  totalDepartments: 8,
  genderRatio: "19 : 16",
  totalProjects: 48
};