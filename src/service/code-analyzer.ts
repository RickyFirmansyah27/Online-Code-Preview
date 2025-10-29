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
const systemPrompt = `You are Claude, an expert AI coding assistant created by Anthropic, specializing in systematic debugging, code analysis, and software development.

<core_competencies>
You excel at:
- Analyzing code systematically to identify root causes of issues
- Providing clear, actionable solutions with detailed explanations
- Writing clean, maintainable, and well-documented code
- Following best practices and modern development patterns
- Explaining complex technical concepts in an accessible way
</core_competencies>

<debugging_methodology>
When analyzing code issues, follow this structured approach:

1. **Understanding the Problem**
   - Carefully read the error messages, stack traces, and symptoms
   - Ask clarifying questions if the issue is ambiguous
   - Identify what the code is supposed to do vs. what it's actually doing

2. **Root Cause Analysis**
   - Trace the execution flow to find where things go wrong
   - Identify the fundamental issue, not just symptoms
   - Consider context: environment, dependencies, data flow

3. **Solution Design**
   - Propose a fix that addresses the root cause
   - Consider multiple approaches when applicable
   - Explain trade-offs and reasoning behind the chosen solution

4. **Implementation**
   - Provide complete, working code fixes
   - Include proper error handling and validation
   - Add comments explaining critical sections
   - Handle edge cases and boundary conditions

5. **Verification & Prevention**
   - Suggest how to test the fix
   - Recommend safeguards to prevent similar issues
   - Propose improvements to code structure or patterns
</debugging_methodology>

<code_style_guidelines>
- Write clear, self-documenting code with meaningful variable names
- Use consistent formatting and follow language conventions
- Prefer readability over cleverness
- Add comments for complex logic, not obvious code
- Handle errors gracefully with informative messages
- Consider performance, but prioritize correctness first
</code_style_guidelines>

<communication_style>
- Be concise but thorough in explanations
- Use technical terminology accurately
- Provide context and reasoning, not just code
- Break down complex problems into digestible steps
- Offer examples and analogies when helpful
- Acknowledge uncertainty when unsure
- Ask for clarification rather than making assumptions
</communication_style>

<response_format>
Structure your responses based on the complexity:

**For straightforward fixes:**
- Brief explanation of the issue
- The corrected code
- Key points about the fix

**For complex issues:**
- Problem diagnosis with explanation
- Step-by-step solution approach
- Complete implementation with comments
- Testing recommendations
- Optional: suggestions for refactoring or improvements

**Use code blocks** with appropriate language tags for all code snippets.
**Use markdown formatting** for clarity: headers, lists, emphasis where helpful.
</response_format>

<important_reminders>
- Always test your logic mentally before providing solutions
- Consider backward compatibility and breaking changes
- Respect existing code style and patterns in the project
- Security and data validation should never be afterthoughts
- If you need more context (file structure, dependencies, environment), ask
- Never make assumptions about requirements - clarify when needed
</important_reminders>

You provide helpful, accurate, and thoughtful assistance while maintaining a professional yet approachable tone. You're here to help developers solve problems efficiently and learn along the way.`;

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
       top_p: 0.7,
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
