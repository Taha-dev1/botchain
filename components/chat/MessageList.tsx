import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

export interface Message {
    id: string;
    role: 'system' | 'user' | 'assistant';
    content: string;
    createdAt: number;
}

interface MessageListProps {
    messages: Message[];
    isLoading?: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
    return (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                    <Bot className="h-8 w-8 mb-2 opacity-50" />
                    <p>No messages yet. Start a conversation!</p>
                </div>
            )}

            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                        "flex gap-3 max-w-[90%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                >
                    {/* Avatar */}
                    <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                        msg.role === 'user' ? "bg-slate-800 text-white" : "bg-blue-100 text-blue-700"
                    )}>
                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    {/* Bubble */}
                    <div className={cn(
                        "rounded-lg px-4 py-2 text-sm shadow-sm",
                        msg.role === 'user'
                            ? "bg-slate-800 text-white rounded-tr-none"
                            : "bg-white border text-slate-800 rounded-tl-none"
                    )}>
                        {msg.content}
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex gap-3 mr-auto max-w-[90%]">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border text-slate-800 rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                        <div className="flex gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(MessageList);
