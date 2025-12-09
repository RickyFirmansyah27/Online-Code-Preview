/**
 * Export utilities for JSON tree menu
 */

import { JsonValue, JsonObject, JsonArray, ExportOptions, ImportOptions } from '../types/json.types';
import { safeJsonStringify, safeJsonParse } from './jsonUtils';

/**
 * Export JSON to different formats
 */
export const exportJson = (data: JsonValue, options: ExportOptions): string => {
  const { format, indentation = 2, sortKeys = false, includeMetadata = false, filter } = options;

  // Apply filter if provided
  let filteredData = data;
  if (filter) {
    filteredData = filterJson(data, filter);
  }

  // Sort keys if requested
  if (sortKeys && typeof filteredData === 'object' && filteredData !== null && !Array.isArray(filteredData)) {
    filteredData = sortObjectKeys(filteredData as JsonObject);
  }

  switch (format) {
    case 'json':
      return exportToJson(filteredData, indentation, includeMetadata);
    case 'yaml':
      return exportToYaml(filteredData, indentation, includeMetadata);
    case 'xml':
      return exportToXml(filteredData, indentation, includeMetadata);
    case 'csv':
      return exportToCsv(filteredData, includeMetadata);
    case 'properties':
      return exportToProperties(filteredData, includeMetadata);
    default:
      return exportToJson(filteredData, indentation, includeMetadata);
  }
};

/**
 * Export to JSON format
 */
export const exportToJson = (data: JsonValue, indentation: number = 2, includeMetadata: boolean = false): string => {
  const { string: jsonString } = safeJsonStringify(data, indentation);
  
  if (!includeMetadata) {
    return jsonString;
  }

  const metadata = {
    exported: new Date().toISOString(),
    format: 'json',
    version: '1.0',
  };

  const result = {
    metadata,
    data,
  };

  const { string: resultString } = safeJsonStringify(result, indentation);
  return resultString;
};

/**
 * Export to YAML format
 */
export const exportToYaml = (data: JsonValue, indentation: number = 2, includeMetadata: boolean = false): string => {
  const yamlLines: string[] = [];
  
  if (includeMetadata) {
    yamlLines.push('# Exported JSON data');
    yamlLines.push(`# Generated: ${new Date().toISOString()}`);
    yamlLines.push(`# Format: YAML`);
    yamlLines.push('');
  }

  const convertToYaml = (value: JsonValue, indent: number = 0): string => {
    const spaces = ' '.repeat(indent);
    
    if (value === null) {
      return 'null';
    } else if (typeof value === 'boolean') {
      return value.toString();
    } else if (typeof value === 'number') {
      return value.toString();
    } else if (typeof value === 'string') {
      // Handle multi-line strings and special characters
      if (value.includes('\n') || value.includes('"') || value.includes("'")) {
        return `|\n${value.split('\n').map(line => ' '.repeat(indent + 2) + line).join('\n')}`;
      }
      return `"${value.replace(/"/g, '\\"')}"`;
    } else if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      
      const items = value.map(item => {
        const itemYaml = convertToYaml(item, indent + indentation);
        return `${spaces}- ${itemYaml.trim()}`;
      });
      
      return items.join('\n');
    } else if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      if (entries.length === 0) return '{}';
      
      const items = entries.map(([key, val]) => {
        const valYaml = convertToYaml(val, indent + indentation);
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          return `${spaces}${key}:\n${valYaml}`;
        } else {
          return `${spaces}${key}: ${valYaml.trim()}`;
        }
      });
      
      return items.join('\n');
    }
    
    return '';
  };

  yamlLines.push(convertToYaml(data, 0));
  return yamlLines.join('\n');
};

/**
 * Export to XML format
 */
