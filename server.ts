const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const bodyParser = require('body-parser');
const cors = require('cors');
const { extractTasksFromFSD } = require('./utils/aiAgent');
const { createJiraIssues } = require('./utils/jiraApi');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// File upload configuration
const upload = multer({ storage: multer.memoryStorage() });

// Upload PDF and extract tasks
app.post('/upload-pdf', upload.single('file'), async (req:any, _res: any) => {
  console.log('📄 Uploaded file:', req.file.originalname);

  // try {
  //   // ✅ Log the uploaded file name
  //   console.log('📄 Uploaded file:', req.file.originalname);
  //
  //   const pdfBuffer = req.file.buffer;
  //   const data = await pdfParse(pdfBuffer);
  //   const pdfText = data.text;
  //
  //   // Send text to AI agent for task extraction
  //   const tasks = await extractTasksFromFSD(pdfText);
  //   res.json({ tasks });
  // } catch (err) {
  //   console.error('❌ Error while processing PDF:', err);
  //   res.status(500).json({ error: 'Failed to parse PDF or extract tasks' });
  // }
});


// Create Jira issues
app.post('/create-jira', async (req: any, res: any) => {
  try {
    const { tasks } = req.body;
    const created = await createJiraIssues(tasks);
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Jira issues' });
  }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
