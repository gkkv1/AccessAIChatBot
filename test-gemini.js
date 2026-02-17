import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'node:fs';
import path from 'node:path';

async function testGemini() {
    console.log("Starting Gemini Model Test...");

    // Load .env manually
    const envPath = path.resolve(process.cwd(), '.env');
    let apiKey = "";
    try {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const envVars = envContent.split('\n').reduce((acc, line) => {
            const [key, value] = line.split('=');
            if (key && value) {
                acc[key.trim()] = value.trim();
            }
            return acc;
        }, {});
        apiKey = envVars.VITE_GEMINI_API_KEY;
    } catch (e) {
        console.error("Could not read .env file");
        return;
    }

    if (!apiKey) {
        console.error("Error: VITE_GEMINI_API_KEY is not set.");
        return;
    }

    console.log("API Key found: " + apiKey.substring(0, 8) + "...");
    const genAI = new GoogleGenerativeAI(apiKey);

    // List found models first for clarity
    console.log("\n--- Listing Models via REST ---");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            console.log("REST List failed: " + response.status);
        } else {
            const data = await response.json();
            if (data.models) {
                data.models.forEach(m => {
                    if (m.name.includes("gemini") && !m.name.includes("preview")) {
                        console.log("FOUND: " + m.name);
                    }
                });
                // Log previews too but separately if needed, or just log all
            }
        }
    } catch (e) { console.error("List failed", e); }

    console.log("\n--- Testing Generation ---");
    // Candidate list based on common availability and findings
    const candidates = [
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-pro",
        "gemini-1.5-pro",
        "gemini-2.5-flash" // Saw this in logs
    ];

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName} ... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`SUCCESS! Response: ${response.text().substring(0, 15)}...`);
            // We found a working one!
            // Continue testing others? No, let's just find one that works.
        } catch (e) {
            console.log(`FAILED. (${e.message.split(' ')[0]}...)`);
        }
    }
}

testGemini();
