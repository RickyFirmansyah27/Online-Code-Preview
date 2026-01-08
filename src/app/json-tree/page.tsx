"use client";

import { useJsonFileManager } from "./hooks/useJsonFileManager";
import Header from "../(root)/_components/Header";
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
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden flex flex-col">
      <Header />

      <main className="responsive-container px-3 laptop:px-4 pb-4 flex-1 flex flex-col min-h-0 pt-4">
        <div className="flex-1 h-full min-h-0">
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
