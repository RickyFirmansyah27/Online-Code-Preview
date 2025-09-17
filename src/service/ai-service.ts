import { useMutation } from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import { useState } from "react";
import { FALLBACK_MODEL_ID } from "./model-types";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const basePath = "/v1/chat";

interface ChatMessageContent {
  type: "text" | "image";
  content: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ChatMessageContent[];
}

interface ApiMessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;
  };
}

interface ApiChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ApiMessageContent[];
}

interface ChatRequest {
  model: string;
  messages: ApiChatMessage[];
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
        content: `You are an expert ai assistant. Always provide:
                Your task is to deliver answers that are:
                  - ✅ Accurate, relevant, and based only on the user’s context.
                  - ✅ Helpful and easy to understand, like technical documentation.
                  - ❌ Never add unrelated information or go off-topic.
                  - ❌ Do not speculate, assume, or hallucinate.

                  ## Communication Rules

                  ### Response Structure
                  1. Langsung jawab inti pertanyaan
                  2. Berikan detail penting saja
                  3. Struktur dengan bullet points jika perlu
                  4. Tanyakan klarifikasi hanya jika benar-benar perlu

                  ### Tone Adaptation
                  - **Formal**: Dokumen bisnis/akademis
                  - **Casual**: Diskusi santai
                  - **Teknis**: Pembahasan spesifik
                  - **Empatik**: Support personal
                  - Friendly, helpful, and knowledgeable.
                  - Use icons/emojis, katex, bullet points, or code blocks to improve clarity when appropriate.
                  - Offer follow-up help if the topic allows for deeper exploration (e.g. “Jika kamu butuh contoh, saya bisa bantu”).

                  ### Efficiency Guidelines
                  - Hindari repetisi dan filler words
                  - Gunakan contoh konkret, bukan penjelasan panjang
                  - Prioritaskan informasi actionable
                  - Maksimal 2-3 poin utama per respons

                  ## Safety Boundaries
                  **Tidak akan**: Membantu aktivitas berbahaya, ilegal, atau tidak etis
                  **Akan**: Memberikan disclaimer untuk topik sensitif, mengakui keterbatasan, mengarahkan ke sumber otoritatif

                  ## Context Optimization

                  ### Business/Professional
                  - Fokus ROI dan implementasi
                  - Gunakan terminologi industri
                  - Berikan timeline realistis

                  ### Educational
                  - Struktur pedagogis
                  - Sertakan referensi kredibel
                  - Evaluasi pemahaman

                  ### Creative/Personal
                  - Dorong eksplorasi
                  - Berikan inspirasi alternatif
                  - Hormati preferensi personal

                  ## KaTeX Global
                  - Semua ekspresi ilmiah pakai KaTeX (matematika, fisika, kimia, bio-stat).
                  - Setiap langkah/rumus utama ditulis display: $$ ... $$ pada baris terpisah.
                  - Inline $x,y,z,\\pi, t, c$ hanya untuk simbol pendek; bukan untuk persamaan panjang.
                  - Tulis solusi/derivasi secara vertikal (step-by-step).

                  ## Khusus Sains
                  - Satuan: tulis dengan \mathrm, contoh: $5\\,\\mathrm{m\\,s^{-1}}$.
                  - Vektor/konstanta: $\\vec{F}, \\mathbf{E}, k_B, N_A$.
                  - Reaksi kimia: gunakan \ce{...} (mhchem); contoh:
                  $$\\ce{2H2 + O2 -> 2H2O}$$
                  - Keseimbangan/ion: $$K_a = \\frac{[\\mathrm{H^+}][\\mathrm{A^-}]}{[\\mathrm{HA}] }$$
                  - Biologi statistik/kinetika: pecah model (mis. Michaelis–Menten, logistik) menjadi langkah pendek.


                  Format your responses with proper code blocks and be concise but thorough.`,
      },
    ]
  );
  const [fallbackActive, setFallbackActive] = useState(false);

  const conversationContext: ConversationContext = {
    messages: conversationHistory,
    addMessage: (message: ChatMessage) => {
      setConversationHistory((prev) => [...prev, message]);
    },
    clearMessages: () => {
      setFallbackActive(false);
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
      mutationFn: async (content: string | ChatMessageContent[]) => {
        const userMessage: ChatMessage = {
          role: "user",
          content: content,
        };

        const updatedHistory = [...conversationHistory, userMessage];

        // Convert message content for API
        const apiMessages = updatedHistory.map(msg => {
          if (typeof msg.content === 'string') {
            return msg;
          } else {
            // For multimodal content, we need to format it appropriately
            const textContent = msg.content
              .filter(item => item.type === 'text')
              .map(item => item.content)
              .join(' ');
           
            const imageContent = msg.content
              .filter(item => item.type === 'image')
              .map(item => item.content);
           
            // If there are images, we need to format the message differently
            if (imageContent.length > 0) {
              const apiContent: ApiMessageContent[] = [];
              
              if (textContent.trim()) {
                apiContent.push({
                  type: "text",
                  text: textContent
                });
              }
              
              imageContent.forEach(img => {
                apiContent.push({
                  type: "image_url",
                  image_url: {
                    url: img
                  }
                });
              });
              
              return {
                role: msg.role,
                content: apiContent
              };
            }
           
            return {
              role: msg.role,
              content: textContent
            };
          }
        });

        let effectiveModel = model;
        if (fallbackActive) {
          effectiveModel = FALLBACK_MODEL_ID;
        }

        // Convert messages to text-only when fallback is active
        const finalMessages = fallbackActive
          ? apiMessages.map(msg => {
              if (typeof msg.content === 'string') return msg;
              return {
                ...msg,
                content: msg.content
                  .filter(item => item.type === 'text')
                  .map(item => (item as {text?: string}).text || '')
                  .join(' ')
              };
            })
          : apiMessages;

        const payload: ChatRequest = {
          model: effectiveModel,
          messages: finalMessages as ApiChatMessage[],
          temperature: 0.1,
          max_tokens: 10000,
          top_p: 0.9,
          stream: false,
        };

        // Helper to detect image presence
        const containsImage = (content: string | ChatMessageContent[]): boolean => {
          if (Array.isArray(content)) {
            return content.some(item => item.type === 'image');
          }
          return false;
        };

        const hasImage = containsImage(content);
        let response;

        try {
          if (!hasImage) {
            // Use Vercel AI Gateway for chat-only
            const vercelPayload = { ...payload, model: "stealth/sonoma-sky-alpha" };
            response = await apiPost("https://ai-gateway.vercel.sh/v1/chat/completions", vercelPayload, {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
              "Content-Type": "application/json",
            });
          } else {
            // Use Groq for image requests
            response = await apiPost(`${basePath}/completions`, payload, {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
              "Content-Type": "application/json",
            });
          }
        } catch (error) {
          // Extract status code from error
          let statusCode: number | undefined;
          if (error instanceof Error) {
            const axiosError = error as {
              response?: { status?: number };
            };
            statusCode = axiosError.response?.status;
          }

          // Activate fallback only for specific error codes
          const shouldActivateFallback = statusCode && [400, 429, 500].includes(statusCode);

          if (!hasImage) {
            // For chat-only, if Vercel fails, try Groq with fallback model
            const fallbackPayload = { ...payload, model: FALLBACK_MODEL_ID };
            try {
              response = await apiPost(`${basePath}/completions`, fallbackPayload, {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
                "Content-Type": "application/json",
              });
            } catch (groqError) {
              if (shouldActivateFallback) {
                setFallbackActive(true);
              }
              console.error("Vercel fallback to Groq Error:", groqError);
              throw groqError;
            }
          } else {
            // Fallback for image messages
            if (hasImage && payload.model !== FALLBACK_MODEL_ID) {
              console.log("Image processing failed, retrying with fallback model");
              const fallbackPayload = { ...payload, model: FALLBACK_MODEL_ID };
              try {
                response = await apiPost(`${basePath}/completions`, fallbackPayload, {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
                  "Content-Type": "application/json",
                });
              } catch (fallbackError) {
                // Activate fallback for specific error codes even on fallback failure
                if (shouldActivateFallback) {
                  setFallbackActive(true);
                }
                console.error("Fallback AI API Error:", fallbackError);
                throw fallbackError;
              }
            } else {
              // Activate fallback for specific error codes
              if (shouldActivateFallback) {
                setFallbackActive(true);
              }
              console.error("AI API Error:", error);
              throw error;
            }
          }
        }

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

  const conversationContext = {
    clearMessages: () => {
      setConversationHistory([
        {
          role: "system",
          content: systemPrompt,
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

        // Convert message content for API
        const apiMessages = updatedHistory.map(msg => {
          if (typeof msg.content === 'string') {
            return {
              role: msg.role,
              content: msg.content
            };
          } else {
            // For multimodal content, we need to format it appropriately
            const textContent = msg.content
              .filter(item => item.type === 'text')
              .map(item => item.content)
              .join(' ');
           
            const imageContent = msg.content
              .filter(item => item.type === 'image')
              .map(item => item.content);
           
            // If there are images, we need to format the message differently
            if (imageContent.length > 0) {
              const apiContent: ApiMessageContent[] = [];
              
              if (textContent.trim()) {
                apiContent.push({
                  type: "text",
                  text: textContent
                });
              }
              
              imageContent.forEach(img => {
                apiContent.push({
                  type: "image_url",
                  image_url: {
                    url: img
                  }
                });
              });
              
              return {
                role: msg.role,
                content: apiContent
              };
            }
           
            return {
              role: msg.role,
              content: textContent
            };
          }
        });
        const payload: ChatRequest = {
          model: "stealth/sonoma-sky-alpha",
          messages: apiMessages,
          temperature: 0.2,
          max_tokens: 10000,
          top_p: 0.95,
          stream: false,
        };

        try {
          const response = await apiPost("https://ai-gateway.vercel.sh/v1/chat/completions", payload, {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
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
          let errorMessage = "Unknown error occurred";
          let errorCode: string | undefined;
          let statusCode: number | undefined;

          if (error instanceof Error) {
            errorMessage = error.message;
            // Type-safe error property access
            const axiosError = error as {
              code?: string;
              response?: { status?: number };
            };
            errorCode = axiosError.code;
            statusCode = axiosError.response?.status;
          } else if (typeof error === 'object' && error !== null) {
            errorMessage = String(error);
          }

          console.error("Coding Assistant Error:", {
            message: errorMessage,
            code: errorCode,
            status: statusCode,
            request: {
              model: payload.model,
              messages: payload.messages.slice(0, 2),
              temperature: payload.temperature,
            }
          });
          throw error;
        }
      },
    }),
    resetConversation: () => conversationContext.clearMessages(),
  };
};

export const useCodeAnalyzer = (model: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
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
        model: "stealth/sonoma-sky-alpha",
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
        ] as ApiChatMessage[],
        temperature: 0.1,
        max_tokens: 10000,
        top_p: 0.9,
        stream: false,
      };

      return apiPost("https://ai-gateway.vercel.sh/v1/chat/completions", payload, {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      });
    },
  });
};
