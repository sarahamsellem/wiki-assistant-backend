import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

// Root route
app.get('/', (_req: any, res) => {
    res.send('Backend is running, root path does nothing yet.');
});

// Upload PDF route (does nothing yet)
app.post('/upload-pdf', (_req: any, res) => {
    res.send('Upload PDF endpoint is not implemented yet.');
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
