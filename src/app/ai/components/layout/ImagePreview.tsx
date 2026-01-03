"use client";

import { memo } from "react";

interface ImagePreviewProps {
    /** Array of base64 encoded image strings */
    images: string[];
    /** Callback to handle image removal */
    onRemoveImage: (index: number) => void;
    /** Optional className for additional styling */
    className?: string;
}

/**
 * Component for displaying uploaded image previews with remove functionality.
 * Renders a horizontal grid of image thumbnails with delete buttons.
 */
const ImagePreview = memo(function ImagePreview({
    images,
    onRemoveImage,
    className = "",
}: ImagePreviewProps) {
    if (images.length === 0) return null;

    return (
        <div className={`mb-4 flex justify-center lg:justify-start gap-4 ${className}`}>
            {images.map((image, index) => (
                <div
                    key={index}
                    className="relative inline-block max-w-full lg:max-w-md"
                >
                    <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="max-w-full h-32 sm:h-40 object-contain rounded-lg border border-gray-700"
                    />
                    <button
                        type="button"
                        onClick={() => onRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                        aria-label={`Remove image ${index + 1}`}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
});

export default ImagePreview;
