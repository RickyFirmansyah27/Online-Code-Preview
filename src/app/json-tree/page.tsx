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

      <main className="mx-auto max-w-[1920px] px-4 py-8 h-[calc(100vh-80px)]">
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          <div className="w-full lg:w-[280px] shrink-0">
            <JsonTreeSidebar
              jsonFiles={jsonFiles}
              activeFile={activeFile}
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
              onFileUpload={handleFileUpload}
              onCreateNewFile={handleCreateNewFile}
            />
          </div>
          <div className="flex-1 min-w-0 h-full">
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