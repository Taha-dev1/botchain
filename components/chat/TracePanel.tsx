import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Activity, XCircle, CheckCircle, Clock } from 'lucide-react';

export interface TraceStep {
    node_id: string;
    type: string;
    status: 'success' | 'error' | 'pending';
    timestamp: string;
    result?: any;
    error?: string;
}

interface TracePanelProps {
    trace: TraceStep[];
    isOpen: boolean;
    onClose: () => void;
}

const TracePanel = ({ trace, isOpen, onClose }: TracePanelProps) => {
    if (!isOpen) return null;

    return (
        <div className="w-80 border-l bg-slate-50 flex flex-col h-full overflow-hidden shadow-xl z-20 absolute right-0 top-0 bottom-0">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-white">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-sm">Execution Trace</span>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="h-4 w-4" />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {trace.length === 0 && (
                    <div className="text-center text-xs text-slate-400 mt-10">
                        No trace data available yet.
                    </div>
                )}

                {trace.map((step, idx) => (
                    <div key={idx} className="bg-white rounded border p-2 text-xs shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold px-1.5 py-0.5 rounded bg-slate-100 uppercase text-[10px] tracking-wider text-slate-600">
                                {step.type}
                            </span>
                            <div className="flex items-center gap-1 text-slate-400">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(step.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                            </div>
                        </div>

                        <div className="mb-1 bg-slate-50 p-1 rounded font-mono text-[10px] text-slate-500 truncate">
                            {step.node_id}
                        </div>

                        {step.status === 'success' && (
                            <div className="flex items-start gap-1.5 text-green-700 mt-2">
                                <CheckCircle className="h-3 w-3 mt-0.5" />
                                <div className="break-all whitespace-pre-wrap font-mono bg-green-50 p-1 rounded w-full">
                                    {typeof step.result === 'object'
                                        ? JSON.stringify(step.result).substring(0, 100) + (JSON.stringify(step.result).length > 100 ? '...' : '')
                                        : String(step.result).substring(0, 100)}
                                </div>
                            </div>
                        )}

                        {step.status === 'error' && (
                            <div className="flex items-start gap-1.5 text-red-700 mt-2">
                                <XCircle className="h-3 w-3 mt-0.5" />
                                <div className="break-words bg-red-50 p-1 rounded w-full">
                                    {step.error}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(TracePanel);
