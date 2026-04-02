import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatArea } from "@/components/ChatArea";
import { getSettings, getSessions, saveSession, deleteSession as deleteSessionStorage } from "@/lib/storage";
import { streamChat } from "@/lib/chat";
import type { Program, ChatSession, ChatMessage } from "@/lib/types";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Index() {
  const navigate = useNavigate();
  const [settings] = useState(getSettings());
  const [sessions, setSessions] = useState<ChatSession[]>(getSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  const refreshSessions = () => setSessions(getSessions());

  // Auto-select last used program on mount
  useEffect(() => {
    const lastProgramId = localStorage.getItem("learnai_last_program");
    if (lastProgramId && !activeSessionId) {
      const program = settings.programs.find((p) => p.id === lastProgramId);
      if (program) {
        // Find existing session for this program or create one
        const existing = sessions.find((s) => s.programId === lastProgramId);
        if (existing) {
          setActiveSessionId(existing.id);
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
          refreshSessions();
          setActiveSessionId(session.id);
        }
      }
    }
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
    <div className="h-screen flex overflow-hidden">
      <AppSidebar
        programs={settings.programs}
        sessions={sessions}
        activeSessionId={activeSessionId}
        activeProgramId={activeSession?.programId || null}
        onSelectProgram={handleSelectProgram}
        onSelectSession={(s) => setActiveSessionId(s.id)}
        onNewChat={() => setActiveSessionId(null)}
        onDeleteSession={handleDeleteSession}
        onOpenAdmin={() => navigate("/admin")}
      />
      <ChatArea
        session={activeSession}
        programs={settings.programs}
        isStreaming={isStreaming}
        onSend={handleSend}
        onSelectProgram={handleSelectProgram}
      />
    </div>
  );
}
