import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatArea } from "@/components/ChatArea";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSettings, getSessions, saveSession, deleteSession as deleteSessionStorage } from "@/lib/storage";
import { streamChat } from "@/lib/chat";
import type { Program, ChatSession, ChatMessage } from "@/lib/types";
import { Menu } from "lucide-react";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Index() {
  const navigate = useNavigate();
  const [settings] = useState(getSettings());
  const [sessions, setSessions] = useState<ChatSession[]>(getSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const refreshSessions = () => setSessions(getSessions());

  // Auto-select last used program on mount
  useEffect(() => {
    const lastProgramId = localStorage.getItem("learnai_last_program");
    if (lastProgramId) {
      const program = settings.programs.find((p) => p.id === lastProgramId);
      if (program) {
        const existingSessions = getSessions();
        const existing = existingSessions.find((s) => s.programId === lastProgramId);
        if (existing) {
          setActiveSessionId(existing.id);
          setSessions(existingSessions);
        } else {
          const session: ChatSession = {
            id: generateId(),
            programId: program.id,
            title: program.title,
            messages: [{ role: "system", content: program.systemPrompt }],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          saveSession(session);
          setSessions(getSessions());
          setActiveSessionId(session.id);
        }
      }
    }
    setIsInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createSession = useCallback(
    (program: Program): ChatSession => {
      const session: ChatSession = {
        id: generateId(),
        programId: program.id,
        title: program.title,
        messages: [{ role: "system", content: program.systemPrompt }],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      localStorage.setItem("learnai_last_program", program.id);
      saveSession(session);
      refreshSessions();
      setActiveSessionId(session.id);
      return session;
    },
    []
  );

  const handleSelectProgram = useCallback(
    (program: Program) => {
      localStorage.setItem("learnai_last_program", program.id);
      createSession(program);
    },
    [createSession]
  );

  const handleSend = useCallback(
    (content: string) => {
      if (!activeSession || isStreaming) return;

      const userMsg: ChatMessage = { role: "user", content };
      const updatedMessages = [...activeSession.messages, userMsg];
      const updated: ChatSession = {
        ...activeSession,
        messages: updatedMessages,
        title: activeSession.messages.filter((m) => m.role === "user").length === 0
          ? content.slice(0, 40)
          : activeSession.title,
        updatedAt: Date.now(),
      };
      saveSession(updated);
      refreshSessions();

      setIsStreaming(true);
      let assistantContent = "";

      const program = settings.programs.find((p) => p.id === activeSession.programId);

      streamChat({
        messages: updatedMessages,
        model: program?.model || settings.defaultModel,
        provider: settings.apiProvider,
        onDelta: (chunk) => {
          assistantContent += chunk;
          const withAssistant: ChatSession = {
            ...updated,
            messages: [
              ...updatedMessages,
              { role: "assistant", content: assistantContent },
            ],
            updatedAt: Date.now(),
          };
          saveSession(withAssistant);
          refreshSessions();
        },
        onDone: () => {
          setIsStreaming(false);
        },
        onError: (err) => {
          const errorMsg: ChatSession = {
            ...updated,
            messages: [
              ...updatedMessages,
              { role: "assistant", content: `⚠️ Error: ${err}` },
            ],
            updatedAt: Date.now(),
          };
          saveSession(errorMsg);
          refreshSessions();
          setIsStreaming(false);
        },
      });
    },
    [activeSession, isStreaming, settings]
  );

  const handleDeleteSession = useCallback((id: string) => {
    deleteSessionStorage(id);
    refreshSessions();
    if (activeSessionId === id) setActiveSessionId(null);
  }, [activeSessionId]);

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[280px]
        md:static md:z-auto md:w-72
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <AppSidebar
          programs={settings.programs}
          sessions={sessions}
          activeSessionId={activeSessionId}
          activeProgramId={activeSession?.programId || null}
          onSelectProgram={(program) => {
            handleSelectProgram(program);
            setSidebarOpen(false);
          }}
          onSelectSession={(s) => {
            localStorage.setItem("learnai_last_program", s.programId);
            setActiveSessionId(s.id);
            setSidebarOpen(false);
          }}
          onNewChat={() => {
            setActiveSessionId(null);
            setSidebarOpen(false);
          }}
          onDeleteSession={handleDeleteSession}
          onOpenAdmin={() => {
            navigate("/admin");
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 px-3 py-2.5 border-b border-border bg-background shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-sm font-semibold text-foreground truncate flex-1">
            {activeSession
              ? settings.programs.find(p => p.id === activeSession.programId)?.title
              : 'Corvit Educator'}
          </h1>
          <ThemeToggle />
        </div>

        <ChatArea
          session={activeSession}
          programs={settings.programs}
          isStreaming={isStreaming}
          onSend={handleSend}
          onSelectProgram={(program) => {
            handleSelectProgram(program);
            setSidebarOpen(false);
          }}
        />
      </div>
    </div>
  );
}
