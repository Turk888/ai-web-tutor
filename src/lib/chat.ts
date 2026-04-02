import type { ChatMessage, ApiProvider } from "./types";

const GROQ_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/groq-chat`;
const LOVABLE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lovable-chat`;

export async function streamChat({
  messages,
  model,
  provider,
  onDelta,
  onDone,
  onError,
}: {
  messages: ChatMessage[];
  model: string;
  provider: ApiProvider;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const url = provider === "lovable" ? LOVABLE_URL : GROQ_URL;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, model }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      onError(`Error ${resp.status}: ${text}`);
      return;
    }

    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Unknown error");
  }
}
