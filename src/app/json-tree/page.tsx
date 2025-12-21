"use client";

import { useJsonFileManager } from "./hooks/useJsonFileManager";
import JsonTreePageHeader from "./_components/JsonTreePageHeader";
import JsonTreeSidebar from "./_components/JsonTreeSidebar";
import JsonTreeMainContent from "./_components/JsonTreeMainContent";
import NewFileDialog from "./_components/NewFileDialog";
import LoadingOverlay from "./_components/LoadingOverlay";

export default function JsonTreePage() {
  const {
    jsonFiles,
    activeFile,
    isUploading,
    showNewFileDialog,
    newFileJson,
    newFileName,
    handleFileSelect,
    handleNodeEdit,
    handleFileSave,
    handleFileUpload,
    handleCreateNewFile,
    handleCreateFileFromDialog,
    setShowNewFileDialog,
    setNewFileJson,
    setNewFileName,
  } = useJsonFileManager();

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      <JsonTreePageHeader />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <JsonTreeSidebar
            jsonFiles={jsonFiles}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
            onCreateNewFile={handleCreateNewFile}
          />
          <div className="lg:col-span-3">
            <JsonTreeMainContent
              activeFile={activeFile}
              jsonFiles={jsonFiles}
              isUploading={isUploading}
              onFileSelect={handleFileSelect}
              onFileSave={handleFileSave}
              onNodeEdit={handleNodeEdit}
              onFileUpload={handleFileUpload}
              onCreateNewFile={handleCreateNewFile}
            />
          </div>
        </div>
      </main>

      <NewFileDialog
        show={showNewFileDialog}
        onClose={() => setShowNewFileDialog(false)}
        fileName={newFileName}
        onFileNameChange={setNewFileName}
        fileContent={newFileJson}
        onFileContentChange={setNewFileJson}
        onCreate={handleCreateFileFromDialog}
      />

      <LoadingOverlay isUploading={isUploading} />
    </div>
  );
}