import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  text: string;
  sender: "user" | "bot";
  image?: string; // Base64 string
}

const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<"idle" | "formatted" | "sending" | "processing" | "receiving">("idle");

  const sendMessage = async (message: string, image?: string) => {
    setStatus("formatted"); // Capturing input
    const newMessages: Message[] = [ // Add message immediately
      ...messages,
      { text: message, sender: "user", image }, // Store image in message
    ];
    setMessages(newMessages);

    try {
      setStatus("sending"); // Connecting to API
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

      // Simulate network delay for visualization purposes (optional, makes demo clearer)
      await new Promise(r => setTimeout(r, 600));

      setStatus("processing"); // AI is thinking

      //INTEGRATION OF AI WITH REACT
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const promptParts: any[] = [message];
      if (image) {
        // Convert Base64 to GenerativePart
        const base64Data = image.split(",")[1]; // Remove "data:image/jpeg;base64," prefix
        promptParts.push({
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg", // Assume jpeg/png for now, browser handles mostly
          }
        });
      }

      const result = await model.generateContent(promptParts);
      const response = await result.response;
      const text = response.text();

      setStatus("receiving"); // Rendering response
      await new Promise(r => setTimeout(r, 400)); // Short delay to show "receiving" state

      setMessages([...newMessages, { text: text, sender: "bot" }]);
      setStatus("idle");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([...newMessages, { text: "Error: Failed to get response.", sender: "bot" }]);
      setStatus("idle");
    }
  };

  return { messages, sendMessage, status };
};

export default useChatbot;
