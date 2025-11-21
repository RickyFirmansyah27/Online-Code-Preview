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
    id: "grok-4.1",
    name: "Grok 4.1",
    model: "x-ai/grok-4.1-fast",
  },
  {
    category: "AI Coding Assistant Pintar",
    id: "longcat-flash",
    name: "LongCat Flash",
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
    id: "nvidia-nemotron",
    name: "NVIDIA NeMoTron Nano 12B V2 VL",
    model: "nvidia/nemotron-nano-12b-v2-vl:free",
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
  // STEALTH MODEL IS CURRENTLY UNSTABLE AND MAY CAUSE ISSUES
  {
    category: "Stealth Model (Experimental)",
    id: "stealth-kat-pilot",
    name: "KAT Pilot",
    model: "kwaipilot/kat-coder-pro:free",
  },
   {
    category: "Stealth Model (Experimental)",
    id: "stealth-sherlock-dash",
    name: "Sherlock Dash",
    model: "openrouter/sherlock-dash-alpha",
  },
   {
    category: "Stealth Model (Experimental)",
    id: "stealth-sherlock-think",
    name: "Sherlock Think",
    model: "openrouter/sherlock-think-alpha",
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
