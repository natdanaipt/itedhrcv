import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { cvExtractPrompt } from '../prompts/cvExtract.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (['application/pdf', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, and JPEG are allowed.'));
    }
  },
});

let dbPromise;
const getDb = () => {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, '..', '..', 'database.sqlite'),
      driver: sqlite3.Database
    });
  }
  return dbPromise;
};

// Zod Schema for validation
const cvSchema = z.object({
  personal: z.object({
    title: z.string().nullable(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
    position: z.string().nullable(),
    department: z.string().nullable(),
    organization: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
  }),
  education: z.array(z.object({
    degree: z.string(),
    major: z.string().nullable(),
    institution: z.string().nullable(),
    year: z.string().nullable(),
  })),
  experience: z.array(z.object({
    position: z.string(),
    organization: z.string().nullable(),
    start: z.string().nullable(),
    end: z.string().nullable(),
    description: z.string().nullable(),
  })),
  skills: z.array(z.object({
    name: z.string(),
    category: z.string(),
    proficiency: z.number().nullable(),
  })),
  projects: z.array(z.object({
    name: z.string(),
    role: z.string().nullable(),
    year: z.string().nullable(),
    description: z.string().nullable(),
    technologies: z.array(z.string()).default([]),
  })).default([]),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string().nullable(),
    year: z.string().nullable(),
  })),
  languages: z.array(z.object({
    language: z.string(),
    level: z.string().nullable(),
  })),
  summary: z.string().nullable(),
  uncertain_fields: z.array(z.string()).default([]),
  confidence: z.number(),
});

router.post('/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'กรุณาแนบไฟล์ CV' });
    }

    if (!process.env.AI_API_KEY) {
      // Mock data fallback for Demo mode
      return res.json({
        personal: {
          title: 'นาย',
          first_name: 'สมชาย',
          last_name: 'ใจดี',
          position: 'นักวิชาการคอมพิวเตอร์ ระดับปฏิบัติการ',
          department: 'ฝ่ายพัฒนาระบบสารสนเทศ',
          organization: null,
          email: 'somchai.j@demo.example.com',
          phone: '08x-xxx-xxxx'
        },
        education: [{ degree: 'ปริญญาตรี', major: null, institution: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', year: '2565' }],
        experience: [],
        skills: [
          { name: 'Web Development', proficiency: 82, category: 'Web & System' },
          { name: 'Database Design', proficiency: 78, category: 'Web & System' },
        ],
        projects: [
          { name: 'ระบบบริหารงานออนไลน์สำนักฝึกอบรม', role: 'Developer', year: '2566', description: 'พัฒนาด้วย Node.js + React', technologies: [] }
        ],
        certifications: [],
        languages: [],
        summary: 'Demo Mock Data',
        uncertain_fields: [],
        confidence: 0.99
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });
    const model = process.env.AI_MODEL || 'gemini-3.8-flash';

    const mimeType = req.file.mimetype;
    const base64Data = req.file.buffer.toString('base64');
    
    let response;
    let retries = 3;
    let delay = 2000;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: model,
          contents: [
            cvExtractPrompt,
            "สกัดข้อมูลจากเอกสาร CV ที่แนบมานี้ตาม schema ที่กำหนด",
            { inlineData: { data: base64Data, mimeType: mimeType } }
          ],
          config: {
            temperature: 0.1,
          }
        });
        break; // Success, exit loop
      } catch (err) {
        if (err.status === 503 && retries > 1) {
          console.log(`503 High Demand. Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
          retries--;
        } else {
          throw err;
        }
      }
    }

    let text = response.text;
    // Remove ```json and ```
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsedJson;
    try {
      parsedJson = JSON.parse(text);
    } catch (err) {
      return res.status(422).json({ error: 'ผลลัพธ์จาก AI ไม่ใช่ JSON ที่ถูกต้อง' });
    }

    const validation = cvSchema.safeParse(parsedJson);
    if (!validation.success) {
      console.error(validation.error);
      return res.status(422).json({ error: 'โครงสร้างข้อมูลจาก AI ไม่ตรงตามที่กำหนด (Schema Mismatch)' });
    }

    res.json(validation.data);

  } catch (error) {
    console.error('Error parsing CV:', error);
    res.status(500).json({ error: error.message || 'เกิดข้อผิดพลาดในการประมวลผล' });
  }
});

router.post('/confirm', async (req, res) => {
  let db;
  try {
    db = await getDb();
    const data = req.body;
    
    await db.run('BEGIN TRANSACTION');
    
    // 1. Insert into personnel
    const personnelResult = await db.run(
      `INSERT INTO personnel (title, first_name, last_name, position, department, email, phone, summary) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.personal?.title,
        data.personal?.first_name,
        data.personal?.last_name,
        data.personal?.position,
        data.personal?.department,
        data.personal?.email,
        data.personal?.phone,
        data.summary
      ]
    );
    const personnelId = personnelResult.lastID;

    // 2. Insert skills
    if (data.skills && data.skills.length > 0) {
      for (const skill of data.skills) {
        await db.run(
          `INSERT INTO personnel_skills (personnel_id, name, category, proficiency) VALUES (?, ?, ?, ?)`,
          [personnelId, skill.name, skill.category, skill.proficiency]
        );
      }
    }

    // 3. Insert experience
    if (data.experience && data.experience.length > 0) {
      for (const exp of data.experience) {
        await db.run(
          `INSERT INTO personnel_experience (personnel_id, position, organization, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)`,
          [personnelId, exp.position, exp.organization, exp.start, exp.end, exp.description]
        );
      }
    }

    // 4. Insert education
    if (data.education && data.education.length > 0) {
      for (const edu of data.education) {
        await db.run(
          `INSERT INTO personnel_education (personnel_id, degree, major, institution, year) VALUES (?, ?, ?, ?, ?)`,
          [personnelId, edu.degree, edu.major, edu.institution, edu.year]
        );
      }
    }

    // 5. Insert certifications
    if (data.certifications && data.certifications.length > 0) {
      for (const cert of data.certifications) {
        await db.run(
          `INSERT INTO personnel_certifications (personnel_id, name, issuer, year) VALUES (?, ?, ?, ?)`,
          [personnelId, cert.name, cert.issuer, cert.year]
        );
      }
    }

    await db.run('COMMIT');
    res.json({ success: true, id: personnelId });
  } catch (error) {
    if (db) await db.run('ROLLBACK');
    console.error('Error confirming CV:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลงฐานข้อมูล: ' + error.message });
  }
});

export default router;
