/**
 * jobMatchingEngine.js
 * Client-side AI Job Matching — ไม่ใช้ API จริง
 * สกัดทักษะจากคีย์เวิร์ด + คำนวณคะแนนจากข้อมูลจริงของบุคลากร
 */

// ─── Keyword → Skill mapping ──────────────────────────────────────────────────
const KEYWORD_RULES = [
  {
    skill: 'Data Analytics',
    category: 'Data Analytics',
    titleKw: ['ข้อมูล','วิเคราะห์','dashboard','kpi','สถิติ','รายงาน','ดัชนี','ตัวชี้วัด'],
    descKw:  ['data','analytics','powerbi','power bi','กราฟ','ตัวเลข','เชิงปริมาณ','เชิงคุณภาพ','ประเมินผล','วิจัย','สำรวจ','bi report','excel advanced']
  },
  {
    skill: 'Training Facilitation',
    category: 'อื่นๆ',
    titleKw: ['อบรม','ฝึกอบรม','workshop','วิทยากร','สัมมนา','จัดอบรม','ครู','สอน'],
    descKw:  ['training','หลักสูตร','ผู้เข้าอบรม','ทักษะวิชาชีพ','เรียนรู้','ถ่ายทอด','เผยแพร่','ฝึกทักษะ','coach']
  },
  {
    skill: 'Web Development',
    category: 'Web & System',
    titleKw: ['ระบบ','เว็บ','แอป','พัฒนา','เขียนโปรแกรม','website','แอปพลิเคชัน'],
    descKw:  ['web','system','application','frontend','backend','react','vue','angular','node','javascript','html','css','php','laravel','django','ระบบออนไลน์']
  },
  {
    skill: 'Database Design',
    category: 'Web & System',
    titleKw: ['ฐานข้อมูล','database','ข้อมูลกลาง'],
    descKw:  ['sql','mysql','postgresql','mongodb','database','schema','query','ฐานข้อมูล','data model','relational']
  },
  {
    skill: 'E-Learning / Instructional Design',
    category: 'อื่นๆ',
    titleKw: ['e-learning','moodle','สื่อการสอน','บทเรียนออนไลน์','เนื้อหา','หลักสูตรออนไลน์'],
    descKw:  ['instructional','scorm','lms','บทเรียน','สื่อออนไลน์','elearning','course','วีดีโอสอน','การศึกษาออนไลน์','online learning']
  },
  {
    skill: 'API Integration',
    category: 'Web & System',
    titleKw: ['api','เชื่อมต่อ','integration','microservice','เชื่อมโยง'],
    descKw:  ['rest','api','webhook','endpoint','json','xml','เชื่อมโยง','ประสาน','api gateway','third party']
  },
  {
    skill: 'Project Management',
    category: 'Management',
    titleKw: ['บริหาร','แผน','ยุทธศาสตร์','โครงการ','project','management','กำกับ'],
    descKw:  ['แผนงาน','กำกับ','ติดตาม','รายงานผล','คณะกรรมการ','milestone','gantt','agile','scrum','ผู้รับผิดชอบโครงการ']
  },
  {
    skill: 'AI & Machine Learning',
    category: 'AI & ML',
    titleKw: ['ai','machine learning','ml','ปัญญาประดิษฐ์','โมเดล','deep learning'],
    descKw:  ['neural','nlp','tensorflow','pytorch','classification','prediction','chatbot','llm','generative','ประมวลผลภาษา']
  },
  {
    skill: 'Network & Infrastructure',
    category: 'Network & Infra',
    titleKw: ['เครือข่าย','เซิร์ฟเวอร์','network','cloud','infrastructure','ระบบเครือข่าย'],
    descKw:  ['server','router','switch','firewall','aws','azure','gcp','devops','docker','kubernetes','vpn','lan','wan','ระบบเครือข่าย','hosting']
  },
  {
    skill: 'UI/UX Design',
    category: 'Web & System',
    titleKw: ['ออกแบบ','ui','ux','design','interface','ประสบการณ์ผู้ใช้','กราฟิก'],
    descKw:  ['figma','adobe xd','wireframe','prototype','mockup','usability','user experience','user interface','ออกแบบหน้าจอ','ออกแบบ UI']
  },
  {
    skill: 'Media Production',
    category: 'อื่นๆ',
    titleKw: ['สื่อ','ผลิตสื่อ','วิดีโอ','ภาพ','อินโฟกราฟิก','สื่อประชาสัมพันธ์'],
    descKw:  ['media','video','audio','กราฟิก','infographic','animation','premiere','after effects','illustrator','photoshop','สื่อดิจิทัล']
  },
  {
    skill: 'IoT & Embedded Systems',
    category: 'อื่นๆ',
    titleKw: ['iot','embedded','arduino','raspberry','อิเล็กทรอนิกส์','วงจร'],
    descKw:  ['sensor','microcontroller','raspberry pi','arduino','firmware','ระบบฝังตัว','อิเล็กทรอนิกส์','hardware','automation']
  },
];

