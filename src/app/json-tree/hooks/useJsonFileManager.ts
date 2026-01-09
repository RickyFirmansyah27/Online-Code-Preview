"use client";

import { useState, useCallback } from "react";
import { JsonFile, JsonNode, JsonValue } from "@/components/types/json.types";

// Sample JSON data to show on initial load
const sampleJsonContent = JSON.stringify({
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample JSON file for demonstration",
  "dependencies": {
    "@monaco-editor/react": "^4.5.1",
    "@tailwindcss/forms": "^0.5.4",
    "next": "13.4.7",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.43.0",
    "postcss": "^8.4.24"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "author": {
    "name": "Developer",
    "email": "dev@example.com"
  },
  "license": "MIT"
}, null, 2);

const sampleFile: JsonFile = {
  id: "sample-json-file",
  name: "sample.json",
  content: sampleJsonContent,
  parsedData: JSON.parse(sampleJsonContent),
  size: sampleJsonContent.length,
  lastModified: new Date(),
  type: "config",
  isDirty: false,
  isValid: true,
};

export function useJsonFileManager() {
  const [jsonFiles, setJsonFiles] = useState<JsonFile[]>([sampleFile]);
  const [activeFile, setActiveFile] = useState<JsonFile | null>(sampleFile);
  const [isUploading, setIsUploading] = useState(false);
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileJson, setNewFileJson] = useState(`{\n  "key": "value"\n}`);
  const [newFileName, setNewFileName] = useState('');

  const handleFileSelect = useCallback((file: JsonFile) => {
    setActiveFile(file);
  }, []);

  const handleNodeEdit = useCallback((node: JsonNode, value: JsonValue) => {
    if (!activeFile) return;

    try {
      const parsedData = JSON.parse(activeFile.content);

      const updateValueAtPath = (obj: JsonValue, path: string, newValue: JsonValue) => {
        if (typeof obj !== 'object' || obj === null) {
          throw new Error('Cannot update path on non-object value');
        }

        const keys = path.split('.');
        let current: Record<string, unknown> = obj as Record<string, unknown>;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (key.includes('[')) {
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

      updateValueAtPath(parsedData, node.path, value);
      const updatedContent = JSON.stringify(parsedData, null, 2);

      const updatedFile = {
        ...activeFile,
        content: updatedContent,
        parsedData,
        isDirty: true,
        lastModified: new Date(),
      };

      setJsonFiles(prev =>
        prev.map(f => (f.id === activeFile.id ? updatedFile : f))
      );
      setActiveFile(updatedFile);

    } catch (error) {
      console.error('Failed to update node value:', error);
      alert('Failed to update value. Please try again.');
    }
  }, [activeFile]);

  const handleFileSave = useCallback(async (file: JsonFile, content: string) => {
    try {
      console.log('Saving file:', file.name, content);
      setJsonFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...file, content, isDirty: false, lastModified: new Date() }
            : f
        )
      );
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
    setNewFileJson(`{\n  "key": "value"\n}`);
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
      setNewFileJson(`{\n  "key": "value"\n}`);
      setNewFileName('');
    } catch (error) {
      alert(`Invalid JSON: ${error}`);
    }
  }, [newFileJson, newFileName]);

  return {
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
  };
}
