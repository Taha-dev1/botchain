import React from 'react';
import { useAgentStore } from '@/stores/agentStore';
import {
    BotMessagesSquare,
    Database,
    Share2,
    Globe,
    Flag,
    Play,
    Settings,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui or similar exists, or I'll implement basic
// Actually I don't see shadcn components in the file list. I'll use standard HTML inputs with Tailwind.

const NODE_TYPES = [
    { type: 'llm', label: 'LLM Generation', icon: BotMessagesSquare, color: 'text-purple-600 bg-purple-50' },
    { type: 'rag', label: 'RAG Search', icon: Database, color: 'text-orange-600 bg-orange-50' },
    { type: 'graph', label: 'Graph Query', icon: Share2, color: 'text-blue-600 bg-blue-50' },
    { type: 'api', label: 'API Call', icon: Globe, color: 'text-green-600 bg-green-50' },
    { type: 'output', label: 'Output', icon: Flag, color: 'text-slate-600 bg-slate-50' },
];

const Sidebar = () => {
    const {
        selectedNodeId,
        nodes,
        updateNodeData,
        selectNode,
        addNode
    } = useAgentStore();

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleAddNode = (type: string) => {
        // Basic add (random position) if D&D fails or for accessibility
        const id = `${type}_${Date.now()}`;
        const newNode = {
            id,
            type,
            position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
            data: { label: `New ${type}` },
        };
        addNode(newNode);
    };

    // Property Editors
    const renderEditor = () => {
        if (!selectedNode) return null;

        const handleChange = (key: string, value: any) => {
            updateNodeData(selectedNode.id, { [key]: value });
        };

        return (
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Properties</h3>
                    <button onClick={() => selectNode(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {/* Common Properties */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Label</label>
                        <input
                            className="rounded border px-2 py-1 text-sm bg-white"
                            value={selectedNode.data.label || ''}
                            onChange={(e) => handleChange('label', e.target.value)}
                        />
                    </div>

                    {/* Type Specific */}
                    {selectedNode.type === 'llm' && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Model</label>
                                <select
                                    className="rounded border px-2 py-1 text-sm bg-white"
                                    value={selectedNode.data.model || 'gpt-4o'}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                >
                                    <option value="gpt-4o">GPT-4o</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                    <option value="claude-3-opus">Claude 3 Opus</option>
                                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Prompt</label>
                                <textarea
                                    className="rounded border px-2 py-1 text-sm bg-white min-h-[100px]"
                                    value={selectedNode.data.prompt || ''}
                                    onChange={(e) => handleChange('prompt', e.target.value)}
                                    placeholder="Enter prompt (use {{ input }} for vars)"
                                />
                            </div>
                        </>
                    )}

                    {selectedNode.type === 'rag' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Query Template</label>
                            <input
                                className="rounded border px-2 py-1 text-sm bg-white"
                                value={selectedNode.data.query || ''}
                                onChange={(e) => handleChange('query', e.target.value)}
                                placeholder="{{ input }}"
                            />
                        </div>
                    )}

                    {selectedNode.type === 'graph' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Cypher or Question</label>
                            <textarea
                                className="rounded border px-2 py-1 text-sm bg-white min-h-[100px]"
                                value={selectedNode.data.cypher || selectedNode.data.question || ''}
                                onChange={(e) => handleChange('question', e.target.value)}
                                placeholder="Review schema..."
                            />
                        </div>
                    )}

                    {selectedNode.type === 'api' && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">URL</label>
                                <input
                                    className="rounded border px-2 py-1 text-sm bg-white"
                                    value={selectedNode.data.url || ''}
                                    onChange={(e) => handleChange('url', e.target.value)}
                                    placeholder="https://api.example.com"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Method</label>
                                <select
                                    className="rounded border px-2 py-1 text-sm bg-white"
                                    value={selectedNode.data.method || 'GET'}
                                    onChange={(e) => handleChange('method', e.target.value)}
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                </select>
                            </div>
                        </>
                    )}

                    {selectedNode.type === 'output' && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Output Variable</label>
                            <input
                                className="rounded border px-2 py-1 text-sm bg-white"
                                value={selectedNode.data.value || ''}
                                onChange={(e) => handleChange('value', e.target.value)}
                                placeholder="{{ result }}"
                            />
                        </div>
                    )}

                </div>
            </div>
        );
    };

    return (
        <div className="w-80 border-l bg-slate-50 flex flex-col h-full overflow-hidden">
            {selectedNode ? (
                renderEditor()
            ) : (
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-4">Add Nodes</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {NODE_TYPES.map((type) => (
                            <div
                                key={type.type}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded border bg-white cursor-grab hover:shadow-sm transition-all",
                                    type.color
                                )}
                                onDragStart={(event) => onDragStart(event, type.type)}
                                draggable
                                onClick={() => handleAddNode(type.type)}
                            >
                                <type.icon className="h-5 w-5" />
                                <span className="font-medium text-slate-700">{type.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-xs text-slate-400">
                        Drag nodes to the canvas to add them to the flow.
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
