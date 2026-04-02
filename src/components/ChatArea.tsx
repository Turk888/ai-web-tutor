import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeScreen } from "./WelcomeScreen";
import type { ChatSession, Program, ChatMessage as Msg } from "@/lib/types";

interface Props {
  session: ChatSession | null;
  programs: Program[];
  isStreaming: boolean;
  onSend: (message: string) => void;
  onSelectProgram: (program: Program) => void;
}

export function ChatArea({ session, programs, isStreaming, onSend, onSelectProgram }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages, isStreaming]);

  if (!session) {
    return (
      <div className="flex-1 flex flex-col">
        <WelcomeScreen programs={programs} onSelectProgram={onSelectProgram} />
      </div>
    );
  }

  const visibleMessages = session.messages.filter((m) => m.role !== "system");
  const currentProgram = programs.find((p) => p.id === session.programId);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <span className="text-lg">{currentProgram?.icon || "📚"}</span>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{currentProgram?.title || "Chat"}</h2>
            <p className="text-xs text-muted-foreground">{currentProgram?.description}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {visibleMessages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Start your conversation below 👇
          </div>
        )}
        {visibleMessages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {isStreaming && visibleMessages[visibleMessages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSend}
        disabled={isStreaming}
        placeholder={`Ask about ${currentProgram?.title || "this topic"}...`}
      />
    </div>
  );
}
