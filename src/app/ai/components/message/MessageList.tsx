"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "./Message";
import { AnimatePresence } from "framer-motion";

interface MessageListProps {
  messages: { id?: string; role: "user" | "assistant"; content: { type: "text" | "image"; content: string }[] }[];
}

export const MessageList = React.memo(function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col">
      <AnimatePresence>
        {messages.map((message, index) => (
          <Message
            key={message.id || `msg-${index}`}
            role={message.role}
            content={message.content}
          />
        ))}
        <div ref={messagesEndRef} />
      </AnimatePresence>
    </div>
  );
});