"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { JsonFile } from "@/components/tree/types/json.types";
import JsonGraph from "./JsonGraph";
import { Save } from "lucide-react";

interface JsonSplitViewProps {
    activeFile: JsonFile;
    onSave: (file: JsonFile, content: string) => void;
}

export default function JsonSplitView({ activeFile, onSave }: JsonSplitViewProps) {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (activeFile) {
            // Assume activeFile.content is the string representation or we fetch it?
            // Looking at types, activeFile might have content as string or object? 
            // Usually file managers load content. 
            // Based on useJsonFileManager: 'activeFile' is JsonFile.
            // Let's assume we can treat it as string or stringify it.
            // If the types say content is object, we stringify.
            // If content is string, we use it.
            // I'll check generic usage.
            setCode(typeof activeFile.content === 'string' ? activeFile.content : JSON.stringify(activeFile.content, null, 2));
        }
    }, [activeFile]);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
            try {
                JSON.parse(value);
                setError(null);
            } catch (e: any) {
                setError(e.message);
            }
        }
    };

    const handleSave = () => {
        if (!error) {
            onSave(activeFile, code);
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden border border-gray-800 rounded-lg bg-[#0a0a0f]">
            {/* Editor Pane */}
            <div className="w-1/3 min-w-[300px] border-r border-gray-800 flex flex-col">
                <div className="bg-[#1e1e2e] px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                    <span className="text-gray-300 font-medium font-mono text-sm">JSON Editor</span>
                    <button
                        onClick={handleSave}
                        className="p-1 hover:bg-white/10 rounded text-blue-400"
                        title="Save"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 relative">
                    <Editor
                        height="100%"
                        defaultLanguage="json"
                        theme="vs-dark"
                        value={code}
                        onChange={handleEditorChange}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                            automaticLayout: true,
                        }}
                    />
                    {error && (
                        <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-red-200 p-2 text-xs rounded border border-red-700 backdrop-blur">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Graph Pane */}
            <div className="flex-1 bg-[#0f0f13] relative overflow-hidden">
                <JsonGraph data={code} />
            </div>
        </div>
    );
}
