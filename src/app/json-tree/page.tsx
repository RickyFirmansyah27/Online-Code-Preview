"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { JsonTreeMenu } from "@/components/tree";
import { JsonFile } from "@/components/tree/types/json.types";
import { FileText, Upload, Plus, Database, Settings } from "lucide-react";

// Sample JSON files for demonstration
const SAMPLE_FILES: JsonFile[] = [
  {
    id: "package.json",
    name: "package.json",
    content: JSON.stringify({
      name: "online-code-preview",
      version: "1.0.0",
      description: "A comprehensive online code preview application",
      main: "index.js",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        "next": "^15.0.0",
        "react": "^19.0.0",
        "framer-motion": "^11.0.0",
        "zustand": "^5.0.0",
        "lucide-react": "^0.464.0",
        "monaco-editor": "^0.49.0"
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        "@types/react": "^19.0.0",
        "typescript": "^5.0.0",
        "tailwindcss": "^3.0.0"
      }
    }, null, 2),
    parsedData: {
      name: "online-code-preview",
      version: "1.0.0",
      description: "A comprehensive online code preview application",
      main: "index.js",
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint"
      },
      dependencies: {
        "next": "^15.0.0",
        "react": "^19.0.0",
        "framer-motion": "^11.0.0",
        "zustand": "^5.0.0",
        "lucide-react": "^0.464.0",
        "monaco-editor": "^0.49.0"
      },
      devDependencies: {
        "@types/node": "^20.0.0",
        "@types/react": "^19.0.0",
        "typescript": "^5.0.0",
        "tailwindcss": "^3.0.0"
      }
    },
    size: 1024,
    lastModified: new Date(),
    type: "config",
    isDirty: false,
    isValid: true,
  },
  {
    id: "tsconfig.json",
    name: "tsconfig.json",
    content: JSON.stringify({
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "ES6"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    }, null, 2),
    parsedData: {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "ES6"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        baseUrl: ".",
        paths: {
          "@/*": ["./src/*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    },
    size: 512,
    lastModified: new Date(),
    type: "config",
    isDirty: false,
    isValid: true,
  },
  {
    id: "data.json",
    name: "data.json",
    content: JSON.stringify({
      users: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          active: true,
          lastLogin: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          active: true,
          lastLogin: "2024-01-14T15:45:00Z"
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "user",
          active: false,
          lastLogin: "2024-01-10T09:20:00Z"
        }
      ],
      settings: {
        theme: "dark",
        language: "en",
        notifications: {
          email: true,
          push: false,
          sms: false
        },
        features: {
          advancedSearch: true,
          exportData: true,
          bulkActions: false
        }
      },
      metadata: {
        version: "1.0",
        created: "2024-01-01T00:00:00Z",
        updated: "2024-01-15T12:00:00Z",
        totalRecords: 3
      }
    }, null, 2),
    parsedData: {
      users: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          active: true,
          lastLogin: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          active: true,
          lastLogin: "2024-01-14T15:45:00Z"
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "user",
          active: false,
          lastLogin: "2024-01-10T09:20:00Z"
        }
      ],
      settings: {
        theme: "dark",
        language: "en",
        notifications: {
          email: true,
          push: false,
          sms: false
        },
        features: {
          advancedSearch: true,
          exportData: true,
          bulkActions: false
        }
      },
      metadata: {
        version: "1.0",
        created: "2024-01-01T00:00:00Z",
        updated: "2024-01-15T12:00:00Z",
        totalRecords: 3
      }
    },
    size: 768,
    lastModified: new Date(),
    type: "data",
    isDirty: false,
    isValid: true,
  }
];

export default function JsonTreePage() {
  const [jsonFiles, setJsonFiles] = useState<JsonFile[]>(SAMPLE_FILES);
  const [activeFile, setActiveFile] = useState<JsonFile | null>(SAMPLE_FILES[0]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((file: JsonFile) => {
    setActiveFile(file);
  }, []);

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
    const newFile: JsonFile = {
      id: `new-file-${Date.now()}.json`,
      name: `new-file-${Date.now()}.json`,
      content: '{\n  "key": "value"\n}',
      parsedData: { key: "value" },
      size: 20,
      lastModified: new Date(),
      type: 'other',
      isDirty: true,
      isValid: true,
    };

    setJsonFiles(prev => [newFile, ...prev]);
    setActiveFile(newFile);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0a0a0f]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">JSON Tree Editor</h1>
                <p className="text-gray-400">Visual JSON editor with tree navigation and advanced features</p>
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
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeFile?.id === file.id
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