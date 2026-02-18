
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "Your Api Key";
const genAI = new GoogleGenerativeAI(apiKey);
const modelName = "gemini-robotics-er-1.5-preview"; // The candidate

async function test() {
    console.log(`Testing candidate: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: "You are a helpful assistant." // Test SI support too
        });

        const result = await model.generateContent("Hello, who are you?");
        const response = await result.response;
        console.log(`[SUCCESS] Response: ${response.text()}`);
    } catch (error) {
        console.log(`[FAIL] ${error.message}`);
    }
}

test();
