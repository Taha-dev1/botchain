import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    NodeTypes,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useAgentStore } from '@/stores/agentStore';
import InputNode from './nodes/InputNode';
import LLMNode from './nodes/LLMNode';
import RAGNode from './nodes/RAGNode';
import GraphNode from './nodes/GraphNode';
import APINode from './nodes/APINode';
import OutputNode from './nodes/OutputNode';

// Define custom node types
const nodeTypes: NodeTypes = {
    input: InputNode,
    llm: LLMNode,
    rag: RAGNode,
    graph: GraphNode,
    api: APINode,
    output: OutputNode,
};

const Canvas = () => {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        selectNode,
        addNode,
    } = useAgentStore();

    const { screenToFlowPosition } = useReactFlow();

    const onPaneClick = useCallback(() => {
        selectNode(null);
    }, [selectNode]);

    const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        selectNode(node.id);
    }, [selectNode]);

    // Drag and Drop handlers
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${type}_${Date.now()}`,
                type,
                position,
                data: { label: `New ${type}` },
            };

            addNode(newNode);
        },
        [addNode, screenToFlowPosition]
    );

    return (
        <div className="h-full w-full bg-slate-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onPaneClick={onPaneClick}
                onNodeClick={onNodeClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
                fitView
            >
                <Background color="#94a3b8" gap={16} size={1} />
                <Controls />
                <MiniMap zoomable pannable />
            </ReactFlow>
        </div>
    );
};

export default Canvas;
