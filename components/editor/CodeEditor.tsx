import React, { memo, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useAgentStore } from '@/stores/agentStore';
import { flowToPython, flowToJson } from './FlowToCode';
import { Code, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';

const CodeEditor = () => {
    const { nodes, edges, agentName } = useAgentStore();
    const [language, setLanguage] = useState<'python' | 'json'>('python');
    const [code, setCode] = useState('');

    useEffect(() => {
        if (language === 'python') {
            setCode(flowToPython(nodes, edges, agentName));
        } else {
            setCode(flowToJson(nodes, edges, agentName));
        }
    }, [nodes, edges, agentName, language]);

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-slate-700">
            {/* Configuration Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-black text-white">
                <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">View As</span>

                    <div className="flex bg-[#333] rounded p-1 gap-1">
                        <button
                            onClick={() => setLanguage('python')}
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors",
                                language === 'python' ? "bg-[#0e639c] text-white" : "text-slate-400 hover:text-white"
                            )}
                        >
                            <Code className="h-3 w-3" />
                            Python
                        </button>
                        <button
                            onClick={() => setLanguage('json')}
                            className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors",
                                language === 'json' ? "bg-[#0e639c] text-white" : "text-slate-400 hover:text-white"
                            )}
                        >
                            <FileJson className="h-3 w-3" />
                            JSON
                        </button>
                    </div>
                </div>

                <div className="text-xs text-slate-500">
                    Read-only View
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    language={language}
                    value={code}
                    theme="vs-dark"
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 12,
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    }}
                />
            </div>
        </div>
    );
};

export default memo(CodeEditor);
