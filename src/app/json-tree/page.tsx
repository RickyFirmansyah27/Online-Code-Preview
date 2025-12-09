"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { JsonTreeMenu } from "@/components/tree";
import { JsonFile, JsonNode, JsonValue } from "@/components/tree/types/json.types";
import { FileText, Upload, Plus, Database, Settings } from "lucide-react";
import AI from "../(root)/_components/AI";
import FileManage from "../(root)/_components/FileManage";
import Logo from "../(root)/_components/Logo";


export default function JsonTreePage() {
  const [jsonFiles, setJsonFiles] = useState<JsonFile[]>([]);
  const [activeFile, setActiveFile] = useState<JsonFile | null>();
  const [isUploading, setIsUploading] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileJson, setNewFileJson] = useState('{\n  "key": "value"\n}');
  const [newFileName, setNewFileName] = useState('');

  const handleFileSelect = useCallback((file: JsonFile) => {
    setActiveFile(file);
  }, []);

  const handleNodeEdit = useCallback((node: JsonNode, value: JsonValue) => {
    if (!activeFile) return;
    
    // Update the file content with the edited value
    try {
      const parsedData = JSON.parse(activeFile.content);
      
      // Function to update the value at the specified path
      const updateValueAtPath = (obj: JsonValue, path: string, newValue: JsonValue) => {
        if (typeof obj !== 'object' || obj === null) {
          throw new Error('Cannot update path on non-object value');
        }
        
        const keys = path.split('.');
        let current: Record<string, unknown> = obj as Record<string, unknown>;
        
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (key.includes('[')) {
            // Handle array indices
            const arrayMatch = key.match(/^([^\[]+)\[(\d+)\]$/);
            if (arrayMatch) {
              const arrayKey = arrayMatch[1];
              const arrayIndex = parseInt(arrayMatch[2]);
              const nextObj = current[arrayKey];
              if (Array.isArray(nextObj)) {
                current = nextObj[arrayIndex] as Record<string, unknown>;
              } else {
                throw new Error(`Expected array at key: ${arrayKey}`);
              }
            }
          } else {
            const nextObj = current[key];
            if (typeof nextObj === 'object' && nextObj !== null) {
              current = nextObj as Record<string, unknown>;
            } else {
              throw new Error(`Cannot traverse path: ${key} is not an object`);
            }
          }
        }
        
        const lastKey = keys[keys.length - 1];
        if (lastKey.includes('[')) {
          const arrayMatch = lastKey.match(/^([^\[]+)\[(\d+)\]$/);
          if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const arrayIndex = parseInt(arrayMatch[2]);
            const array = current[arrayKey];
            if (Array.isArray(array)) {
              array[arrayIndex] = newValue;
            } else {
              throw new Error(`Expected array at key: ${arrayKey}`);
            }
          }
        } else {
          current[lastKey] = newValue;
        }
      };
      
      // Update the value in the parsed data
      updateValueAtPath(parsedData, node.path, value);
      
      // Update the file content
      const updatedContent = JSON.stringify(parsedData, null, 2);
      
      // Update local state
      setJsonFiles(prev =>
        prev.map(f =>
          f.id === activeFile.id
            ? {
                ...f,
                content: updatedContent,
                parsedData,
                isDirty: true,
                lastModified: new Date()
              }
            : f
        )
      );
      
      // Update active file
      setActiveFile(prev => prev ? {
        ...prev,
        content: updatedContent,
        parsedData,
        isDirty: true,
        lastModified: new Date()
      } : prev);
      
    } catch (error) {
      console.error('Failed to update node value:', error);
      alert('Failed to update value. Please try again.');
    }
  }, [activeFile]);

  const handleFileSave = useCallback(async (file: JsonFile, content: string) => {
    try {
      // In a real application, this would save to a backend
      console.log('Saving file:', file.name, content);

      // Update local state
      setJsonFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...file, content, isDirty: false, lastModified: new Date() }
            : f
        )
      );

      // Show success message (you could integrate with a toast system)
      alert(`File ${file.name} saved successfully!`);
    } catch (error) {
      console.error('Failed to save file:', error);
      alert('Failed to save file. Please try again.');
    }
  }, []);


  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of files) {
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const content = await file.text();

          try {
            const parsedData = JSON.parse(content);
            const jsonFile: JsonFile = {
              id: `${file.name}-${Date.now()}`,
              name: file.name,
              content,
              parsedData,
              size: file.size,
              lastModified: new Date(file.lastModified),
              type: file.name.includes('config') ? 'config' :
                file.name.includes('data') ? 'data' : 'other',
              isDirty: false,
              isValid: true,
            };

            setJsonFiles(prev => [jsonFile, ...prev]);
            setActiveFile(jsonFile);
          } catch (error) {
            alert(`Invalid JSON in file ${file.name}: ${error}`);
          }
        }
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleCreateNewFile = useCallback(() => {
    setNewFileJson('{\n  "key": "value"\n}');
    setNewFileName(`new-file-${Date.now()}.json`);
    setShowNewFileDialog(true);
  }, []);

  const handleCreateFileFromDialog = useCallback(() => {
    try {
      const parsedData = JSON.parse(newFileJson);
      const newFile: JsonFile = {
        id: `${newFileName}-${Date.now()}`,
        name: newFileName,
        content: newFileJson,
        parsedData,
        size: newFileJson.length,
        lastModified: new Date(),
        type: 'other',
        isDirty: true,
        isValid: true,
      };

      setJsonFiles(prev => [newFile, ...prev]);
      setActiveFile(newFile);
      setShowNewFileDialog(false);
      setNewFileJson('{\n  "key": "value"\n}');
      setNewFileName('');
    } catch (error) {
      alert(`Invalid JSON: ${error}`);
    }
  }, [newFileJson, newFileName]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0a0a0f]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <nav className="flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
                  <FileManage />
                  <AI />
                </nav>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Upload button */}
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload JSON</span>
                <input
                  type="file"
                  multiple
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              {/* Create new button */}
              <button
                onClick={handleCreateNewFile}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New File</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                JSON Files
              </h3>

              <div className="space-y-2">
                {jsonFiles.map((file) => (
                  <motion.button
                    key={file.id}
                    onClick={() => handleFileSelect(file)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${activeFile?.id === file.id
                        ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                        : 'hover:bg-white/[0.05] text-gray-300'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      {file.isDirty && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {file.type} • {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </motion.button>
                ))}
              </div>

              {jsonFiles.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No JSON files found</p>
                  <p className="text-xs mt-1">Upload or create a new JSON file to get started</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6 mt-6">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-400" />
                Features
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Tree Navigation
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Real-time Search
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Inline Editing
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Validation
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Export Options
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            {activeFile ? (
              <JsonTreeMenu
                files={jsonFiles}
                activeFile={activeFile}
                onFileSelect={handleFileSelect}
                onFileSave={handleFileSave}
                onNodeEdit={handleNodeEdit}
                showSearch={true}
                showBreadcrumb={true}
                showValidation={true}
                enableDragDrop={false}
                enableMultiSelect={false}
                className="min-h-[600px]"
              />
            ) : (
              <div className="bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No JSON File Selected</h3>
                <p className="text-gray-400 mb-6">
                  Choose a JSON file from the sidebar or upload a new one to start editing
                </p>
                <div className="flex justify-center gap-4">
                  <label className="flex items-center gap-2 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="font-medium">Upload JSON</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>

                  <button
                    onClick={handleCreateNewFile}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Create New</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New File Dialog */}
        {showNewFileDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#12121a] rounded-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Create New JSON File</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    File Name
                  </label>
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Enter file name (e.g., data.json)"
                    className="w-full bg-[#1e1e2e] text-gray-200 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    JSON Content
                  </label>
                  <textarea
                    value={newFileJson}
                    onChange={(e) => setNewFileJson(e.target.value)}
                    placeholder="Enter your JSON content here..."
                    rows={12}
                    className="w-full bg-[#1e1e2e] text-gray-200 border border-gray-600 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewFileDialog(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFileFromDialog}
                  disabled={!newFileName.trim() || !newFileJson.trim()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Create File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#12121a] rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Uploading JSON files...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}