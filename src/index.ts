import express from 'express';
import cors from 'cors';
import axios from "axios";
import { updatePrompt } from './aiAgent';

const app = express();
const port = 3000;

app.use(cors());

// Root route
app.get('/', (_req: any, res) => {
    res.send('Backend is running, root path does nothing yet.');
});
app.post('/upload-pdf', async (_req, res) => {
    try {
        // Example: syllabus text comes from frontend request body
       const fileParsed = "Preliminaries\n" +
           "Story\n" +
           "Esploro customer base is widening and need to offer more multi language and multi-script functionality for the researcher profile.\n" +
           "Requirements (Business, Technical, Security)\n" +
           "Add new fields for Additional Name - can be added and edited by Researcher and by Admin\n" +
           "Make existing fields translatable using existing functionality for labels and translations - admin will be able to enter the (using the globe - like in\n" +
           "asset). Researcher interface is phase 2.\n" +
           "Researcher description (about my research) separate Jira for August\n" +
           "Display title\n" +
           "KeywordsResearcher topics - in progress URM-244103 and URM-245719 - [RV] Add language to topic lookup API CLOSED\n" +
           "(not currently in scope) Other free text fields that are not currently translatable (affiliation title, website title, website description, education\n" +
           "field of study, qualification certificate, additional details, honors title)\n" +
           "Provide configuration for multi-lingual/multi-script display on Profiles\n" +
           "Add new fields and translations to SIS loader, API, CSV,\n" +
           "Add new Additional Name fields to the CV (need to open a Jira for this)\n" +
           "Index the additional name fields\n" +
           "Flatten and map to analytics\n" +
           "Assumptions/Restrictions/Related terms\n" +
           "Additional name field can be used for non-latin scripts or for latin scripts\n" +
           "Additional names are not used in Smart Harvesting - if the alternate name value should be used in SH then it will have to be entered in both fields -\n" +
           "additional and variant\n" +
           "The additional name field will have all configurable options available for other fields in the researcher – changes tracker, update through the profile, control\n" +
           "over if it is editable"
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


app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
