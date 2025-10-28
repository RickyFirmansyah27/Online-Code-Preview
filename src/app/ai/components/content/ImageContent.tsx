"use client";

interface ImageContentProps {
  src: string;
}

export function ImageContent({ src }: ImageContentProps) {
  return (
    <div className="my-2">
      <img
        src={src}
        alt="Uploaded content"
        className="max-w-full rounded-lg"
        style={{ maxHeight: "300px" }}
      />
    </div>
  );
}