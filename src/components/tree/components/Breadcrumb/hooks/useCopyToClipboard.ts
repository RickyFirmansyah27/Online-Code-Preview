import { useState, useEffect, useCallback } from 'react';

interface UseCopyToClipboardProps {
  text: string;
  feedbackDuration?: number;
}

interface UseCopyToClipboardReturn {
  copySuccess: boolean;
  isCopying: boolean;
  copy: () => Promise<void>;
  error: Error | null;
}

/**
 * Custom hook for copy to clipboard functionality with visual feedback
 */
export const useCopyToClipboard = ({
  text,
  feedbackDuration = 2000
}: UseCopyToClipboardProps): UseCopyToClipboardReturn => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async () => {
    if (!text) return;
    
    setIsCopying(true);
    setError(null);
    
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to copy to clipboard');
      setError(error);
      console.error('Failed to copy path:', error);
    } finally {
      setIsCopying(false);
    }
  }, [text]);

  // Reset copy success state after feedback duration
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), feedbackDuration);
      return () => clearTimeout(timer);
    }
  }, [copySuccess, feedbackDuration]);

  return {
    copySuccess,
    isCopying,
    copy,
    error,
  };
};