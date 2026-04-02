import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";
import { Bot, User } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`py-5 px-4 md:px-0 ${isUser ? "bg-chat-user" : "bg-chat-ai"}`}>
      <div className="max-w-3xl mx-auto flex gap-4">
        <div
          className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
            isUser
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary/20 text-primary"
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        <div className="prose-chat text-foreground min-w-0 flex-1 text-sm leading-relaxed">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  if (match || codeString.includes("\n")) {
                    return (
                      <CodeBlock language={match?.[1]}>
                        {codeString}
                      </CodeBlock>
                    );
                  }
                  return (
                    <code
                      className="px-1.5 py-0.5 rounded bg-secondary text-primary text-[0.85em] font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
