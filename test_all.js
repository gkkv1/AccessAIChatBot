
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyAseTAu8TSf8IlRgP8qjuDtMiLRxNjbUgY";
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    let models = [];
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.models) throw new Error("No models returned");
        models = data.models.map(m => m.name.replace("models/", ""));
    } catch (e) {
        console.log("Failed to list models: " + e.message);
        return;
    }

    console.log(`Found ${models.length} models. Testing candidates...`);

    // Filter keys
    const candidates = models.filter(m =>
        (m.includes("gemini") || m.includes("gemma")) &&
        !m.includes("embedding") &&
        !m.includes("imagen")
    );

    // Sort
    candidates.sort((a, b) => {
        if (a.includes("1.5") && !b.includes("1.5")) return -1;
        return 0;
    });

    for (const modelName of candidates) {
        console.log(`Testing: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            await result.response;
            console.log(`[PASS] !!!`);
            console.log(`>>> FOUND WORKING MODEL: ${modelName} <<<`);
            return;
        } catch (e) {
            let msg = e.message || "Unknown";
            if (msg.includes("404")) msg = "404 Not Found";
            else if (msg.includes("429") || msg.toLowerCase().includes("quota")) msg = "Quota Exceeded";
            else if (msg.includes("fetch failed")) msg = "Fetch Failed";
            else msg = msg.substring(0, 40);
            console.log(`[FAIL] ${msg}`);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
}

test();
