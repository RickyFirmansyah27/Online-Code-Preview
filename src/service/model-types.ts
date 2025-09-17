export interface ModelOption {
  id: string;
  name: string;
  category: string;
  model: string;
  max_request: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    category: "AI Coding Assistant Pintar",
    id: "gpt-5",
    name: "GPT 5",
    model: "openrouter/sonoma-sky-alpha",
    max_request: "1000",
  },
  {
    category: "AI Coding Assistant Pintar",
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    model: "qwen/qwen3-coder:free",
    max_request: "1000",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "glm-air",
    name: "GLM Air",
    model: "z-ai/glm-4.5-air:free",
    max_request: "1000",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    model: "openrouter/sonoma-dusk-alpha",
    max_request: "1000",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "deepseek-v3",
    name: "Deepseek V3",
    model: "deepseek/deepseek-chat-v3.1:free",
    max_request: "1000",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "llama-4",
    name: "LLaMA 4",
    model: "meta-llama/llama-4-scout:free",
    max_request: "1000",
  },
];

export interface ApiFile {
  name: string;
  size: number | null;
  lastModified: string;
  url: string;
  type: string | null;
}

export interface FileResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: ApiFile[];
}

export const FALLBACK_MODEL_ID = "openai/gpt-4o-mini";
