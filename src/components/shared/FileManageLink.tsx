import React from "react";
import { Code2 } from "lucide-react";
import Link from "next/link";

const FileManageLink: React.FC = () => {
    return (
        <Link
            href="/asset-manage"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-colors"
        >
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-medium">File Management</span>
        </Link>
    );
};

export default FileManageLink;
