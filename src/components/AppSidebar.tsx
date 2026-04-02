import { useState } from "react";
import { Plus, MessageSquare, Trash2, BookOpen, Settings, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Program, ChatSession } from "@/lib/types";

interface Props {
  programs: Program[];
  sessions: ChatSession[];
  activeSessionId: string | null;
  activeProgramId: string | null;
  onSelectProgram: (program: Program) => void;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onOpenAdmin: () => void;
}

export function AppSidebar({
  programs,
  sessions,
  activeSessionId,
  activeProgramId,
  onSelectProgram,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenAdmin,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

  const handleSelectProgram = (p: Program) => {
    onSelectProgram(p);
    setProgramsOpen(false);
  };

  if (collapsed) {
    return (
      <div className="w-14 bg-sidebar-bg border-r border-sidebar-border-color flex flex-col items-center py-3 gap-2 shrink-0">
        <button onClick={() => setCollapsed(false)} className="p-2 rounded-lg hover:bg-sidebar-hover text-sidebar-fg transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={onNewChat} className="p-2 rounded-lg hover:bg-sidebar-hover text-sidebar-fg transition-colors">
          <Plus className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <Dialog open={programsOpen} onOpenChange={setProgramsOpen}>
          <DialogTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-sidebar-hover text-sidebar-fg transition-colors">
              <GraduationCap className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select a Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-1 mt-2">
              {programs.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProgram(p)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                    activeProgramId === p.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-secondary text-foreground border border-transparent"
                  }`}
                >
                  <span className="text-xl">{p.icon || "📚"}</span>
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <button onClick={onOpenAdmin} className="p-2 rounded-lg hover:bg-sidebar-hover text-sidebar-fg transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 bg-sidebar-bg border-r border-sidebar-border-color flex flex-col shrink-0">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-sidebar-border-color">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-tight">Corvit Educator</h1>
            <p className="text-[9px] text-muted-foreground leading-tight">by Nehmat Ullah Khan</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={onNewChat} className="p-1.5 rounded-lg hover:bg-sidebar-hover text-sidebar-fg transition-colors" title="New chat">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => setCollapsed(true)} className="p-1.5 rounded-lg hover:bg-sidebar-hover text-sidebar-fg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="px-2 pt-3 flex-1 overflow-y-auto">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-2">
          Recent Chats
        </span>
        <div className="space-y-0.5 mt-1">
          {sessions.length === 0 && (
            <p className="text-xs text-muted-foreground px-3 py-2">No chats yet</p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`group flex items-center rounded-lg transition-colors ${
                activeSessionId === s.id
                  ? "bg-sidebar-hover text-foreground"
                  : "text-sidebar-fg hover:bg-sidebar-hover hover:text-foreground"
              }`}
            >
              <button
                onClick={() => onSelectSession(s)}
                className="flex-1 text-left px-3 py-2 text-sm truncate flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{s.title}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(s.id);
                }}
                className="p-1.5 mr-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border-color space-y-0.5">
        <Dialog open={programsOpen} onOpenChange={setProgramsOpen}>
          <DialogTrigger asChild>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-sidebar-fg hover:bg-sidebar-hover hover:text-foreground transition-colors flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Programs
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select a Program</DialogTitle>
            </DialogHeader>
            <div className="space-y-1 mt-2">
              {programs.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProgram(p)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                    activeProgramId === p.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-secondary text-foreground border border-transparent"
                  }`}
                >
                  <span className="text-xl">{p.icon || "📚"}</span>
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <button
          onClick={onOpenAdmin}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-sidebar-fg hover:bg-sidebar-hover hover:text-foreground transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Admin Panel
        </button>
      </div>
    </div>
  );
}
