import { AppSettings, ChatSession, DEFAULT_PROGRAMS } from "./types";

const SETTINGS_KEY = "learnai_settings";
const SESSIONS_KEY = "learnai_sessions";

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const defaults: AppSettings = {
    defaultModel: "llama-3.3-70b-versatile",
    programs: DEFAULT_PROGRAMS,
    apiProvider: "groq",
  };
  saveSettings(defaults);
  return defaults;
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function saveSession(session: ChatSession) {
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  saveSessions(sessions);
}

export function deleteSession(id: string) {
  saveSessions(getSessions().filter((s) => s.id !== id));
}
