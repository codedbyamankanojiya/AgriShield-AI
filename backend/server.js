const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));

// Database Setup
const dbPath = path.resolve(__dirname, 'agrishield.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database ' + dbPath + ': ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.run(
    `CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      disease_name TEXT,
      confidence REAL,
      timestamp INTEGER,
      latitude REAL,
      longitude REAL,
      device_id TEXT,
      synced_at INTEGER
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Scans table ready.');
      }
    }
  );
}

// Routes
app.get('/', (req, res) => {
  res.send('AgriShield Backend is running.');
});

// Sync Endpoint - Receives array of offline scans
app.post('/api/sync', (req, res) => {
  const scans = req.body.scans;

  if (!Array.isArray(scans)) {
    return res.status(400).json({ error: 'Invalid payload: scans array required.' });
  }

  console.log(`Received ${scans.length} scans for sync.`);
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO scans 
     (id, disease_name, confidence, timestamp, latitude, longitude, device_id, synced_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  let successCount = 0;
  const now = Date.now();

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    scans.forEach((scan) => {
      stmt.run(
        scan.id,
        scan.disease_name,
        scan.confidence,
        scan.timestamp,
        scan.latitude ?? null,
        scan.longitude ?? null,
        scan.device_id ?? 'unknown',
        now,
        function (err) {
          if (!err) successCount++;
        }
      );
    });
    db.run('COMMIT');
    stmt.finalize();

    res.json({
      success: true,
      received: scans.length,
      synced: successCount,
      synced_at: now,
      message: `Processed ${successCount}/${scans.length} scans`,
    });
  });
});

// Recent scans
app.get('/api/scans', (req, res) => {
  db.all('SELECT * FROM scans ORDER BY timestamp DESC LIMIT 50', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Stats: counts by disease, avg confidence
app.get('/api/scans/stats', (req, res) => {
  const statsQuery = `
    SELECT disease_name, 
           COUNT(*) AS count,
           ROUND(AVG(confidence), 2) AS avg_confidence
    FROM scans
    GROUP BY disease_name
    ORDER BY count DESC
  `;

  db.all(statsQuery, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ stats: rows });
  });
});

// ... imports
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Image upload limit increased for base64 images
app.use(bodyParser.json({ limit: '50mb' }));

// ... database setup ...

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// AI Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data required' });
    }

    if (!process.env.GEMINI_API_KEY) {
       return res.status(503).json({ error: 'Server missing API Key for AI analysis' });
    }

    // Remove header if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `Analyze this plant image for disease detection.
    Focus heavily on visual symptoms and **SHAPE** of the fruit/vegetable/leaf.
    
    Structure your response EXACTLY as this JSON:
    {
      "disease_name": "Name of disease or 'Healthy'",
      "confidence": 0-100 (number),
      "reasoning": "Brief explanation citing visual shapes, colors, and patterns observed.",
      "identified_plant": "Plant name"
    }
    Do not use Markdown code blocks. Just return the JSON string.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        const jsonResponse = JSON.parse(cleanText);
        res.json(jsonResponse);
    } catch (e) {
        console.error("Failed to parse Gemini response:", text);
        res.status(500).json({ error: 'Failed to parse AI response', raw: text });
    }

  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
