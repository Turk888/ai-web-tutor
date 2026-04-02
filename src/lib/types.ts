export type ApiProvider = "groq" | "lovable";

export interface Program {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
  model: string;
  icon?: string;
  suggestedQuestions?: string[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatSession {
  id: string;
  programId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  defaultModel: string;
  programs: Program[];
  apiProvider: ApiProvider;
}

export const GROQ_MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B" },
  { id: "llama3-70b-8192", name: "Llama 3 70B" },
  { id: "llama3-8b-8192", name: "Llama 3 8B" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
  { id: "gemma2-9b-it", name: "Gemma 2 9B" },
] as const;

export const LOVABLE_MODELS = [
  { id: "google/gemini-3-flash-preview", name: "Gemini 3 Flash (Fast)" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
  { id: "openai/gpt-5", name: "GPT-5" },
  { id: "openai/gpt-5-nano", name: "GPT-5 Nano (Fast)" },
] as const;

export const API_PROVIDERS = [
  { id: "groq" as ApiProvider, name: "Groq (Llama/Mixtral)", description: "Fast open-source models" },
  { id: "lovable" as ApiProvider, name: "Lovable AI (Gemini/GPT)", description: "Premium AI models" },
] as const;

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: "html-css-basics",
    title: "HTML & CSS Fundamentals",
    description: "Learn the building blocks of web pages",
    systemPrompt: "You are an expert web development tutor specializing in HTML and CSS. Teach the student step by step, starting from the basics. Use code examples frequently. Ask questions to check understanding. Be encouraging and patient. Always provide working code examples that the student can try.",
    model: "llama-3.3-70b-versatile",
    icon: "🌐",
  },
  {
    id: "javascript-intro",
    title: "JavaScript for Beginners",
    description: "Master the language of the web",
    systemPrompt: "You are a JavaScript tutor. Teach JavaScript from scratch with clear explanations and runnable code examples. Cover variables, functions, DOM manipulation, events, and modern ES6+ features. Be interactive — ask the student to predict outputs and solve small challenges.",
    model: "llama-3.3-70b-versatile",
    icon: "⚡",
  },
  {
    id: "react-basics",
    title: "React Essentials",
    description: "Build modern user interfaces with React",
    systemPrompt: "You are a React.js tutor. Teach React concepts progressively: JSX, components, props, state, hooks, and effects. Always provide complete, working component examples. Explain the 'why' behind React patterns. Help students build small projects as they learn.",
    model: "llama-3.3-70b-versatile",
    icon: "⚛️",
  },
];
