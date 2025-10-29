export interface ModelOption {
  id: string;
  name: string;
  category: string;
  model: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    category: "AI Coding Assistant Pintar",
    id: "gpt-5",
    name: "GPT 5",
    model: "openai/gpt-oss-20b:free",
  },
  {
    category: "AI Coding Assistant Pintar",
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    model: "meituan/longcat-flash-chat:free",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "glm-air",
    name: "GLM 4.5 Air",
    model: "z-ai/glm-4.5-air:free",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    model: "minimax/minimax-m2:free",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "deepseek-v3",
    name: "Deepseek V3",
    model: "deepseek/deepseek-chat-v3.1:free",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "qween-a255",
    name: "Qween 3 Coder A235",
    model: "qwen/qwen3-coder:free",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "llama-4",
    name: "LLaMA 4",
    model: "meta-llama/llama-4-maverick:free",
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

export const FALLBACK_MODEL_ID = "meta-llama/llama-4-maverick:free";
