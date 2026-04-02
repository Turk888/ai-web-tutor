import { useEffect, useState } from "react";
import { BookOpen, Code, Zap, CheckCircle2 } from "lucide-react";
import type { Program } from "@/lib/types";

interface Props {
  programs: Program[];
  onSelectProgram: (program: Program) => void;
}

export function WelcomeScreen({ programs, onSelectProgram }: Props) {
  const [savedProgramId, setSavedProgramId] = useState<string | null>(null);

  useEffect(() => {
    const lastProgramId = localStorage.getItem("learnai_last_program");
    setSavedProgramId(lastProgramId);
  }, []);
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="max-w-2xl w-full text-center py-4 md:py-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          AI-Powered Learning
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
          Corvit Educator
        </h2>
        <p className="text-xs text-muted-foreground mb-4">by Nehmat Ullah Khan</p>
        <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-md mx-auto">
          Choose a program below and start an interactive AI-guided course. Ask questions, get code examples, and learn at your own pace.
        </p>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => {
            const isSaved = savedProgramId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProgram(p)}
                className={`group text-left p-4 rounded-xl border transition-all ${
                  isSaved
                    ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-2xl">{p.icon || "📚"}</span>
                  {isSaved && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                </div>
                <h3 className={`font-semibold text-sm mb-1 transition-colors ${
                  isSaved ? "text-primary" : "text-foreground group-hover:text-primary"
                }`}>
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                {isSaved && (
                  <p className="text-xs text-primary mt-2 font-medium">Your last program</p>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-10 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Structured courses</span>
          <span className="flex items-center gap-1.5"><Code className="w-3.5 h-3.5" /> Code examples</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> AI-powered</span>
        </div>
      </div>
    </div>
  );
}
