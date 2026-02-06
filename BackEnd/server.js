import z  from 'zod';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import { pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Validation Schema
const candidateSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(18),
  email: z.string().email(),
  phone: z.string().optional(),
  skills: z.string().optional(),
  experience: z.number(),
  appliedPosition: z.string(),
  status: z.string().default('Applied'),
});

// 1. GET ALL
app.get('/api/candidates', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM candidates ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE
app.post('/api/candidates', async (req, res) => {
  try {
    const data = candidateSchema.parse(req.body);
    const query = `
      INSERT INTO candidates (name, age, email, phone, skills, experience, applied_position, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const values = [data.name, data.age, data.email, data.phone, data.skills, data.experience, data.appliedPosition, data.status];
    
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. DELETE
app.delete('/api/candidates/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM candidates WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. UPDATE
app.put('/api/candidates/:id', async (req, res) => {
  try {
    const { name, status, experience } = req.body;
    const result = await pool.query(
      'UPDATE candidates SET name=$1, status=$2, experience=$3 WHERE id=$4 RETURNING *',
      [name, status, experience, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Candidate Management System API" });
});


const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`\n================================`);
  console.log(`🚀 Server Running at Port ${PORT}`);
  console.log(`================================\n`);
});