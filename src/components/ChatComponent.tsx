import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaRobot, FaUser, FaImage } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import useChatbot from "../hooks/useChatbot";
import Layout from "./Layout";

const ChatComponent = () => {
  const { messages, sendMessage, status } = useChatbot();
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  const handleSend = async () => {
    if (input.trim() || selectedImage) {
      const msg = input;
      const img = selectedImage;
      setInput("");
      setSelectedImage(null);
      await sendMessage(msg, img || undefined);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => setSelectedImage(e.target?.result as string);
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout chatbotState={{ messages, sendMessage, status }}>
      <div className="flex flex-col h-full" onPaste={handlePaste}>
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 p-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
            <FaRobot /> Access.AI Assistant
          </h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-neutral-800 text-gray-100 rounded-bl-none"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                  {msg.sender === "user" ? <FaUser /> : <FaRobot />}
                  <span>{msg.sender === "user" ? "You" : "Access.AI"}</span>
                </div>

                {msg.image && (
                  <img src={msg.image} alt="User upload" className="max-w-full rounded-lg mb-2 border border-white/10" />
                )}

                <div className="markdown-body text-sm leading-relaxed overflow-hidden">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {status !== 'idle' && status !== 'receiving' && status !== 'formatted' && (
            <div className="flex justify-start">
              <div className="bg-neutral-800/50 p-3 rounded-2xl rounded-bl-none text-gray-400 text-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800">
          {selectedImage && (
            <div className="mb-2 relative inline-block">
              <img src={selectedImage} alt="Preview" className="h-20 rounded-lg border border-neutral-700" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <label className="p-3 bg-neutral-800 text-gray-400 rounded-xl hover:bg-neutral-700 cursor-pointer transition-colors">
              <FaImage size={20} />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything or paste an image..."
              className="flex-1 bg-neutral-800 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-neutral-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() && !selectedImage}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
          <p className="text-xs text-neutral-500 text-center mt-2">
            Powered by Google Gemini 2.5 Flash
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ChatComponent;
