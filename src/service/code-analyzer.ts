/* ──────────────────────────────────────────────────────────────────────
   code-analyzer.ts
   ──────────────────────────────────────────────────────────────────────
   useCodeAnalyzer hook for code analysis with conversation history.
   ────────────────────────────────────────────────────────────────────── */

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import {
 ChatMessage,
 ChatRequest,
} from "./ai-types";
import { BASE_PATH, buildApiMessages, DEFAULT_QUERY_OPTIONS, getHeaders } from "./ai-service";

/* ------------------------------------------------------------------ */
/* Hook: useCodeAnalyzer                                            */
/* ------------------------------------------------------------------ */

export const useCodeAnalyzer = (model: string) => {
 const systemPrompt = `You are an expert software debugger specializing in systematic problem diagnosis and resolution.

Your analysis should follow this structured approach:
1. Diagnosing Core Failure - Identify the root cause of the issue
2. Troubleshooting Case Flow - Map out the execution path and failure points
3. Identifying the Case Issue - Pinpoint the specific problem area
4. Resolving the Case Error - Provide the fix for the immediate issue
5. Implementing Case Checks - Add validation and error checking
6. Implementing Edge Case Handling - Handle unusual scenarios
7. Implementing Edge Case Logic - Add logic for boundary conditions
8. Adapting Logic - Modify existing logic to prevent similar issues
9. Refining the Approach - Improve the overall solution structure
10. Refining the Solution - Optimize and finalize the implementation

Format your responses with clear sections and provide working code examples when applicable.`;

 const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(() => [
   { role: "system", content: systemPrompt },
 ]);

 const resetConversation = useCallback(() => {
   setConversationHistory([{ role: "system", content: systemPrompt }]);
 }, [systemPrompt]);

 const mutation = useMutation({
   ...DEFAULT_QUERY_OPTIONS,
   mutationFn: async (content: string) => {
     const userMessage: ChatMessage = { role: "user", content };
     const updatedHistory = [...conversationHistory, userMessage];

     const apiMessages = buildApiMessages(updatedHistory);

     const payload: ChatRequest = {
       model,
       messages: apiMessages,
       temperature: 0.3,
       max_tokens: 10_000,
       top_p: 0.9,
       stream: false,
     };

     let response;
     try {
       response = await apiPost(`${BASE_PATH}/completions`, payload, { ...getHeaders() });
     } catch (error) {
       const axiosError = error as {
         code?: string;
         response?: { status?: number };
         message?: string;
       };
       console.error("Code Analyzer Error:", {
         message: axiosError.message || 'Unknown error',
         code: axiosError.code,
         status: axiosError.response?.status,
       });
       throw error;
     }

     if (response?.data?.choices?.[0]?.message) {
       const assistantMessage: ChatMessage = {
         role: "assistant",
         content: response.data.choices[0].message.content,
       };
       setConversationHistory((prev) => [...prev, userMessage, assistantMessage]);
     }

     return response;
   },
 });

 return {
   mutation,
   resetConversation,
 };
};
