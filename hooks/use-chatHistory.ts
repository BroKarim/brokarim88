import { useState, useEffect } from "react";
import { Message } from "@/types/chat";

const STORAGE_KEY = "portfolio-chat-history";

export function useChatHistory(initialMessage?: Message) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load chat history:", e);
      }
    }
    return initialMessage ? [initialMessage] : [];
  });

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear chat history?")) {
      setMessages(initialMessage ? [initialMessage] : []);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return { messages, setMessages, clearHistory };
}
