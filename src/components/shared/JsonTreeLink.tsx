import React from "react";
import { Code2 } from "lucide-react";
import Link from "next/link";

const JsonTreeLink: React.FC = () => {
    return (
        <Link
            href="/json-tree"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors"
        >
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">Json Tree</span>
        </Link>
    );
};

export default JsonTreeLink;
