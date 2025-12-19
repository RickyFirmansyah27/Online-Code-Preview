"use client";

interface LoadingOverlayProps {
  isUploading: boolean;
}

export default function LoadingOverlay({ isUploading }: LoadingOverlayProps) {
  if (!isUploading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#12121a] rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Uploading JSON files...</p>
      </div>
    </div>
  );
}