export const exportToXml = (data: JsonValue, indentation: number = 2, includeMetadata: boolean = false): string => {
  const xmlLines: string[] = [];
  
  xmlLines.push('<?xml version="1.0" encoding="UTF-8"?>');
  
  if (includeMetadata) {
    xmlLines.push('<!-- Exported JSON data -->');
    xmlLines.push(`<!-- Generated: ${new Date().toISOString()} -->`);
    xmlLines.push('<!-- Format: XML -->');
  }

  const convertToXml = (value: JsonValue, tagName: string, indent: number = 0): string => {
    const spaces = ' '.repeat(indent);
    
    if (value === null) {
      return `${spaces}<${tagName} xsi:nil="true" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>`;
    } else if (typeof value === 'boolean') {
      return `${spaces}<${tagName}>${value}</${tagName}>`;
    } else if (typeof value === 'number') {
      return `${spaces}<${tagName}>${value}</${tagName}>`;
    } else if (typeof value === 'string') {
      return `${spaces}<${tagName}>${escapeXml(value)}</${tagName}>`;
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${spaces}<${tagName}/>`;
      }
      
      const items = value.map((item) =>
        convertToXml(item, 'item', indent + indentation)
      );
      
      return [
        `${spaces}<${tagName}>`,
        ...items,
        `${spaces}</${tagName}>`
      ].join('\n');
    } else if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return `${spaces}<${tagName}/>`;
      }
      
      const items = entries.map(([key, val]) => 
        convertToXml(val, sanitizeXmlTag(key), indent + indentation)
      );
      
      return [
        `${spaces}<${tagName}>`,
        ...items,
        `${spaces}</${tagName}>`
      ].join('\n');
    }
    
    return '';
  };

  xmlLines.push(convertToXml(data, 'root', 0));
  return xmlLines.join('\n');
};

/**
 * Export to CSV format
 */
export const exportToCsv = (data: JsonValue, includeMetadata: boolean = false): string => {
  const csvLines: string[] = [];
  
  if (includeMetadata) {
    csvLines.push('# Exported JSON data');
    csvLines.push(`# Generated: ${new Date().toISOString()}`);
    csvLines.push('# Format: CSV');
    csvLines.push('');
  }

  if (Array.isArray(data)) {
    // Handle array of objects
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null && !Array.isArray(data[0])) {
      const headers = Object.keys(data[0] as JsonObject);
      csvLines.push(headers.map(header => `"${header}"`).join(','));
      
      for (const row of data) {
        if (typeof row === 'object' && row !== null && !Array.isArray(row)) {
          const values = headers.map(header => {
            const value = (row as JsonObject)[header];
            return formatCsvValue(value);
          });
          csvLines.push(values.join(','));
        }
      }
    } else {
      // Handle simple array
      csvLines.push('"value"');
      for (const item of data) {
        csvLines.push(formatCsvValue(item));
      }
    }
  } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    // Handle single object
    csvLines.push('"key","value"');
    for (const [key, value] of Object.entries(data)) {
      csvLines.push(`"${key}",${formatCsvValue(value)}`);
    }
  } else {
    // Handle primitive value
    csvLines.push('"value"');
    csvLines.push(formatCsvValue(data));
  }

  return csvLines.join('\n');
};

/**
 * Export to Java Properties format
 */
export const exportToProperties = (data: JsonValue, includeMetadata: boolean = false): string => {
  const propertiesLines: string[] = [];
  
  if (includeMetadata) {
    propertiesLines.push('# Exported JSON data');
    propertiesLines.push(`# Generated: ${new Date().toISOString()}`);
    propertiesLines.push('# Format: Properties');
    propertiesLines.push('');
  }

  const convertToProperties = (value: JsonValue, prefix: string = ''): void => {
    if (value === null) {
      propertiesLines.push(`${prefix}=${formatPropertyValue(value)}`);
    } else if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
      propertiesLines.push(`${prefix}=${formatPropertyValue(value)}`);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        convertToProperties(item, `${prefix}[${index}]`);
      });
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, val] of Object.entries(value)) {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        convertToProperties(val, newPrefix);
      }
    }
  };

  convertToProperties(data);
  return propertiesLines.join('\n');
};

/**
 * Import data from different formats
 */
export const importData = (data: string, options: ImportOptions): JsonValue => {
  const { format, mergeStrategy: _mergeStrategy = 'replace', validateOnImport = true, transform } = options;

  let parsedData: JsonValue;

  switch (format) {
    case 'json':
      parsedData = importFromJson(data);
      break;
    case 'yaml':
      parsedData = importFromYaml(data);
      break;
    case 'xml':
      parsedData = importFromXml(data);
      break;
    case 'csv':
      parsedData = importFromCsv(data);
      break;
    case 'properties':
      parsedData = importFromProperties(data);
      break;
    default:
      parsedData = importFromJson(data);
  }

  // Validate if requested
  if (validateOnImport) {
    const { data: validatedData } = safeJsonParse(JSON.stringify(parsedData));
    if (validatedData === null) {
      throw new Error('Invalid data format');
    }
    parsedData = validatedData;
  }

  // Apply transformation if provided
  if (transform) {
    parsedData = transform(parsedData);
  }

  return parsedData;
};

/**
 * Import from JSON format
 */
export const importFromJson = (data: string): JsonValue => {
  const { data: parsedData, error } = safeJsonParse(data);
  
  if (error || parsedData === null) {
    throw new Error(`Invalid JSON: ${error?.message || 'Unknown error'}`);
  }
  
  return parsedData;
};

/**
 * Import from YAML format (basic implementation)
 */
