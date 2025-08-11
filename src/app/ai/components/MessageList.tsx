"use client";

import { useRef, useEffect } from "react";
import { Message } from "./Message";
import { AnimatePresence } from "framer-motion";

interface MessageListProps {
  messages: { role: "user" | "assistant"; content: { type: "text" | "image"; content: string }[] }[];
}

export function MessageList({ messages }: MessageListProps) {
  // Tambahkan useRef untuk auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    console.log("scrollToBottom called, messagesEndRef.current:", messagesEndRef.current);
    console.log("Parent container:", messagesEndRef.current?.parentElement);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("useEffect triggered, messages length:", messages.length);
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className="max-w-3xl mx-auto bg-gray-900/50 rounded-xl p-6 mb-4 h-[500px] overflow-y-auto custom-scrollbar"
      ref={(el) => {
        if (el) {
          console.log("MessageList container mounted, scrollHeight:", el.scrollHeight, "clientHeight:", el.clientHeight);
        }
      }}
    >
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