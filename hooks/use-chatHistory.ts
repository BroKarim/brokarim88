import { useState, useEffect } from "react";
import { Message } from "@/types/chat";

const STORAGE_KEY = "portfolio-chat-history";

export function useChatHistory(initialMessage?: Message) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load data hanya sekali saat pertama kali mount (Client-side)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else if (initialMessage) {
          setMessages([initialMessage]);
        }
      } catch (e) {
        console.error("Parsing error:", e);
        if (initialMessage) setMessages([initialMessage]);
      }
    } else if (initialMessage) {
      setMessages([initialMessage]);
    }
    // Tandai bahwa inisialisasi selesai
    setIsInitialized(true);
  }, []); // Kosong agar hanya jalan sekali

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
