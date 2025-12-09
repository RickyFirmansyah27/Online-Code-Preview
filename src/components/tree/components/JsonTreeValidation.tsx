"use client";

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, CheckCircle, Info, Zap } from 'lucide-react';
import { JsonTreeValidationProps, ValidationError } from '../types/json.types';

export const JsonTreeValidation: React.FC<JsonTreeValidationProps> = ({
  validation,
  onFixError,
  onDismiss,
  showFixes = true,
  showWarnings = true,
  maxErrors = 5,
  className = '',
  testId = 'json-tree-validation',
}) => {
  // Handle error fix
  const handleFixError = useCallback((error: ValidationError) => {
    if (error.fix) {
      if (error.fix.type === 'auto' && error.fix.apply) {
        error.fix.apply();
      }
      onFixError?.(error);
    }
  }, [onFixError]);

  // Handle dismiss
  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  // Get error icon
  const getErrorIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get error color
  const getErrorColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-500/20 bg-red-500/10 text-red-400';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/10 text-blue-400';
      default:
        return 'border-gray-500/20 bg-gray-500/10 text-gray-400';
    }
  };

  const errors = validation.errors.slice(0, maxErrors);
  const warnings = showWarnings ? validation.warnings.slice(0, maxErrors) : [];
  const hasMoreErrors = validation.errors.length > maxErrors;
  const hasMoreWarnings = validation.warnings.length > maxErrors;

  if (validation.isValid && errors.length === 0 && warnings.length === 0) {
    return (
      <div className={`flex items-center gap-2 text-green-400 text-sm ${className}`}>
        <CheckCircle className="w-4 h-4" />
        <span>JSON is valid</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`} data-testid={testId}>
      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-red-400 font-medium text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{validation.errors.length} Error{validation.errors.length !== 1 ? 's' : ''}</span>
            </div>
            
            {errors.map((error, index) => (
              <motion.div
                key={`${error.path}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  border rounded-lg p-3
                  ${getErrorColor(error.severity)}
                `}
              >
                <div className="flex items-start gap-2">
                  {getErrorIcon(error.severity)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{error.message}</p>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {showFixes && error.fix && (
                          <button
                            onClick={() => handleFixError(error)}
                            className="p-1 hover:bg-white/[0.1] rounded transition-colors"
                            title={error.fix.description}
                          >
                            <Zap className="w-3 h-3" />
                          </button>
                        )}
                        
                        <button
                          onClick={handleDismiss}
                          className="p-1 hover:bg-white/[0.1] rounded transition-colors"
                          title="Dismiss"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {error.path && (
                      <p className="text-xs opacity-75 mt-1 font-mono">
                        Path: {error.path}
                      </p>
                    )}
                    
                    {error.line !== undefined && error.column !== undefined && (
                      <p className="text-xs opacity-75 mt-1">
                        Line {error.line}, Column {error.column}
                      </p>
                    )}
                    
                    {error.fix && (
                      <p className="text-xs opacity-75 mt-1">
                        {error.fix.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {hasMoreErrors && (
              <div className="text-xs text-gray-400 text-center">
                {validation.errors.length - maxErrors} more errors...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warnings */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-yellow-400 font-medium text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{validation.warnings.length} Warning{validation.warnings.length !== 1 ? 's' : ''}</span>
            </div>
            
            {warnings.map((warning, index) => (
              <motion.div
                key={`${warning.path}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  border rounded-lg p-3
                  ${getErrorColor(warning.severity)}
                `}
              >
                <div className="flex items-start gap-2">
                  {getErrorIcon(warning.severity)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{warning.message}</p>
                      
                      <button
                        onClick={handleDismiss}
                        className="p-1 hover:bg-white/[0.1] rounded transition-colors"
                        title="Dismiss"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {warning.path && (
                      <p className="text-xs opacity-75 mt-1 font-mono">
                        Path: {warning.path}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {hasMoreWarnings && (
              <div className="text-xs text-gray-400 text-center">
                {validation.warnings.length - maxErrors} more warnings...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JsonTreeValidation;