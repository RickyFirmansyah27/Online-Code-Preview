"use client";

import { Send, Loader } from "lucide-react";

interface InputFormProps {
  input: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function InputForm({ 
  input, 
  isLoading, 
  handleSubmit, 
  handleInputChange 
}: InputFormProps) {
  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="relative bg-gray-900/50 rounded-xl p-1 focus-within:ring-2 focus-within:ring-blue-500 mb-5">
        <textarea
          value={input}
          onChange={handleInputChange}
          rows={1}
          className="w-full bg-transparent px-4 py-3 text-gray-200 focus:outline-none resize-none overflow-hidden font-mono"
          placeholder="Type your message..."
          disabled={isLoading}
          style={{
            minHeight: "44px",
            maxHeight: "200px",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 bottom-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
    </form>
  );
}