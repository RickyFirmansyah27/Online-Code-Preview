import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  MODEL_OPTIONS,
  ModelOption,
} from "@/service/model-types";
import {
  useCodingAssistant,
} from "@/service/coding-assistant";
import {
  useCodeAnalyzer,
} from "@/service/code-analyzer";
import {
  useConversationAi,
} from "@/service/ai-conversation";

export interface MessageContent {
  type: "text" | "image";
  content: string;
}

export interface Message {
  role: "user" | "assistant";
  content: MessageContent[];
}

export type ChatMode = "ask" | "debug" | "code";

export function useChatState() {
  /* ---------- State ---------- */
  const [input, setInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(
    MODEL_OPTIONS[0]
  );
  const [mode, setMode] = useState<ChatMode>("ask");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* ---------- Dropdown ref for click-outside handling ---------- */
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  /* ---------- Refs to track previous model ---------- */
  const prevModelRef = useRef<string>(selectedModel.model);
  const prevNameRef = useRef<string>(selectedModel.name);

  /* ---------- AI hooks ---------- */
  const coding = useCodingAssistant(selectedModel.model);
  const conversation = useConversationAi(
    selectedModel.model,
    selectedModel.name
  );
  const analyzer = useCodeAnalyzer(selectedModel.model);

  /* ---------- Effect: reset conversation on model change ---------- */
  useEffect(() => {
    // Only reset if model or name actually changed
    if (
      prevModelRef.current !== selectedModel.model ||
      prevNameRef.current !== selectedModel.name
    ) {
      conversation.resetConversation?.();
      coding.resetConversation?.();
      
      // Update refs
      prevModelRef.current = selectedModel.model;
      prevNameRef.current = selectedModel.name;
    }
    // analyzer has no state
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel.model, selectedModel.name, conversation.resetConversation, coding.resetConversation]);

  /* ---------- Memoised hook selector ---------- */
  const activeHook = useMemo(() => {
    switch (mode) {
      case "ask":
        return conversation;
      case "debug":
        return analyzer;
      case "code":
        return coding;
      default:
        return conversation;
    }
  }, [mode, conversation, analyzer, coding]);

  // Handle different hook return types
  const mutation = 'mutation' in activeHook ? activeHook.mutation : activeHook;
  const { mutateAsync: sendMessage, status } = mutation;
  const isLoading = status === "pending";

  /* ---------- Abort controller for cleanup ---------- */
  const abortControllerRef = useRef<AbortController | null>(null);

  /* ---------- Handlers ---------- */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() && !uploadedImage) return;

      /* Build message content */
      const content: MessageContent[] = [];
      if (input.trim()) content.push({ type: "text", content: input });
      if (uploadedImage) content.push({ type: "image", content: uploadedImage });

      /* Optimistically update UI */
      const newMessages: Message[] = [
        ...messages,
        { role: "user" as const, content },
      ];
      setMessages(newMessages);
      setInput("");
      setUploadedImage(null);

      /* Abort any previous request */
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        /* `sendMessage` expects `string | (string & ChatMessageContent[])`.
           We bypass the strict type check by casting to `any`. */
        const response = await sendMessage(
          content as never,
          { signal: abortControllerRef.current?.signal } as never
        );

        /* Validate response shape */
        const assistantText =
          response?.data?.choices?.[0]?.message?.content ?? null;
        if (!assistantText) {
          throw new Error("Invalid response from AI service");
        }

        const updatedMessages: Message[] = [
          ...newMessages,
          {
            role: "assistant" as const,
            content: [{ type: "text", content: assistantText }],
          },
        ];

        setMessages(updatedMessages);

      } catch (err) {
        console.error("[Chat] sendMessage error:", err);
        const errorMsg: Message = {
          role: "assistant" as const,
          content: [
            {
              type: "text",
              content: "Sorry, something went wrong. Please try again.",
            },
          ],
        };
        const errorMessages = [...newMessages, errorMsg];
        setMessages(errorMessages);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input, uploadedImage, messages, mode, sendMessage]
  );

  const handleImageUpload = useCallback((imageData: string | null) => {
    setUploadedImage(imageData);
  }, []);

  const handleClearMessages = useCallback(() => {
    setMessages([]);

    /* Reset conversation state if the hook exposes a reset method */
    conversation.resetConversation?.();
    coding.resetConversation?.();
    analyzer.resetConversation?.();
    // analyzer has no state to reset
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, conversation, coding]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleModeChange = useCallback(
    (newMode: ChatMode) => {
      /* Persist current mode's conversation and switch mode in single update */
       const updatedHistories = {
          [mode]: messages,
        };

        /* Switch mode and load its history */
        setMode(newMode);
        setMessages(updatedHistories[newMode] ?? []);
    },
    [mode, messages]
  );


  /* ---------- Cleanup on unmount ---------- */
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  /* ---------- Return public API ---------- */
  return {
    /* state */
    input,
    uploadedImage,
    messages,
    selectedModel,
    mode,
    isDropdownOpen,
    dropdownRef,
    isLoading,

    /* actions */
    setInput,
    setSelectedModel,
    setMode: handleModeChange,
    setIsDropdownOpen,
    handleSubmit,
    handleImageUpload,
    handleClearMessages,
    handleInputChange,
  };
}