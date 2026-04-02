import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2, Lock } from "lucide-react";
import { getSettings, saveSettings } from "@/lib/storage";
import { GROQ_MODELS, type AppSettings, type Program } from "@/lib/types";

const ADMIN_PASSWORD = "Nehmat@Truk";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [saved, setSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addProgram = () => {
    const newProgram: Program = {
      id: `program-${Date.now()}`,
      title: "New Program",
      description: "Program description",
      systemPrompt: "You are a helpful tutor.",
      model: settings.defaultModel,
      icon: "📚",
    };
    setSettings({ ...settings, programs: [...settings.programs, newProgram] });
    setEditingProgram(newProgram);
  };

  const updateProgram = (updated: Program) => {
    setSettings({
      ...settings,
      programs: settings.programs.map((p) => (p.id === updated.id ? updated : p)),
    });
    setEditingProgram(updated);
  };

  const deleteProgram = (id: string) => {
    setSettings({
      ...settings,
      programs: settings.programs.filter((p) => p.id !== id),
    });
    if (editingProgram?.id === id) setEditingProgram(null);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Enter password to continue</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:border-primary/50"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            Login
          </button>
          <button type="button" onClick={() => navigate("/")} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to app
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Settings + Program List */}
        <div className="space-y-6">
          {/* Default Model */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Default AI Model</h3>
            <select
              value={settings.defaultModel}
              onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none"
            >
              {GROQ_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Programs */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Programs</h3>
              <button onClick={addProgram} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {settings.programs.map((p) => (
                <div
                  key={p.id}
                  className={`group flex items-center rounded-lg transition-colors cursor-pointer ${
                    editingProgram?.id === p.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <button
                    onClick={() => setEditingProgram(p)}
                    className="flex-1 text-left px-3 py-2 text-sm truncate"
                  >
                    {p.icon} {p.title}
                  </button>
                  <button
                    onClick={() => deleteProgram(p.id)}
                    className="p-1.5 mr-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Program Editor */}
        <div className="p-6 rounded-xl bg-card border border-border">
          {editingProgram ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Edit Program</h3>
              
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Icon (emoji)</label>
                <input
                  value={editingProgram.icon || ""}
                  onChange={(e) => updateProgram({ ...editingProgram, icon: e.target.value })}
                  className="w-20 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Title</label>
                <input
                  value={editingProgram.title}
                  onChange={(e) => updateProgram({ ...editingProgram, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <input
                  value={editingProgram.description}
                  onChange={(e) => updateProgram({ ...editingProgram, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">AI Model</label>
                <select
                  value={editingProgram.model}
                  onChange={(e) => updateProgram({ ...editingProgram, model: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none"
                >
                  {GROQ_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">System Prompt</label>
                <textarea
                  value={editingProgram.systemPrompt}
                  onChange={(e) => updateProgram({ ...editingProgram, systemPrompt: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none resize-y"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              Select a program to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
