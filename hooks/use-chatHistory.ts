import { useCallback, useState } from "react";
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

  const updateMessages: typeof setMessages = useCallback((value) => {
    setMessages((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (next.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    if (confirm("Hapus semua percakapan?")) {
      const resetMessage = initialMessage ? [initialMessage] : [];
      setMessages(resetMessage);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [initialMessage]);

  return { messages, setMessages: updateMessages, clearHistory };
}
