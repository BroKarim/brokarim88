import { useState, useEffect } from "react";
import { Message } from "@/types/chat";

const STORAGE_KEY = "portfolio-chat-history";

export function useChatHistory(initialMessage?: Message) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") {
      return initialMessage ? [initialMessage] : [];
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Parsing error:", e);
    }
    return initialMessage ? [initialMessage] : [];
  });
  const [isInitialized] = useState(() => typeof window !== "undefined");

  // 2. Simpan ke localStorage HANYA jika sudah inisialisasi dan pesan berubah
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  const clearHistory = () => {
    if (confirm("Hapus semua percakapan?")) {
      const resetMessage = initialMessage ? [initialMessage] : [];
      setMessages(resetMessage);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return { messages, setMessages, clearHistory, isInitialized };
}