const TRAINING_SUGGESTIONS = {
  'Data Analytics':              'ฝึกอบรม Power BI, Python Data Analysis หรือ SQL Advanced',
  'Training Facilitation':       'ฝึกอบรมการออกแบบหลักสูตรฐานสมรรถนะและเทคนิคการเป็นวิทยากร',
  'Web Development':             'ฝึกอบรม React.js, Node.js หรือ Full-Stack Development (6-8 สัปดาห์)',
  'Database Design':             'ฝึกอบรม Database Design และ SQL Optimization',
  'E-Learning / Instructional Design': 'ฝึกอบรม Moodle Administration, SCORM Authoring และ Instructional Design',
  'API Integration':             'ฝึกอบรม REST API Design, OAuth 2.0 และ API Security',
  'Project Management':          'ฝึกอบรม PMP, Agile Scrum หรือโครงการ Project Management Professional',
  'AI & Machine Learning':       'ฝึกอบรม Machine Learning with Python, NLP หรือ Generative AI',
  'Network & Infrastructure':    'ฝึกอบรม Network Administration, Cloud Computing (AWS/Azure) หรือ DevOps',
  'UI/UX Design':                'ฝึกอบรม Figma, Adobe XD และ UX Research Methodology',
  'Media Production':            'ฝึกอบรม Video Production, Adobe Creative Suite และ Digital Storytelling',
  'IoT & Embedded Systems':      'ฝึกอบรม IoT Platform (AWS IoT/Azure IoT), Raspberry Pi และ Embedded Programming',
};

// ─── Keyword extraction ────────────────────────────────────────────────────────
export function extractRequiredSkills(title, description) {
  const titleL = (title || '').toLowerCase();
  const descL  = (description || '').toLowerCase();

  const results = [];

  for (const rule of KEYWORD_RULES) {
    let titleHits = 0;
    let descHits  = 0;

    for (const kw of rule.titleKw) {
      if (titleL.includes(kw)) titleHits++;
    }
    for (const kw of rule.descKw) {
      if (descL.includes(kw)) descHits++;
    }
    // Title keywords also searched in description (lower weight)
    for (const kw of rule.titleKw) {
      if (descL.includes(kw)) descHits += 0.5;
    }

    if (titleHits > 0 || descHits > 0) {
      const weighted = titleHits * 3 + descHits;
      let importance = 1;
      if (weighted >= 9) importance = 5;
      else if (weighted >= 6) importance = 4;
      else if (weighted >= 3) importance = 3;
      else if (weighted >= 1.5) importance = 2;
      results.push({ name: rule.skill, importance, category: rule.category });
    }
  }

  return results.sort((a, b) => b.importance - a.importance).slice(0, 8);
}

// ─── Fuzzy skill matcher ───────────────────────────────────────────────────────
function findMatchingSkill(skills, reqName) {
  const reqL = reqName.toLowerCase();
  const reqWords = reqL.split(/[\s/&(),]+/).filter(w => w.length > 2);

  let best = null;
  let bestScore = 0;

  for (const s of skills) {
    const sL = s.name.toLowerCase();
    const sWords = sL.split(/[\s/&(),]+/).filter(w => w.length > 2);

    // Exact or substring match
    if (sL.includes(reqL) || reqL.includes(sL)) {
      if (s.level > bestScore) { best = s; bestScore = s.level; }
      continue;
    }
    // Word-level overlap
    const overlap = reqWords.filter(w => sWords.some(sw => sw.includes(w) || w.includes(sw))).length;
    if (overlap >= Math.max(1, Math.min(2, reqWords.length - 1))) {
      if (s.level > bestScore) { best = s; bestScore = s.level; }
    }
  }

  return best;
}

// ─── Project relevance ─────────────────────────────────────────────────────────
function findRelevantProjects(person, requiredSkills) {
  const reqWords = requiredSkills
    .flatMap(s => s.name.toLowerCase().split(/[\s/&(),]+/))
    .filter(w => w.length > 3);

  return (person.projects || [])
    .filter(p => {
      const t = (typeof p === 'string' ? p : p.title || '').toLowerCase();
      return reqWords.some(w => t.includes(w));
    })
    .map(p => typeof p === 'string' ? p : p.title)
    .slice(0, 2);
}

