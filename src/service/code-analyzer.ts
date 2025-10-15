/* ──────────────────────────────────────────────────────────────────────
   code-analyzer.ts
   ──────────────────────────────────────────────────────────────────────
   useCodeAnalyzer hook for single-shot code analysis.
   ────────────────────────────────────────────────────────────────────── */

import { useMutation } from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import {
  ApiChatMessage,
  ChatRequest,
} from "./ai-types";

/* ------------------------------------------------------------------ */
/* Constants                                                        */
/* ------------------------------------------------------------------ */

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const BASE_PATH = "/v1/chat";

/* ------------------------------------------------------------------ */
/* Helper Functions                                                */
/* ------------------------------------------------------------------ */

/**
 * Build the headers used for every request.
 */
const getHeaders = (): Record<string, string> => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://online-code-preview.vercel.app",
  "X-Title": "Online Code Editor",
});

/* ------------------------------------------------------------------ */
/* Hook: useCodeAnalyzer                                            */
/* ------------------------------------------------------------------ */

export const useCodeAnalyzer = (model: string) => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: async (code: string) => {
      const analysisPrompt = `Analyze the following code and provide:
      - Diagnosing Core Failure
      - Unpacking the Error's Source
      - Troubleshooting Case Flow
      - Identifying the Case Issue
      - Resolving the Case Error
      - Addressing Case Constancy
      - Implementing Case Checks
      - Implementing Edge Case Handling
      - Implementing Edge Case Logic
      - Adapting Logic
      - Refining the Approach
      - Refining the Solution

      Code to analyze:
      \`\`\`
      ${code}
      \`\`\``;

      const payload: ChatRequest = {
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a code review expert. Provide thorough, constructive analysis focusing on code quality, security, and performance",
          },
          { role: "user", content: analysisPrompt },
        ] as ApiChatMessage[],
        temperature: 0.3,
        max_tokens: 10_000,
        top_p: 0.9,
        stream: false,
      };

      return await apiPost(`${BASE_PATH}/completions`, payload, {
        ...getHeaders(),
      });
    },
  });
};
