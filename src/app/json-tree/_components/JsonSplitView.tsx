"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { JsonFile } from "@/components/types/json.types";
import JsonGraph from "./JsonGraph";
import { Save, Upload, Plus } from "lucide-react";

interface JsonSplitViewProps {
    activeFile: JsonFile;
    onSave: (file: JsonFile, content: string) => void;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCreate: () => void;
}

export default function JsonSplitView({ activeFile, onSave, onFileUpload, onCreate }: JsonSplitViewProps) {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (activeFile) {
            setCode(typeof activeFile.content === 'string' ? activeFile.content : JSON.stringify(activeFile.content, null, 2));
        }
    }, [activeFile]);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
            try {
                JSON.parse(value);
                setError(null);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("Invalid JSON syntax");
                }
            }
        }
    };

    const handleSave = () => {
        if (!error) {
            onSave(activeFile, code);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] w-full overflow-hidden border border-gray-800 rounded-lg bg-[#0a0a0f]">
            {/* Editor Pane */}
            <div className="w-full lg:w-1/3 h-[40%] lg:h-full border-b lg:border-b-0 lg:border-r border-gray-800 flex flex-col">
                <div className="bg-[#1e1e2e] px-4 py-2 border-b border-gray-700 flex justify-between items-center shrink-0">
                    <span className="text-gray-300 font-medium font-mono text-sm">JSON Editor</span>
                    <div className="flex items-center gap-1">
                        <label
                            className="p-1 hover:bg-white/10 rounded text-blue-400 cursor-pointer"
                            title="Upload"
                        >
                            <Upload className="w-4 h-4" />
                            <input
                                type="file"
                                multiple
                                accept=".json,application/json"
                                onChange={onFileUpload}
                                className="hidden"
                            />
                        </label>
                        <button
                            onClick={onCreate}
                            className="p-1 hover:bg-white/10 rounded text-green-400"
                            title="New File"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleSave}
                            className="p-1 hover:bg-white/10 rounded text-blue-400"
                            title="Save"
                        >
                            <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 relative min-h-0">
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
                        <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-red-200 p-2 text-xs rounded border border-red-700 backdrop-blur z-10">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Graph Pane */}
            <div className="flex-1 bg-[#0f0f13] relative overflow-hidden h-full">
                <JsonGraph data={code} />
            </div>
        </div>
    );
}
