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
    model: "openai/gpt-oss-120b",
    max_request: "1000",
  },
  {
    category: "AI Coding Assistant Pintar",
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    model: "moonshotai/kimi-k2-instruct",
    max_request: "1000",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "mistral-large",
    name: "Mistral Large",
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_request: "1000",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    model: "llama-3.3-70b-versatile",
    max_request: "1000",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "deepseek-v3",
    name: "Deepseek V3",
    model: "deepseek-r1-distill-llama-70b",
    max_request: "1000",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "llama-4",
    name: "LLaMA 4",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    max_request: "1000",
  },
];

export interface File {
  name: string;
  size: number;
  lastModified: string;
  url: string;
}

export interface FileResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: File[];
}
