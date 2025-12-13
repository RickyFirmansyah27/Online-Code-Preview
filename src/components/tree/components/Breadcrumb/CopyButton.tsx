import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from './hooks/useCopyToClipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
}

/**
 * Copy button component with visual feedback
 */
export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  className = '' 
}) => {
  const { copySuccess, isCopying, copy } = useCopyToClipboard({ text });

  return (
    <button
      onClick={copy}
      disabled={isCopying || !text}
      className={`p-1 hover:bg-white/[0.1] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={copySuccess ? "Copied!" : "Copy full path"}
      aria-label={copySuccess ? "Path copied to clipboard" : "Copy full path to clipboard"}
    >
      {copySuccess ? (
        <Check className="w-3 h-3 text-green-400" />
      ) : (
        <Copy className="w-3 h-3 text-gray-400" />
      )}
    </button>
  );
};