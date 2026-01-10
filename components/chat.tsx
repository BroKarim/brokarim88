"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { ChatMessage } from "./chat/chat-message";
import { useChatHistory } from "@/hooks/use-chatHistory";

const WELCOME_MESSAGE = {
  role: "assistant" as const,
  content: "Hi! I'm Brokarim's portfolio assistant. Ask me anything about his work, projects, or experience!",
  timestamp: Date.now(),
};

export function Chat() {
  const { messages, setMessages, clearHistory } = useChatHistory(WELCOME_MESSAGE);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user" as const,
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage = {
        role: "assistant" as const,
        content: data.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant" as const,
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <div className="shrink-0 border-b border-white/10 px-6 py-8">
        {messages.length > 1 && (
          <button onClick={clearHistory} className="text-xs text-white/50 hover:text-white transition-colors">
            Clear History
          </button>
        )}
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {isLoading && (
          <div className="space-y-1">
            <p className="text-xs text-white/50">
              BrokarimGPT <span className="ml-2">{new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
            </p>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Sticky Bottom */}
      <div className="sticky bottom-0 p-2">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="w-full rounded-full bg-[#2a2a2a] px-6 py-3 pr-14 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </form>
      </div>
    </div>
  );
}
