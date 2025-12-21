"use client";

// import { Upload, Plus } from "lucide-react"; // Keeping imports for now if referenced elsewhere, but unused here
import AI from "@/app/(root)/_components/AI";
import FileManage from "@/app/(root)/_components/FileManage";
import Logo from "@/app/(root)/_components/Logo";

export default function JsonTreePageHeader() {
  return (
    <div className="border-b border-gray-800 bg-[#0a0a0f]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <Logo />
            <div>
              <nav className="flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
                <FileManage />
                <AI />
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            {/* Actions moved to sidebar */}
          </div>
        </div>
      </div>
    </div>
  );
}
