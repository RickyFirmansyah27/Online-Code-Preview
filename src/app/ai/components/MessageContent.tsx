"use client";

import { MessageContentItem } from "../types";
import { TextContent } from "./TextContent";
import { ImageContent } from "./ImageContent";

interface MessageContentProps {
  content: MessageContentItem[];
}

export function MessageContent({ content }: MessageContentProps) {
  return (
    <>
      {content.map((item, index) => {
        switch (item.type) {
          case "text":
            return <TextContent key={index} content={item.content} />;
          case "image":
            return <ImageContent key={index} src={item.content} />;
          default:
            return null;
        }
      })}
    </>
  );
}