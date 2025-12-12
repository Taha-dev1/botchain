'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Activity, Settings2 } from 'lucide-react';
import MessageList, { Message } from './MessageList';
import TracePanel, { TraceStep } from './TracePanel';
import { useAgentStore } from '@/stores/agentStore';
import { agentApi } from '@/lib/api';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ChatPreview = () => {
    const { agentId } = useAgentStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTraceOpen, setIsTraceOpen] = useState(false);
    const [trace, setTrace] = useState<TraceStep[]>([]);
    const supabase = createClientComponentClient();

    // SSE Connection Ref
    const eventSourceRef = useRef<EventSource | null>(null);

    const handleSend = async () => {
        if (!inputValue.trim() || !agentId) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            createdAt: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);
        setTrace([]); // Clear trace for new run

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.error("No session");
                setIsLoading(false);
                return;
            }

            // Setup SSE
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/execute/${agentId}/stream`;

            // Note: EventSource doesn't support headers by default, so we might need to send auth token in query param
            // or use a library like @microsoft/fetch-event-source which supports headers.
            // For security, adding token to query param is OK over HTTPS but headers are better.
            // For MVP, we'll assume we can pass a temp token or just use fetch-event-source polyfill logic.
            // Or simpler: use POST req to get a stream reading using fetch() which is easier for headers.

            // Let's implement fetch streaming approach instead of native EventSource for header support
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    inputs: { input: userMsg.content } // Standard input schema
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error("No reader");

            let assistantMsgId = (Date.now() + 1).toString();
            let assistantContent = "";

            // Create initial placeholder for assistant
            // We'll update this message as we stream
            // Actually Execution Engine returns only final output for now in nodes, 
            // unless we have streaming LLM node.
            // Our engine streams *step updates*.

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '');
                        if (!dataStr) continue;

                        try {
                            const event = JSON.parse(dataStr);

                            // Handle Trace Events
                            if (event.type === 'step_start' || event.type === 'step_finish') {
                                setTrace(prev => [...prev, {
                                    type: event.node_type || 'unknown',
                                    node_id: event.node_id,
                                    status: event.status || 'pending',
                                    timestamp: event.timestamp || new Date().toISOString(),
                                    result: event.output,
                                    error: event.error
                                }]);
                            }

                            // Handle Completion/Output
                            if (event.type === 'completion') {
                                // Find output
                                // Assuming output comes from specific outputs or final step
                                const outputs = event.outputs || {};
                                // Heuristic: Use 'output' key or first value
                                const content = outputs.output || outputs.response || Object.values(outputs)[0];

                                if (content) {
                                    assistantContent = typeof content === 'string' ? content : JSON.stringify(content);

                                    setMessages(prev => [
                                        ...prev,
                                        {
                                            id: assistantMsgId,
                                            role: 'assistant',
                                            content: assistantContent,
                                            createdAt: Date.now()
                                        }
                                    ]);
                                }
                            }

                            // Error
                            if (event.type === 'error') {
                                setMessages(prev => [
                                    ...prev,
                                    {
                                        id: Date.now().toString(),
                                        role: 'assistant',
                                        content: `Context Error: ${event.error}`,
                                        createdAt: Date.now()
                                    }
                                ]);
                            }

                        } catch (e) {
                            console.error("Error parsing event:", e);
                        }
                    }
                }
            }

        } catch (e) {
            console.error("Stream error:", e);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Error connecting to agent.",
                createdAt: Date.now()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-slate-50">
                <h3 className="font-semibold text-slate-700">Preview</h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsTraceOpen(!isTraceOpen)}
                        className={cn("p-1.5 rounded hover:bg-slate-200 text-slate-500", isTraceOpen && "bg-slate-200 text-slate-800")}
                        title="Toggle Trace"
                    >
                        <Activity className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} isLoading={isLoading} />

            {/* Input */}
            <div className="p-3 border-t bg-slate-50">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <input
                        className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading || !agentId}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !agentId || !inputValue.trim()}
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>

            {/* Trace Panel Overlay */}
            <TracePanel
                trace={trace}
                isOpen={isTraceOpen}
                onClose={() => setIsTraceOpen(false)}
            />
        </div>
    );
};

export default ChatPreview;
