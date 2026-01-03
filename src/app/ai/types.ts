/**
 * Centralized type definitions for the AI Playground module.
 * All shared types and interfaces should be defined here.
 */

/** Role of a message in the conversation */
export type MessageRole = "user" | "assistant";

/** Type of content within a message */
export type MessageContentType = "text" | "image";

/** Chat mode options for the AI assistant */
export type ChatMode = "ask" | "debug" | "code";

/**
 * Content item within a message.
 * Can be either text or an image (base64 encoded).
 */
export interface MessageContentItem {
  type: MessageContentType;
  content: string;
}

/**
 * A single message in the conversation.
 * Contains a unique ID for React performance optimization.
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: MessageRole;
  /** Array of content items (text and/or images) */
  content: MessageContentItem[];
}

/**
 * Image upload action type.
 */
export type ImageUploadAction = "add" | "replace";