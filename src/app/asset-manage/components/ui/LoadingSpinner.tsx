"use client";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner = ({ message = "Loading...", className = "" }: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      {message && (
        <p className="text-gray-400 text-sm">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;