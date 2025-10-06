"use client";

import { useRef, useEffect } from "react";
import { Message } from "./Message";
import { AnimatePresence } from "framer-motion";

interface MessageListProps {
  messages: { role: "user" | "assistant"; content: { type: "text" | "image"; content: string }[] }[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full h-full">
      <AnimatePresence>
        {messages.map((message, index) => (
          <Message
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
        <div ref={messagesEndRef} />
      </AnimatePresence>
    </div>
  );
}