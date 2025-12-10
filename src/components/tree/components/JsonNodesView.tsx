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
const calculateLayout = (node: JsonNode, level = 0, startX = 0, positions: NodePositions = new Map()) => {
    const children = node.children || [];
    let totalChildWidth = 0;

    children.forEach(child => {
        totalChildWidth += calculateLayout(child, level + 1, startX + totalChildWidth, positions).width;
    });

    const nodeWidth = Math.max(NODE_WIDTH + 20, totalChildWidth);
    const nodeX = startX + (nodeWidth / 2) - (NODE_WIDTH / 2);
    const nodeY = level * LEVEL_HEIGHT;

    positions.set(node.path, { x: nodeX, y: nodeY });

    return { width: nodeWidth, positions };
};

// --- Custom Node Component ---
const CustomNode: React.FC<{ data: JsonNode }> = ({ data }) => (
    <div className={`px-4 py-2 bg-[#2a2a3e] rounded-lg border-l-4 shadow-lg ${getNodeTypeColor(data.type)} w-[${NODE_WIDTH}px]`}>
        <div className="font-bold text-sm text-white truncate">{data.key}</div>
        <div className="font-mono text-xs text-gray-300 truncate">
            {data.children ? `(${data.type})` : JSON.stringify(data.value)}
        </div>
    </div>
);

const nodeTypes = {
    custom: CustomNode,
};

// --- Main View Component ---
export const JsonNodesView: React.FC<{ rootNode: JsonNode | null }> = ({ rootNode }) => {
    const [flowNodes, setFlowNodes] = useState<FlowNode[]>([]);
    const [flowEdges, setFlowEdges] = useState<FlowEdge[]>([]);

    useEffect(() => {
        if (!rootNode) return;

        const { positions } = calculateLayout(rootNode);
        
        const allJsonNodes: JsonNode[] = [];
        const queue = [rootNode];
        while (queue.length > 0) {
            const node = queue.shift()!;
            allJsonNodes.push(node);
            if (node.children) {
                queue.push(...node.children);
            }
        }
        
        const newNodes: FlowNode[] = allJsonNodes.map(node => ({
            id: node.path,
            type: 'custom',
            data: { ...node },
            position: positions.get(node.path) || { x: 0, y: 0 },
        }));

        const newEdges: FlowEdge[] = [];
        allJsonNodes.forEach(node => {
            if (node.children) {
                node.children.forEach(child => {
                    newEdges.push({
                        id: `${node.path}->${child.path}`,
                        source: node.path,
                        target: child.path,
                        animated: true,
                        style: { stroke: '#4a4a6a' },
                    });
                });
            }
        });

        setFlowNodes(newNodes);
        setFlowEdges(newEdges);

    }, [rootNode]);

    if (!rootNode) {
        return <div className="flex items-center justify-center h-64"><p>No data to display.</p></div>;
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
                >
                    <Controls />
                    <MiniMap />
                    <Background gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
};