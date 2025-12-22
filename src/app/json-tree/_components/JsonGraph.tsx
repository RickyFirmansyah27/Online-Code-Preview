"use client";

import React, { useEffect } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Position,
    Handle,
    Background,
    Controls,
    Node,
    Edge,
    useReactFlow,
    ReactFlowProvider,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Braces, Brackets } from "lucide-react";

// --- Constants & Helper Config --- //
const LAYOUT_DIRECTION = "LR";
const NODE_WIDTH = 280;
const NODE_HEIGHT_BASE = 50;
const NODE_HEIGHT_ITEM = 24;

// Helper to determine value color based on type
const getValueColor = (value: unknown) => {
    if (typeof value === "string") return "text-emerald-400"; // Strings: Green
    if (typeof value === "number") return "text-orange-400";  // Numbers: Orange
    if (typeof value === "boolean") return "text-blue-400";   // Booleans: Blue
    return "text-gray-400";
};

// --- Type Definitions --- //
interface ObjectNodeData {
    label: string;
    content: Record<string, unknown>;
    isExpanded: boolean;
    onToggle?: (id: string, expanded: boolean) => void;
}

interface ArrayNodeData {
    label: string;
    count: number;
    isExpanded: boolean;
    onToggle?: (id: string, expanded: boolean) => void;
}

// --- Node Components --- //

