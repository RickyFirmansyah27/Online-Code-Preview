export type MessageRole = "user" | "assistant";

export interface MessageContentItem {
  type: "text" | "image";
  content: string;
}