"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileText, Code, Database } from 'lucide-react';
import { JsonTreeExportProps, ExportOptions, JsonValue } from '../types/json.types';

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'json',
  indentation: 2,
  sortKeys: false,
  includeMetadata: false,
};

const FORMAT_OPTIONS = [
  { value: 'json', label: 'JSON', icon: <Code className="w-4 h-4" /> },
  { value: 'yaml', label: 'YAML', icon: <FileText className="w-4 h-4" /> },
  { value: 'xml', label: 'XML', icon: <Database className="w-4 h-4" /> },
  { value: 'csv', label: 'CSV', icon: <FileText className="w-4 h-4" /> },
  { value: 'properties', label: 'Properties', icon: <FileText className="w-4 h-4" /> },
];

export const JsonTreeExport: React.FC<JsonTreeExportProps> = ({
  onExport,
  isOpen = false,
  onClose,
  testId = 'json-tree-export',
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>(DEFAULT_EXPORT_OPTIONS);
  const [isExporting, setIsExporting] = useState(false);

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const data = await onExport(exportOptions);

      // Create download link
      const blob = new Blob([data], {
        type: getContentType(exportOptions.format)
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export.${exportOptions.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onClose?.();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [exportOptions, onExport, onClose]);

  // Handle option change
  const handleOptionChange = useCallback((key: keyof ExportOptions, value: string | number | boolean | ((path: string, value: JsonValue) => boolean) | undefined) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  // Get content type for download
  const getContentType = (format: string): string => {
    switch (format) {
      case 'json': return 'application/json';
      case 'yaml': return 'text/yaml';
      case 'xml': return 'application/xml';
      case 'csv': return 'text/csv';
      case 'properties': return 'text/plain';
      default: return 'text/plain';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1a22] border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
          data-testid={testId}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Export JSON</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/[0.1] rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FORMAT_OPTIONS.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => handleOptionChange('format', format.value)}
                    className={`
                      flex items-center gap-2 p-3 rounded-lg border transition-colors
                      ${exportOptions.format === format.value
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-gray-700 hover:border-gray-600 text-gray-300'
                      }
                    `}
                  >
                    {format.icon}
                    <span className="text-sm">{format.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Indentation */}
            {exportOptions.format === 'json' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Indentation
                </label>
                <select
                  value={exportOptions.indentation}
                  onChange={(e) => handleOptionChange('indentation', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-[#2a2a3a] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Minified</option>
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                  <option value={8}>8 Spaces</option>
                </select>
              </div>
            )}

            {/* Additional Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={exportOptions.sortKeys || false}
                  onChange={(e) => handleOptionChange('sortKeys', e.target.checked)}
                  className="rounded border-gray-600 bg-[#2a2a3a] text-blue-500 focus:ring-blue-500"
                />
                Sort Keys Alphabetically
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={exportOptions.includeMetadata || false}
                  onChange={(e) => handleOptionChange('includeMetadata', e.target.checked)}
                  className="rounded border-gray-600 bg-[#2a2a3a] text-blue-500 focus:ring-blue-500"
                />
                Include Metadata
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JsonTreeExport;