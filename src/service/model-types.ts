export interface ModelOption {
  id: string;
  name: string;
  category: string;
  model: string;
  max_request: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
    {
    category: "Refactor Besar / File Panjang",
    id: "mistral-large",
    name: "Mistral Large",
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_request: "1000"
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    model: "llama-3.3-70b-versatile",
    max_request: "1000"
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "deepseek-v3",
    name: "Deepseek V3",
    model: "deepseek-r1-distill-llama-70b",
    max_request: "1000"
  },
  {
    category: "AI Coding Assistant Pintar",
    id: "gpt-4o",
    name: "GTP 4o",
    model: "compound-beta-mini",
    max_request: "200"
  },
  {
    category: "AI Coding Assistant Pintar",
    id: "claude-sonnet-3-7",
    name: "Claude Sonnet 3.7",
    model: "compound-beta",
    max_request: "200"
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "llama-3-1",
    name: "LLaMA 3.1",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    max_request: "1000"
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