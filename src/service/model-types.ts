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
    id: "nova-2-lite",
    name: "Nova 2 Lite",
    model: "amazon/nova-2-lite-v1:free",
  },
   {
    category: "AI Coding Assistant Pintar",
    id: "qwen-235b-a22b",
    name: "Qween 235B Thinking",
    model: "qwen/qwen3-235b-a22b:free",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "glm-air",
    name: "GLM 4.5 Air",
    model: "z-ai/glm-4.5-air:free",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "nous-hermes-3-1-405b",
    name: "Nous Hermes 3.1 405B",
    model: "nousresearch/hermes-3-llama-3.1-405b:free",
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "qween-coder-3-a255",
    name: "Qween 3 Coder A235",
    model: "qwen/qwen3-coder:free",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "deepseek-v3-1-nex-n1",
    name: "Deepseek v3.1 Nex N1",
    model: "nex-agi/deepseek-v3.1-nex-n1:free",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "nvidia-nemotron",
    name: "NVIDIA Nano 12B V2",
    model: "nvidia/nemotron-nano-12b-v2-vl:free",
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "kat-pilot",
    name: "KAT Pilot",
    model: "kwaipilot/kat-coder-pro:free",
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
