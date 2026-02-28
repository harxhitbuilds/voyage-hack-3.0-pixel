import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models = [
    'gemini-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
    'gemini-2.5-flash-preview-04-17',
    'gemini-2.5-flash-lite',
];

for (const m of models) {
    try {
        const r = await genAI.models.generateContent({
            model: m,
            config: { tools: [{ googleSearch: {} }] },
            contents: 'What is the capital of France? Reply in one word.',
        });
        console.log('✅ OK:', m, '->', r.text?.slice(0, 40));
    } catch (e) {
        console.error('❌ FAIL:', m, '->', e.message?.slice(0, 120));
    }
}
