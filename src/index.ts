import express from 'express';
import cors from 'cors';
import axios from "axios";
import { updatePrompt } from './aiAgent';
import multer from 'multer';
import * as fs from 'fs';
import pdfImport from 'pdf-parse';

const pdf = pdfImport as unknown as (dataBuffer: Buffer) => Promise<{ text: string }>;

const app = express();
const port = 3000;

app.use(cors());

// Root route
app.get('/', (_req: any, res) => {
    res.send('Backend is running, root path does nothing yet.');
});


// --- Configuration using diskStorage ---
// Configure multer
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.post('/upload-pdf', upload.single('file'), async (req, res) => {
    try {
        //-------------------------Check file presence-------------------------
        if (!req.file) {
            res.status(400).json({error: 'No file uploaded.'});
        }
        const fileParsed = await getTextFromFile(req);

        // 1️⃣ Build the prompt dynamically
        const finalPrompt = updatePrompt(fileParsed);

        // 2️⃣ Prepare API call body
        const body = {
            prompt: finalPrompt,
            max_tokens: 16384,
            temperature: 0.01,
            num_results: 1,
            streaming: false,
            response_format: { type: 'json_object' }
        };

        // 3️⃣ External API call
        const url = 'https://agai-platform-api.dev.int.proquest.com/large-language-models/gpt_4o_2024_11_20/';
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoib25Db3Vyc2UiLCJidXNpbmVzc19pZCI6NCwiaXNzdWVkX2RhdGUiOiIwOC8xMS8yMDI1LCAwODo0ODoxMiJ9.uzVnfTTjg40WxMTZf9FK9TFlIDsrMZGLKyiySJl8oV0'
        };

        const response = await axios.post(url, body, { headers });

        // 4️⃣ Return the model’s response
        res.json(response.data);
    } catch (error:any) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to call API' });
    }
});

async function getTextFromFile(req: any){
    try {
        const filePath = req.file.path;

        // Read PDF as buffer
        const dataBuffer = fs.readFileSync(filePath) as Buffer;

        // Extract text
        const pdfData = await pdf(dataBuffer);

        // Clean up: remove file after reading
        fs.unlinkSync(filePath);

        // Send back extracted text
        return pdfData.text;
    } catch (error) {
        console.error('Error processing PDF:', error);
        return "";
    }
}

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});