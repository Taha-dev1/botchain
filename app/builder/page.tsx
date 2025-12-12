'use client';

import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Canvas from '@/components/builder/Canvas';
import Sidebar from '@/components/builder/Sidebar';
import ChatPreview from '@/components/chat/ChatPreview';
import CodeEditor from '@/components/editor/CodeEditor';
import { useAgentStore } from '@/stores/agentStore';
import { Save, Play, MessageSquare, Code } from 'lucide-react';
import { agentApi } from '@/lib/api';

export default function BuilderPage() {
    const { isSaved, nodes, edges, agentId, agentName } = useAgentStore();
    const [showChat, setShowChat] = useState(false);
    const [showCode, setShowCode] = useState(false);

    const handleSave = async () => {
        if (!agentId) {
            alert("Agent ID not set (new agent creation not fully implemented in frontend yet)");
            return;
        }

        const flow = { nodes, edges };
        const success = await agentApi.updateAgent(agentId, { flow, name: agentName });

        if (success) {
            alert("Agent saved successfully!");
        } else {
            alert("Failed to save agent.");
        }
    };

    const handleRun = async () => {
        // Toggle chat Preview for "Running"
        setShowChat(true);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden relative">
            {/* Header */}
            <header className="flex h-14 items-center justify-between border-b px-4 bg-white z-10">
                <div className="font-semibold text-lg">Agent Builder</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded border"
                    >
                        <Save className="h-4 w-4" />
                        {isSaved ? 'Saved' : 'Save Changes'}
                    </button>

                    <button
                        onClick={handleRun}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded"
                    >
                        <Play className="h-4 w-4" />
                        Run Agent
                    </button>

                    <button
                        onClick={() => { setShowCode(!showCode); if (showChat) setShowChat(false); }}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded ${showCode ? 'bg-purple-100 text-purple-700' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                        <Code className="h-4 w-4" />
                        Code
                    </button>

                    <button
                        onClick={() => { setShowChat(!showChat); if (showCode) setShowCode(false); }}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded ${showChat ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Preview
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {showCode ? (
                    <div className="flex-1 overflow-hidden">
                        <CodeEditor />
                    </div>
                ) : (
                    <ReactFlowProvider>
                        <div className="flex-1 relative">
                            <Canvas />
                        </div>
                        <Sidebar />
                    </ReactFlowProvider>
                )}

                {/* Chat Overlay */}
                {showChat && (
                    <div className="absolute right-[330px] bottom-4 top-[60px] w-96 z-20 shadow-2xl rounded-lg border border-slate-200">
                        <ChatPreview />
                    </div>
                )}
            </div>
        </div>
    );
}
