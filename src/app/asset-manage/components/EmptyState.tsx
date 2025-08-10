"use client";

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  message = "No data found",
  description,
  icon,
  className = "",
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-gray-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-300 mb-2">
        {message}
      </h3>
      {description && (
        <p className="text-gray-500 text-sm max-w-md">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;