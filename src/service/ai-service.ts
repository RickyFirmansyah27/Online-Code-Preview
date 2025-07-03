import { useMutation } from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import { useState } from "react";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const basePath = "/v1/chat";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
}

interface ConversationContext {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export const useConversationAi = (model: string) => {
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    [
      {
        role: "system",
        content: `You are an expert coding assistant. Always provide:
                  1. Clear, well-commented code solutions
                  3. Best practices and potential optimizations
                  4. Error handling considerations
                  5. Testing suggestions when applicable

                  Format your responses with proper code blocks and be concise but thorough.`,
      },
    ]
  );

  const conversationContext: ConversationContext = {
    messages: conversationHistory,
    addMessage: (message: ChatMessage) => {
      setConversationHistory((prev) => [...prev, message]);
    },
    clearMessages: () => {
      setConversationHistory([
        {
          role: "system",
          content: `You are an expert coding assistant. Always provide:
                    1. Clear, well-commented code solutions
                    3. Best practices and potential optimizations
                    4. Error handling considerations
                    5. Testing suggestions when applicable

                    Format your responses with proper code blocks and be concise but thorough.`,
        },
      ]);
    },
  };

  return {
    ...useMutation({
      ...DEFAULT_QUERY_OPTIONS,
      mutationFn: async (content: string) => {
        const userMessage: ChatMessage = {
          role: "user",
          content: content,
        };

        const updatedHistory = [...conversationHistory, userMessage];

        const payload: ChatRequest = {
          model: model,
          messages: updatedHistory,
          temperature: 0.1,
          max_tokens: 2000,
          top_p: 0.9,
          stream: false,
        };

        try {
          const response = await apiPost(`${basePath}/completions`, payload, {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          });

          if (response?.data?.choices?.[0]?.message) {
            const assistantMessage: ChatMessage = {
              role: "assistant",
              content: response.data.choices[0].message.content,
            };

            setConversationHistory((prev) => [
              ...prev,
              userMessage,
              assistantMessage,
            ]);
          }

          return response;
        } catch (error) {
          console.error("AI API Error:", error);
          throw error;
        }
      },
      onError: (error) => {
        console.error("Conversation AI Error:", error);
      },
    }),
    conversationContext,
    resetConversation: () => conversationContext.clearMessages(),
    getLastResponse: () => {
      const lastMessage = conversationHistory[conversationHistory.length - 1];
      return lastMessage?.role === "assistant" ? lastMessage.content : null;
    },
  };
};

export const useCodingAssistant = (
  model: string,
  programmingLanguage?: string
) => {
  const systemPrompt = `You are a senior software engineer and coding mentor specializing in ${programmingLanguage || "multiple programming languages"}. 

  Your responses should:
  1. Provide working, production-ready code with comprehensive error handling, industry best practices, and performance considerations
  2. Offer testing suggestions

  Format your responses with proper code blocks and be concise but thorough.`;

  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    [
      {
        role: "system",
        content: systemPrompt,
      },
    ]
  );

  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: async (content: string) => {
      const userMessage: ChatMessage = {
        role: "user",
        content: content,
      };

      const updatedHistory = [...conversationHistory, userMessage];

      const payload: ChatRequest = {
        model: model || "llama-3.3-70b-versatile",
        messages: updatedHistory,
        temperature: 0.2,
        max_tokens: 6000,
        top_p: 0.95,
        stream: false,
      };

      try {
        const response = await apiPost(`${basePath}/completions`, payload, {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        });

        if (response?.data?.choices?.[0]?.message) {
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response.data.choices[0].message.content,
          };

          setConversationHistory((prev) => [
            ...prev,
            userMessage,
            assistantMessage,
          ]);
        }

        return response;
      } catch (error) {
        console.error("Coding Assistant Error:", error);
        throw error;
      }
    },
  });
};

export const useCodeAnalyzer = (model: string) => {
  return useMutation({
    ...DEFAULT_QUERY_OPTIONS,
    mutationFn: async (code: string) => {
      const analysisPrompt = `Analyze the following code and provide:
      1. Potential bugs or issues
      2. Performance improvements
      3. Refactoring recommendations

      Code to analyze:
      \`\`\`
      ${code}
      \`\`\``;

      const payload: ChatRequest = {
        model: model || "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a code review expert. Provide thorough, constructive analysis focusing on code quality, security, and performance",
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 3000,
        top_p: 0.9,
        stream: false,
      };

      return apiPost(`${basePath}/completions`, payload, {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      });
    },
  });
};
