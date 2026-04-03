import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeScreen } from "./WelcomeScreen";
import { MessageSquareText } from "lucide-react";
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
      <div className="flex-1 flex flex-col min-h-0">
        <WelcomeScreen programs={programs} onSelectProgram={onSelectProgram} />
      </div>
    );
  }

  const visibleMessages = session.messages.filter((m) => m.role !== "system");
  const currentProgram = programs.find((p) => p.id === session.programId);
  const suggestedQuestions = currentProgram?.suggestedQuestions || [];
  const showSuggestions = visibleMessages.length === 0 && suggestedQuestions.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header - Desktop only */}
      <div className="border-b border-border px-3 md:px-4 py-2 md:py-3 bg-background/80 backdrop-blur-sm hidden md:block shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <span className="text-lg">{currentProgram?.icon || "📚"}</span>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{currentProgram?.title || "Chat"}</h2>
            <p className="text-xs text-muted-foreground">{currentProgram?.description}</p>
          </div>
        </div>
      </div>

      {/* Messages - scrollable area */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {visibleMessages.length === 0 && !showSuggestions && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm px-4">
            Start your conversation below 👇
          </div>
        )}
        {showSuggestions && (
          <div className="flex items-center justify-center h-full p-4 md:p-6">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-6">
                <MessageSquareText className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-foreground">How can I help you today?</h3>
                <p className="text-sm text-muted-foreground">Pick a question or type your own below</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => onSend(q)}
                    className="text-left px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
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

      {/* Input - fixed at bottom, respects safe area */}
      <div className="border-t border-border bg-background px-2 md:px-4 py-2 md:py-3 shrink-0 pb-[env(safe-area-inset-bottom,8px)]">
        <ChatInput
          onSend={onSend}
          disabled={isStreaming}
          placeholder={`Ask about ${currentProgram?.title || "this topic"}...`}
        />
      </div>
    </div>
  );
}
