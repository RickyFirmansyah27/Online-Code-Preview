import React from "react";
import { Code2 } from "lucide-react";
import Link from "next/link";

const AILink: React.FC = () => {
    return (
        <Link
            href="/ai"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-colors"
        >
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">AI Playground</span>
        </Link>
    );
};

export default AILink;
