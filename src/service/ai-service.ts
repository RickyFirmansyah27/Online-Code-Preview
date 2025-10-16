import { apiPost } from "./axios-client";

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                               */
/* ------------------------------------------------------------------ */

interface ChatMessageContent {
  type: "text" | "image";
  content: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ChatMessageContent[];
}

interface ApiMessageContent {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
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

const BASE_PATH = "/v1/chat";

/* ------------------------------------------------------------------ */
/* Helper Functions                                                */
/* ------------------------------------------------------------------ */

/**
 * Build the headers used for every request.
 */
export const getHeaders = (): Record<string, string> => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://online-code-preview.vercel.app",
  "X-Title": "Online Code Editor",
});

/**
 * Convert a local `ChatMessage` array into the format expected by the API.
 */
export const buildApiMessages = (
  messages: ChatMessage[]
): ApiChatMessage[] => {
  return messages.map((msg) => {
    if (typeof msg.content === "string") {
      return { role: msg.role, content: msg.content };
    }

    // Multimodal content – split text and images
    const textParts = msg.content
      .filter((c) => c.type === "text")
      .map((c) => c.content)
      .join(" ");
    const imageParts = msg.content
      .filter((c) => c.type === "image")
      .map((c) => c.content);

    if (imageParts.length === 0) {
      return { role: msg.role, content: textParts };
    }

    const apiContent: ApiMessageContent[] = [];
    if (textParts.trim()) {
      apiContent.push({ type: "text", text: textParts });
    }
    imageParts.forEach((url) => {
      apiContent.push({ type: "image_url", image_url: { url } });
    });

    return { role: msg.role, content: apiContent };
  });
};

/**
 * Detect whether a message contains an image.
 */
export const containsImage = (
  content: string | ChatMessageContent[]
): boolean => {
  if (Array.isArray(content)) {
    return content.some((c) => c.type === "image");
  }
  return false;
};

/**
 * Handle fallback logic for a failed request.
 * Returns the new response or throws the original error.
 */
export const handleFallback = async (
  originalError: unknown,
  payload: ChatRequest,
  hasImage: boolean,
  fallbackModel: string,
  setFallbackActive: (active: boolean) => void
) => {
  const axiosError = originalError as {
    response?: { status?: number };
  };
  const statusCode = axiosError.response?.status;

  // Only activate fallback for certain error codes
  const shouldActivateFallback = statusCode
    ? [400, 429, 500].includes(statusCode)
    : false;

  const fallbackPayload = { ...payload, model: fallbackModel };

  try {
    return await apiPost(`${BASE_PATH}/completions`, fallbackPayload, {
      ...getHeaders(),
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
    });
  } catch (fallbackError) {
    if (shouldActivateFallback) {
      setFallbackActive(true);
    }
    console.error("Fallback AI API Error:", fallbackError);
    throw fallbackError;
  }
};

