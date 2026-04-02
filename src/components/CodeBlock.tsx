import { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const isDarkTheme = useMemo(() => {
    return !document.documentElement.classList.contains('light');
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden my-3 border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-code-header">
        <span className="text-xs text-muted-foreground font-mono">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={isDarkTheme ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: isDarkTheme ? "hsl(220, 15%, 6%)" : "hsl(220, 13%, 93%)",
          fontSize: "0.85rem",
          padding: "1rem",
        }}
        wrapLongLines
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
