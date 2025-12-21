"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    ConnectionLineType,
    Position,
    Handle,
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    useReactFlow,
    ReactFlowProvider,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { ChevronRight, Braces, Brackets } from "lucide-react";

// --- Node Types --- //
const ObjectNode = ({ data }: { data: { label: string; content: any } }) => {
    const entries = Object.entries(data.content);
    const MAX_VISIBLE_ITEMS = 6;
    const hasMore = entries.length > MAX_VISIBLE_ITEMS;
    const visibleEntries = hasMore ? entries.slice(0, MAX_VISIBLE_ITEMS) : entries;

    return (
        <div className="min-w-[200px] max-w-[300px] bg-[#1e1e2e]/90 backdrop-blur-md rounded-lg border border-indigo-500/30 shadow-xl overflow-hidden font-sans group hover:border-indigo-500/60 transition-colors">
            {/* Header */}
            <div className="bg-indigo-500/10 px-3 py-2 border-b border-indigo-500/20 flex items-center gap-2">
                <Braces className="w-3 h-3 text-indigo-400" />
                <span className="font-semibold text-indigo-300 text-sm">{data.label}</span>
                <span className="ml-auto text-[10px] text-indigo-400/60 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
                    {entries.length} keys
                </span>
            </div>

            {/* Content */}
            <div className="p-2 space-y-1">
                {visibleEntries.map(([key, value]) => {
                    if (typeof value === "object" && value !== null) return null; // Skip nested objects/arrays to avoid clutter (edges handle them)

                    return (
                        <div key={key} className="flex items-center gap-2 text-xs font-mono group/item hover:bg-white/5 rounded px-1 py-0.5 transition-colors">
                            <span className="text-pink-400 shrink-0">{key}:</span>
                            <span className="text-emerald-400 truncate text-[11px]" title={JSON.stringify(value)}>
                                {JSON.stringify(value)}
                            </span>
                        </div>
                    );
                })}

                {hasMore && (
                    <div className="pt-1 mt-1 border-t border-white/5 text-[10px] text-gray-500 italic text-center">
                        + {entries.length - MAX_VISIBLE_ITEMS} more items
                    </div>
                )}

                {entries.length === 0 && (
                    <div className="text-gray-600 italic text-xs p-1">empty object</div>
                )}
            </div>

            <Handle type="target" position={Position.Left} className="!bg-indigo-500 !w-2 !h-2 !border-0" />
            <Handle type="source" position={Position.Right} className="!bg-indigo-500 !w-2 !h-2 !border-0" />
        </div>
    );
};

const ArrayNode = ({ data }: { data: { label: string; count: number } }) => {
    return (
        <div className="min-w-[140px] bg-[#1e1e2e]/90 backdrop-blur-md rounded-lg border border-amber-500/30 shadow-xl overflow-hidden font-sans group hover:border-amber-500/60 transition-colors">
            <div className="bg-amber-500/10 px-3 py-2 border-b border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brackets className="w-3 h-3 text-amber-400" />
                    <span className="font-semibold text-amber-300 text-sm">{data.label}</span>
                </div>
            </div>
            <div className="p-2 text-center">
                <div className="text-xs text-amber-400/80 font-mono">
                    {data.count} items
                </div>
            </div>
            <Handle type="target" position={Position.Left} className="!bg-amber-500 !w-2 !h-2 !border-0" />
            <Handle type="source" position={Position.Right} className="!bg-amber-500 !w-2 !h-2 !border-0" />
        </div>
    );
};

const nodeTypes = {
    object: ObjectNode,
    array: ArrayNode,
};

// --- Graph Logic --- //
const generateGraph = (data: any) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let idCounter = 0;

    const traverse = (currentData: any, label: string, parentId?: string) => {
        const id = `node-${idCounter++}`;
        const isArray = Array.isArray(currentData);
        const isObject = typeof currentData === "object" && currentData !== null;

        if (!isObject) return;

        if (isArray) {
            nodes.push({
                id,
                type: "array",
                data: { label, count: currentData.length },
                position: { x: 0, y: 0 },
            });
            currentData.forEach((item: any, index: number) => {
                // Only create edges for objects/arrays inside the array to keep graph clean
                // Primitives inside arrays could be handled differently if needed, but standard tree view usually shows structure.
                if (typeof item === 'object' && item !== null) {
                    traverse(item, `[${index}]`, id);
                }
            });
        } else {
            nodes.push({
                id,
                type: "object",
                data: { label, content: currentData },
                position: { x: 0, y: 0 },
            });
            Object.entries(currentData).forEach(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                    traverse(value, key, id);
                }
            });
        }

        if (parentId) {
            edges.push({
                id: `edge-${parentId}-${id}`,
                source: parentId,
                target: id,
                type: "bezier",
                animated: false, // Cleaner look without constant animation
                style: { stroke: "#4b5563", strokeWidth: 1.5 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#4b5563',
                    width: 15,
                    height: 15,
                },
            });
        }
    };

    traverse(data, "root");
    return { nodes, edges };
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "LR") => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Improved layout settings
    dagreGraph.setGraph({
        rankdir: direction,
        ranksep: 120, // Increased separation between layers
        nodesep: 50   // Increased separation between sibling nodes
    });

    nodes.forEach((node) => {
        // Approximate node size for layout calculations
        // This is hard since nodes are dynamic, but we can overestimate slightly
        const height = node.type === 'object' ? 200 : 80;
        dagreGraph.setNode(node.id, { width: 250, height: height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: Position.Left,
            sourcePosition: Position.Right,
            position: {
                x: nodeWithPosition.x - 125, // Center offset based on width/2
                y: nodeWithPosition.y - 75,
            },
            style: { opacity: 1 }, // Ensure visible
        };
    });

    return { nodes: layoutedNodes, edges };
};

const JsonGraphInner = ({ data }: { data: any }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { fitView } = useReactFlow();

    useEffect(() => {
        if (!data) return;

        let parsedData = data;
        if (typeof data === "string") {
            try {
                parsedData = JSON.parse(data);
            } catch (e) { return; }
        }

        const { nodes: initialNodes, edges: initialEdges } = generateGraph(parsedData);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            initialNodes,
            initialEdges
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        setTimeout(() => {
            fitView({ padding: 0.2 });
        }, 50);

    }, [data, setNodes, setEdges, fitView]);

    return (
        <div className="w-full h-full bg-[#0a0a0f]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={2}
                defaultEdgeOptions={{
                    type: 'bezier',
                    markerEnd: { type: MarkerType.ArrowClosed },
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#1f1f2e" gap={25} size={1} />
                <Controls className="!bg-[#1e1e2e] !border-[#2a2a35] !fill-gray-400" />
            </ReactFlow>
        </div>
    );
};

export default function JsonGraph({ data }: { data: any }) {
    return (
        <ReactFlowProvider>
            <JsonGraphInner data={data} />
        </ReactFlowProvider>
    )
}
