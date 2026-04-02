export function TypingIndicator() {
  return (
    <div className="py-5 px-4 md:px-0 bg-chat-ai">
      <div className="max-w-3xl mx-auto flex gap-4">
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-primary/20 text-primary">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="6" cy="12" r="2" className="animate-pulse-dot" />
            <circle cx="12" cy="12" r="2" className="animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
            <circle cx="18" cy="12" r="2" className="animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
          </svg>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          Thinking...
        </div>
      </div>
    </div>
  );
}
