"use client";

interface ErrorNotificationProps {
    /** The error message to display */
    error: string | null;
    /** Optional className for additional styling */
    className?: string;
}

/**
 * A fixed-position error notification component.
 * Displays in the bottom-right corner of the screen when an error is present.
 */
const ErrorNotification = ({ error, className = "" }: ErrorNotificationProps) => {
    if (!error) return null;

    return (
        <div className={`fixed bottom-4 right-4 max-w-md ${className}`}>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
            </div>
        </div>
    );
};

export default ErrorNotification;
