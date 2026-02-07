import z from 'zod';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://media-nv-candidate-management-syste-gamma.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Validation Schema 
const candidateSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(18),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')), // Empty string handle karne ke liye
  skills: z.string().optional(),
  experience: z.number().nullable().default(0), // Null allow 
  appliedPosition: z.string(),
  status: z.string().default('Applied'),
});


// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`\n[${new Date().toLocaleTimeString()}] 🛰️  Incoming ${req.method} request to: ${req.url}`);
  next();
});

// 1. GET ALL
app.get('/api/candidates', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM candidates ORDER BY created_at DESC');
    console.log(`✅ Success: Fetched ${result.rows.length} candidates from database.`);
    res.json(result.rows);
  } catch (err) {
    console.error(`❌ DB_ERROR (GET): ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE
app.post('/api/candidates', async (req, res) => {
  console.log("📥 Received Data for Onboarding:", req.body);
  
  try { // <--- Yeh 'try' hona zaroori hai
    const data = candidateSchema.parse(req.body);
    console.log("✨ Data Validation Passed!");

    const query = `
      INSERT INTO candidates (name, age, email, phone, skills, experience, applied_position, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    
    // Experience agar null hai toh 0 bhej rahe hain safety ke liye
    const values = [
      data.name, 
      data.age, 
      data.email, 
      data.phone || '', 
      data.skills || '', 
      data.experience ?? 0, 
      data.appliedPosition, 
      data.status
    ];
    
    const result = await pool.query(query, values);
    console.log(`🎉 New Candidate Onboarded: ${result.rows[0].name}`);
    res.status(201).json(result.rows[0]);

  } catch (err) { 
    if (err instanceof z.ZodError) {
      // Zod errors ko handle karne ka sahi tareeka
      const errorMessages = err.issues.map(e => `${e.path}: ${e.message}`).join(', ');
      console.warn("⚠️  Validation Failed:", errorMessages);
      return res.status(400).json({ error: errorMessages });
    } else {
      console.error(`❌ DB_ERROR (POST): ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
  }
});

// 3. DELETE
app.delete('/api/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM candidates WHERE id = $1', [id]);
    console.log(`🗑️  Candidate with ID ${id} has been removed.`);
    res.status(204).send();
  } catch (err) {
    console.error(`❌ DB_ERROR (DELETE): ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE
app.put('/api/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, experience } = req.body;
    console.log(`🔄 Updating Candidate ID ${id}...`);

    const result = await pool.query(
      'UPDATE candidates SET name=$1, status=$2, experience=$3 WHERE id=$4 RETURNING *',
      [name, status, experience, id]
    );
    
    console.log(`📝 Update Successful for: ${result.rows[0].name}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`❌ DB_ERROR (UPDATE): ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Candidate Management System API" });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`🚀  SERVER IS SOARING ON PORT ${PORT}`);
  console.log(`📂  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐  API Ready: http://localhost:${PORT}`);
  console.log(`=========================================\n`);
});