// ─── Thai reason builder ───────────────────────────────────────────────────────
function buildReason(person, matchedSkills, missingSkills, relevantProjects) {
  if (matchedSkills.length === 0) {
    return `${person.name.split(' ').slice(-1)[0]} ไม่มีทักษะที่ตรงกับงานนี้โดยตรง อาจรับผิดชอบในบทบาทสนับสนุนได้`;
  }

  const topSkills = matchedSkills.slice(0, 2).map(sName => {
    const skill = (person.skills || []).find(s => s.name === sName);
    return skill ? `${sName} (ระดับ ${skill.level})` : sName;
  });

  let parts = [`มีทักษะ${topSkills.join(' และ ')}`];

  if (relevantProjects.length > 0) {
    parts.push(`เคยดำเนินโครงการ "${relevantProjects[0]}" ซึ่งเกี่ยวข้องกับงานนี้`);
  }

  if (missingSkills.length > 0) {
    const missing = missingSkills.slice(0, 2).join(' และ ');
    parts.push(`แต่ยังขาดทักษะด้าน${missing}`);
  } else {
    parts.push('และมีทักษะครอบคลุมงานนี้ได้ดี');
  }

  return parts.join(' ');
}

// ─── Workload helpers ──────────────────────────────────────────────────────────
export function getAvailabilityStatus(workload) {
  if (workload < 60)  return { label: 'ว่าง',              color: 'emerald' };
  if (workload <= 80) return { label: 'ภาระงานปานกลาง',   color: 'amber'   };
  return               { label: 'งานล้น',              color: 'red'     };
}

export function calcWorkloadPenalty(workload, urgency) {
  let base = 0;
  if (workload >= 95)      base = 25;
  else if (workload > 80)  base = 18;
  else if (workload >= 60) base = 8;
  const mult = urgency === 'urgent-high' ? 1.4 : urgency === 'urgent' ? 1.2 : 1;
  return Math.min(25, Math.round(base * mult));
}

export function calcWorkloadIncrease(durationWeeks) {
  if (durationWeeks <= 2) return 10;
  if (durationWeeks <= 4) return 15;
  if (durationWeeks <= 8) return 20;
  return 25;
}

// ─── Main matching function ────────────────────────────────────────────────────
/**
 * runJobMatching({ jobTitle, jobDescription, duration, urgency, personnel })
 * Returns { requiredSkills, allCandidates, top3, overloadedPersons }
 */
export function runJobMatching({ jobTitle, jobDescription, duration = 4, urgency = 'normal', personnel = [] }) {
  const requiredSkills = extractRequiredSkills(jobTitle, jobDescription);

  if (requiredSkills.length === 0) {
    return { requiredSkills: [], allCandidates: [], top3: [], overloadedPersons: [], isEmpty: true };
  }

  const maxImportanceSum = requiredSkills.reduce((s, r) => s + r.importance, 0);

  const scored = personnel.map(person => {
    const workload = person.currentWorkload ?? 50;
    const matchedSkills = [];
    const missingSkills = [];
    let weightedScore = 0;

    for (const req of requiredSkills) {
      const match = findMatchingSkill(person.skills || [], req.name);
      if (match) {
        weightedScore += req.importance * (match.level / 100);
        matchedSkills.push(match.name);
      } else {
        missingSkills.push(req.name);
      }
    }

    const matchScore = maxImportanceSum > 0
      ? Math.min(100, Math.round((weightedScore / maxImportanceSum) * 100))
      : 0;

    const penalty       = calcWorkloadPenalty(workload, urgency);
    const finalScore    = Math.max(0, matchScore - penalty);
    const relevantProjects = findRelevantProjects(person, requiredSkills);
    const reason        = buildReason(person, matchedSkills, missingSkills, relevantProjects);
    const suggestedTraining = missingSkills.length > 0
      ? missingSkills.slice(0, 2).map(s => TRAINING_SUGGESTIONS[s] || `พัฒนาทักษะ ${s}`).join('; ')
      : '';

    return {
      personId: person.id,
      person,
      matchScore,
      finalScore,
      workloadPenalty: penalty,
      availabilityStatus: getAvailabilityStatus(workload),
      matchedSkills,
      missingSkills,
      relevantProjects,
      reason,
      suggestedTraining,
    };
  });

  scored.sort((a, b) => b.finalScore - a.finalScore);

  // People with workload > 95% are pulled out of Top 3
  const available     = scored.filter(c => (c.person.currentWorkload ?? 0) <= 95);
  const overloaded    = scored.filter(c => (c.person.currentWorkload ?? 0) > 95);

  const top3 = available.slice(0, 3);

  return { requiredSkills, allCandidates: scored, top3, overloadedPersons: overloaded };
}
