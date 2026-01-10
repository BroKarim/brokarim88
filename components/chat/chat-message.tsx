// components/chat/ChatMessage.tsx
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const time = new Date(message.timestamp).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-3">
          <p className="text-sm text-primary-foreground whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="space-y-1">
      <p className="text-xs text-white/50">
        BrokarimGPT <span className="ml-2">{time}</span>
      </p>
      <p className="text-white whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
    </div>
  );
}
