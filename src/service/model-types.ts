export interface ModelOption {
  id: string;
  name: string;
  category: string;
  model: string; 
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    category: "Live Coding Cepat, Responsif",
    id: "llamaInstant-liveCode",
    name: "Llama 3.1 8B Instant",
    model: "llama-3.1-8b-instant"
  },
  {
    category: "Live Coding Cepat, Responsif",
    id: "llama3-liveCode",
    name: "Llama 3 8B 8192",
    model: "llama-3-8b-8192"
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "gemma-logngFile",
    name: "Gemma 2 9B IT",
    model: "gemma-2-9b-it"
  },
  {
    category: "Refactor Besar / File Panjang",
    id: "llama-lingFile",
    name: "Llama 3.3 70B Versatile",
    model: "llama-3.3-70b-versatile"
  },
  {
    category: "AI Coding Assistant Pintar",
    id: "deepseek-aiCoding",
    name: "Deepseek R1 Distill Llama 70B",
    model: "deepseek-r1-distill-llama-70b"
  }
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