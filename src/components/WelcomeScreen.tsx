import { BookOpen, Code, Zap } from "lucide-react";
import type { Program } from "@/lib/types";

interface Props {
  programs: Program[];
  onSelectProgram: (program: Program) => void;
}

export function WelcomeScreen({ programs, onSelectProgram }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          AI-Powered Learning
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-1">
          Corvit Educator
        </h2>
        <p className="text-xs text-muted-foreground mb-4">by Nehmat Ullah Khan</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Choose a program below and start an interactive AI-guided course. Ask questions, get code examples, and learn at your own pace.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProgram(p)}
              className="group text-left p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all"
            >
              <span className="text-2xl mb-2 block">{p.icon || "📚"}</span>
              <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-xs text-muted-foreground">{p.description}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-10 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Structured courses</span>
          <span className="flex items-center gap-1.5"><Code className="w-3.5 h-3.5" /> Code examples</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> AI-powered</span>
        </div>
      </div>
    </div>
  );
}
