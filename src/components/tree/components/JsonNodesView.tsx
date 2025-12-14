"use client";

import React, { useState, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, Node as FlowNode, Edge as FlowEdge } from '@xyflow/react';
import { JsonNode, JsonNodeType } from '../types/json.types';

import '@xyflow/react/dist/style.css';

// --- Type Definitions ---
type NodePosition = { x: number; y: number };
type NodePositions = Map<string, NodePosition>;

const NODE_WIDTH = 200;
const LEVEL_HEIGHT = 150;

// --- Helper Functions ---
const getNodeTypeColor = (type: JsonNodeType) => {
    switch (type) {
        case 'string': return 'border-green-500';
        case 'number': return 'border-blue-500';
        case 'boolean': return 'border-purple-500';
        case 'null': return 'border-gray-500';
        case 'object': return 'border-yellow-500';
        case 'array': return 'border-orange-500';
        default: return 'border-gray-600';
    }
};

// --- Layout Calculation ---
const calculateLayout = (
    node: JsonNode,
    level = 0,
    startX = 0,
    positions: NodePositions = new Map()
): { width: number; positions: NodePositions } => {
    // Validate node has required properties
    if (!node || !node.path) {
        console.error('[calculateLayout] Invalid node:', node);
        return { width: NODE_WIDTH + 20, positions };
    }
    
    const children = node.children || [];
    let totalChildWidth = 0;
    let currentChildStartX = startX;

    // Calculate layout for all children first (recursive DFS)
    children.forEach(child => {
        const childLayout = calculateLayout(child, level + 1, currentChildStartX, positions);
        totalChildWidth += childLayout.width;
        currentChildStartX += childLayout.width;
    });

    // Calculate current node's width and position
    // Ensure minimum width for leaf nodes and accommodate children for parent nodes
    const nodeWidth = Math.max(NODE_WIDTH + 20, totalChildWidth || 0);
    const nodeX = totalChildWidth > 0
        ? startX + (totalChildWidth / 2) - (NODE_WIDTH / 2)  // Center parent over children
        : startX;  // Leaf nodes start at the provided X position
    const nodeY = level * LEVEL_HEIGHT;

    // Store the position for this node
    positions.set(node.path, { x: nodeX, y: nodeY });

    return { width: nodeWidth, positions };
};

// --- Custom Node Component ---
const CustomNode: React.FC<{ data: JsonNode }> = ({ data }) => {
    const displayValue = data.children
        ? `(${data.type})`
        : JSON.stringify(data.value);
    
    return (
        <div className={`px-4 py-2 bg-[#2a2a3e] rounded-lg border-l-4 shadow-lg ${getNodeTypeColor(data.type)}`} style={{ width: NODE_WIDTH }}>
            <div className="font-bold text-sm text-white truncate" title={data.key}>{data.key}</div>
            <div className="font-mono text-xs text-gray-300 truncate" title={displayValue}>
                {displayValue}
            </div>
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

// --- Main View Component ---
export const JsonNodesView: React.FC<{ rootNode: JsonNode | null }> = ({ rootNode }) => {
    const [flowNodes, setFlowNodes] = useState<FlowNode[]>([]);
    const [flowEdges, setFlowEdges] = useState<FlowEdge[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!rootNode) {
            setFlowNodes([]);
            setFlowEdges([]);
            setError(null);
            return;
        }

        try {
            setError(null);
            
            // Ensure root node has a proper path
            if (!rootNode.path || rootNode.path === '') {
                rootNode.path = 'root';
            }

            // Calculate layout for all nodes
            const { positions } = calculateLayout(rootNode);
            
            // Collect all nodes using BFS traversal
            const allJsonNodes: JsonNode[] = [];
            const queue = [rootNode];
            while (queue.length > 0) {
                const node = queue.shift()!;
                allJsonNodes.push(node);
                if (node.children) {
                    queue.push(...node.children);
                }
            }
            
            // Create ReactFlow nodes
            const newNodes: FlowNode[] = allJsonNodes.map(node => {
                const position = positions.get(node.path) || { x: 0, y: 0 };
                return {
                    id: node.path,
                    type: 'custom',
                    data: { ...node },
                    position,
                };
            });

            // Create edges connecting parent nodes to their children
            const newEdges: FlowEdge[] = [];
            allJsonNodes.forEach(node => {
                if (node.children && node.children.length > 0) {
                    node.children.forEach(child => {
                        // Ensure child has a valid path
                        if (!child.path) {
                            console.warn('[JsonNodesView] Child node missing path:', child);
                            return;
                        }
                        
                        const edge = {
                            id: `${node.path}->${child.path}`,
                            source: node.path,
                            target: child.path,
                            animated: true,
                            style: { stroke: '#4a4a6a' },
                        };
                        newEdges.push(edge);
                    });
                }
            });

            setFlowNodes(newNodes);
            setFlowEdges(newEdges);
        } catch (err) {
            console.error('[JsonNodesView] Error processing JSON tree:', err);
            setError(err instanceof Error ? err.message : 'Failed to process JSON tree');
            setFlowNodes([]);
            setFlowEdges([]);
        }

    }, [rootNode]);

    if (!rootNode) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">No data to display.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 p-4">
                <p className="text-red-400 mb-2">Error rendering JSON tree:</p>
                <p className="text-gray-300 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4 text-white">Nodes View</h2>
            <div className="w-full h-[600px] bg-[#1e1e2e] rounded-lg overflow-hidden">
                <ReactFlow
                    nodes={flowNodes}
                    edges={flowEdges}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    proOptions={{ hideAttribution: true }}
                >
                    <Controls
                        className="bg-[#2a2a3e] border border-gray-600"
                        showInteractive={false}
                    />
                    <MiniMap
                        className="bg-[#2a2a3e]"
                        nodeColor={(node) => {
                            const nodeData = node.data as unknown as JsonNode;
                            return getNodeTypeColor(nodeData.type).replace('border-', '#');
                        }}
                    />
                    <Background gap={16} color="#4a4a6a" />
                </ReactFlow>
            </div>
        </div>
    );
};