const ObjectNode = ({ data, id }: { data: ObjectNodeData; id: string }) => {
    const entries = Object.entries(data.content || {});
    const isExpanded = data.isExpanded;
    const onToggle = data.onToggle;

    // Limit visible items to avoid huge nodes
    const MAX_VISIBLE_ITEMS = 15;
    const visibleEntries = entries.slice(0, MAX_VISIBLE_ITEMS);
    const hasMore = entries.length > MAX_VISIBLE_ITEMS;

    return (
        <div className="w-[280px] bg-[#18181b] rounded-md border border-zinc-700 shadow-xl overflow-hidden font-mono text-[11px] group transition-all duration-200 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            {/* Header */}
            <div
                className="bg-zinc-800/50 px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-zinc-800 transition-colors"
                onClick={() => onToggle && onToggle(id, !isExpanded)}
            >
                <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                    <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
                <Braces className="w-3 h-3 text-cyan-400" />
                <span className="font-semibold text-zinc-200 truncate flex-1">{data.label}</span>
                <span className="text-[10px] text-zinc-500 bg-zinc-900/50 px-1.5 py-0.5 rounded">
                    {entries.length} keys
                </span>
            </div>

            {/* Content - Only if expanded */}
            {isExpanded && (
                <div className="p-2 space-y-0.5 bg-[#18181b]">
                    {visibleEntries.map(([key, value]) => {
                        const isComplex = typeof value === "object" && value !== null;
                        return (
                            <div key={key} className="flex items-start gap-2 px-1 py-0.5 hover:bg-zinc-800/50 rounded">
                                <span className="text-cyan-400 shrink-0 select-text">{key}:</span>
                                {isComplex ? (
                                    <span className="text-zinc-500 italic">
                                        {Array.isArray(value) ? `Array(${value.length})` : `Object`}
                                    </span>
                                ) : (
                                    <span className={`${getValueColor(value)} truncate select-text break-all`}>
                                        {JSON.stringify(value)}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                    {hasMore && (
                        <div className="px-1 py-1 text-zinc-500 italic">
                            ... {entries.length - MAX_VISIBLE_ITEMS} more
                        </div>
                    )}
                    {entries.length === 0 && (
                        <div className="px-1 text-zinc-500 italic">empty</div>
                    )}
                </div>
            )}

            {!isExpanded && (
                <div className="h-1 bg-zinc-800/30"></div>
            )}

            <Handle type="target" position={Position.Left} className="!bg-zinc-600 !w-2 !h-2 !border-zinc-900" />
            <Handle type="source" position={Position.Right} className="!bg-zinc-600 !w-2 !h-2 !border-zinc-900" />
        </div>
    );
};

const ArrayNode = ({ data, id }: { data: ArrayNodeData; id: string }) => {
    // Array node logic similar to object but simpler
    const isExpanded = data.isExpanded;
    const onToggle = data.onToggle;

    return (
        <div className="min-w-[180px] w-auto max-w-[280px] bg-[#18181b] rounded-md border border-zinc-700 shadow-xl overflow-hidden font-mono text-[11px] group hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-200">
            <div
                className="bg-zinc-800/50 px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-zinc-800 transition-colors"
                onClick={() => onToggle && onToggle(id, !isExpanded)}
            >
                <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                    <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
                <Brackets className="w-3 h-3 text-orange-400" />
                <span className="font-semibold text-zinc-200">{data.label}</span>
                <span className="ml-auto text-zinc-500 text-[10px] bg-zinc-900/50 px-1.5 py-0.5 rounded">
                    {data.count} items
                </span>
            </div>

            <Handle type="target" position={Position.Left} className="!bg-zinc-600 !w-2 !h-2 !border-zinc-900" />
            <Handle type="source" position={Position.Right} className="!bg-zinc-600 !w-2 !h-2 !border-zinc-900" />
        </div>
    );
};

const nodeTypes = {
    object: ObjectNode,
    array: ArrayNode,
};

// --- Graph Logic --- //

// 1. Generate the FULL graph (nodes + edges) from data
const generateFullGraph = (data: unknown) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let idCounter = 0;

    const traverse = (currentData: unknown, label: string, parentId?: string) => {
        const id = `node-${idCounter++}`;
        const isArray = Array.isArray(currentData);
        const isObject = typeof currentData === "object" && currentData !== null;

        if (!isObject) return;

        // Create Node
        if (isArray) {
            nodes.push({
                id,
                type: "array",
                data: { label, count: currentData.length, isExpanded: true }, // Default expanded
                position: { x: 0, y: 0 },
            });
            // Recurse
            currentData.forEach((item: unknown, index: number) => {
                if (typeof item === 'object' && item !== null) {
                    traverse(item, `[${index}]`, id);
                }
            });
        } else {
            nodes.push({
                id,
                type: "object",
                data: { label, content: currentData, isExpanded: true },
                position: { x: 0, y: 0 },
            });
            Object.entries(currentData).forEach(([key, value]) => {
                if (typeof value === "object" && value !== null) {
                    traverse(value, key, id);
                }
            });
        }

        // Create Edge
        if (parentId) {
            edges.push({
                id: `edge-${parentId}-${id}`,
                source: parentId,
                target: id,
                type: "bezier",
                style: { stroke: "#52525b", strokeWidth: 1.5 }, // zinc-600
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#52525b',
                },
            });
        }
    };

    traverse(data, "root");
    return { nodes, edges };
};

// 2. Filter nodes/edges based on which nodes are collapsed
// If a node is collapsed, all its descendants are hidden
const getVisibleElements = (allNodes: Node[], allEdges: Edge[], collapsedIds: Set<string>) => {
    const visibleNodes = new Set<string>();

    // Find root(s) - nodes with no incoming edges or manually identified
    // In this tree structure, node-0 is always root.
    const queue = ["node-0"];
    visibleNodes.add("node-0");

    // BFS to find visible nodes
    // If a node is in collapsedIds, do NOT add its children to queue
    while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (collapsedIds.has(currentId)) continue; // Stop traversing this branch

        // Find children
        const children = allEdges
            .filter(e => e.source === currentId)
            .map(e => e.target);

        children.forEach(childId => {
            visibleNodes.add(childId);
            queue.push(childId);
        });
    }

    const filteredNodes = allNodes.filter(n => visibleNodes.has(n.id));
    const filteredEdges = allEdges.filter(e => visibleNodes.has(e.source) && visibleNodes.has(e.target));

    return { nodes: filteredNodes, edges: filteredEdges };
};


// 3. Run Layout on the VISIBLE graph
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
        rankdir: LAYOUT_DIRECTION,
        ranksep: 100,
        nodesep: 30,
    });

    nodes.forEach((node) => {
        // Calculate dynamic height based on content
        // 40 header + 24 * items
        let height = NODE_HEIGHT_BASE;
        if (node.type === "object" && node.data.isExpanded) {
            const entries = Object.entries((node.data.content as Record<string, unknown>) || {});
            const items = Math.min(entries.length, 15); // Matches MAX_VISIBLE_ITEMS
            height += items * NODE_HEIGHT_ITEM + 10; // + padding
        }

        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return {
        nodes: nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            return {
                ...node,
                targetPosition: Position.Left,
                sourcePosition: Position.Right,
                position: {
                    x: nodeWithPosition.x - (NODE_WIDTH / 2),
                    y: nodeWithPosition.y - (dagreGraph.node(node.id).height / 2),
                },
            };
        }),
        edges,
    };
};

