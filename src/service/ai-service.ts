import { useMutation } from "@tanstack/react-query";
import { apiPost } from "./axios-client";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const basePath = "/v1/chat";
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
}

export const useConservationAi = ( model: string) => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: (content: string) => {
      const payload: ChatRequest = {
        model: model || "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: content
          }
        ]
      };
      
      return apiPost(`${basePath}/completions`, payload, {
        'Authorization': `Bearer ${GROQ_API_KEY}`
      });
    },
  });
};