export const importFromYaml = (data: string): JsonValue => {
  // This is a simplified YAML parser - in production, use a proper YAML library
  try {
    // Try to parse as JSON first (YAML is a superset of JSON)
    return importFromJson(data);
  } catch {
    // Basic YAML parsing for simple cases
    const lines = data.split('\n');
    const result: JsonObject = {};
    let currentKey = '';
    let currentValue: string[] = [];
    let inMultiline = false;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('#') || trimmed === '') continue;
      
      if (trimmed.includes(':') && !inMultiline) {
        if (currentKey && currentValue.length > 0) {
          result[currentKey] = parseYamlValue(currentValue.join('\n'));
        }
        
        const [key, ...valueParts] = trimmed.split(':');
        currentKey = key.trim();
        const value = valueParts.join(':').trim();
        
        if (value === '|') {
          inMultiline = true;
          currentValue = [];
        } else if (value) {
          result[currentKey] = parseYamlValue(value);
          currentKey = '';
          currentValue = [];
        }
      } else if (inMultiline) {
        if (line.startsWith('  ') || line.startsWith('\t')) {
          currentValue.push(line.trim());
        } else {
          if (currentKey && currentValue.length > 0) {
            result[currentKey] = currentValue.join('\n');
          }
          inMultiline = false;
          currentKey = '';
          currentValue = [];
        }
      }
    }
    
    if (currentKey && currentValue.length > 0) {
      result[currentKey] = currentValue.join('\n');
    }
    
    return result;
  }
};

/**
 * Import from XML format (basic implementation)
 */
export const importFromXml = (_data: string): JsonValue => {
  // This is a simplified XML parser - in production, use a proper XML library
  throw new Error('XML import not implemented in this demo');
};

/**
 * Import from CSV format
 */
export const importFromCsv = (data: string): JsonValue => {
  const lines = data.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
  
  if (lines.length === 0) {
    return {};
  }
  
  const headers = parseCsvLine(lines[0]);
  const result: JsonArray = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: JsonObject = {};
    
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = parseCsvValue(values[j]);
    }
    
    result.push(row);
  }
  
  return result;
};

/**
 * Import from Properties format
 */
export const importFromProperties = (data: string): JsonValue => {
  const lines = data.split('\n').filter(line => !line.startsWith('#') && line.trim() !== '');
  const result: JsonObject = {};
  
  for (const line of lines) {
    const equalIndex = line.indexOf('=');
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      const value = line.substring(equalIndex + 1).trim();
      setNestedProperty(result, key, parsePropertyValue(value));
    }
  }
  
  return result;
};

// Helper functions

/**
 * Filter JSON data based on a predicate function
 */
const filterJson = (data: JsonValue, filter: (path: string, value: JsonValue) => boolean): JsonValue => {
  const filterRecursive = (value: JsonValue, path: string): JsonValue => {
    if (!filter(path, value)) {
      return null;
    }
    
    if (Array.isArray(value)) {
      return value
        .map((item, index) => filterRecursive(item, `${path}[${index}]`))
        .filter(item => item !== undefined);
    } else if (typeof value === 'object' && value !== null) {
      const result: JsonObject = {};
      for (const [key, val] of Object.entries(value)) {
        const filtered = filterRecursive(val, path ? `${path}.${key}` : key);
        if (filtered !== undefined) {
          result[key] = filtered;
        }
      }
      return result;
    }
    
    return value;
  };
  
  return filterRecursive(data, '');
};

/**
 * Sort object keys alphabetically
 */
const sortObjectKeys = (obj: JsonObject): JsonObject => {
  const sorted: JsonObject = {};
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sorted[key] = sortObjectKeys(value);
    } else {
      sorted[key] = value;
    }
  }
  
  return sorted;
};

/**
 * Escape XML special characters
 */
const escapeXml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Sanitize XML tag names
 */
const sanitizeXmlTag = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_');
};

/**
 * Format value for CSV
 */
const formatCsvValue = (value: JsonValue): string => {
  if (value === null) return '';
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
  return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
};

/**
 * Format value for properties file
 */
const formatPropertyValue = (value: JsonValue): string => {
  if (value === null) return '';
  if (typeof value === 'boolean' || typeof value === 'number') return value.toString();
  if (typeof value === 'string') return value.replace(/[:=\\]/g, '\\$&');
  return JSON.stringify(value);
};

/**
 * Parse YAML value
 */
const parseYamlValue = (value: string): JsonValue => {
  if (value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  return value;
};

/**
 * Parse CSV line
 */
const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

/**
 * Parse CSV value
 */
const parseCsvValue = (value: string): JsonValue => {
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
  return value.replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
};

/**
 * Parse properties value
 */
const parsePropertyValue = (value: string): JsonValue => {
  const unescaped = value.replace(/\\[:=\\]/g, match => match.slice(1));
  
  if (unescaped === 'true') return true;
  if (unescaped === 'false') return false;
  if (/^\d+$/.test(unescaped)) return parseInt(unescaped, 10);
  if (/^\d+\.\d+$/.test(unescaped)) return parseFloat(unescaped);
  
  return unescaped;
};

/**
 * Set nested property in object
 */
const setNestedProperty = (obj: JsonObject, path: string, value: JsonValue): void => {
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    
    if (!current[part]) {
      const nextPart = parts[i + 1];
      current[part] = /^\d+$/.test(nextPart) ? [] : {};
    }
    
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
};