const JsonGraphInner = ({ data }: { data: unknown }) => {
    const [fullNodes, setFullNodes] = React.useState<Node[]>([]);
    const [fullEdges, setFullEdges] = React.useState<Edge[]>([]);

    // Store localized toggle state (NodeID -> isExpanded)
    const [collapsedIds, setCollapsedIds] = React.useState<Set<string>>(new Set());

    // Explicitly type the state
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { fitView } = useReactFlow();

    // 1. Initial Graph Generation
    useEffect(() => {
        if (!data) return;
        let parsedData = data;
        if (typeof data === "string") {
            try { parsedData = JSON.parse(data); } catch { return; }
        }

        const { nodes: initialNodes, edges: initialEdges } = generateFullGraph(parsedData);
        setFullNodes(initialNodes);
        setFullEdges(initialEdges);
        setCollapsedIds(new Set()); // Reset on new data
    }, [data]);

    // 2. Handle Expand/Collapse Logic
    const handleToggle = React.useCallback((nodeId: string, expanded: boolean) => {
        setCollapsedIds(prev => {
            const next = new Set(prev);
            if (!expanded) {
                next.add(nodeId);
            } else {
                next.delete(nodeId);
            }
            return next;
        });
    }, []);

    // 3. Compute Layout whenever nodes/edges or collapsed state changes
    useEffect(() => {
        if (fullNodes.length === 0) return;

        // A. Update local interaction data in fullNodes
        const currentFullNodes = fullNodes.map(n => ({
            ...n,
            data: {
                ...n.data,
                isExpanded: !collapsedIds.has(n.id),
                onToggle: handleToggle,
            }
        }));

        // B. Filter visible
        const { nodes: visibleNodes, edges: visibleEdges } = getVisibleElements(currentFullNodes, fullEdges, collapsedIds);

        // C. Layout
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(visibleNodes, visibleEdges);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

    }, [fullNodes, fullEdges, collapsedIds, handleToggle, setNodes, setEdges]);

    // Initial Fit
    useEffect(() => {
        if (nodes.length > 0) {
            const t = setTimeout(() => {
                fitView({ padding: 0.2, duration: 800 });
            }, 50);
            return () => clearTimeout(t);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, fitView, nodes.length]);

    return (
        <div className="w-full h-full bg-[#09090b]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                minZoom={0.1}
                maxZoom={2}
                defaultEdgeOptions={{
                    type: 'bezier',
                    animated: false,
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#27272a" gap={20} size={1} />
                <Controls
                    className="!bg-[#18181b] !border-zinc-700 !shadow-lg [&>button]:!bg-[#18181b] [&>button]:!border-b-zinc-700 last:[&>button]:!border-b-0 [&>button]:!fill-zinc-400 [&>button:hover]:!fill-zinc-100 [&>button:hover]:!bg-zinc-800 !m-4 !rounded-lg overflow-hidden"
                    position="bottom-left"
                />
            </ReactFlow>
        </div>
    );
};

export default function JsonGraph({ data }: { data: unknown }) {
    return (
        <ReactFlowProvider>
            <JsonGraphInner data={data} />
        </ReactFlowProvider>
    )
}
