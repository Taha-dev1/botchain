import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import NodeWrapper from './NodeWrapper';
import { BotMessagesSquare } from 'lucide-react';

const LLMNode = ({ data, selected }: NodeProps) => {
    return (
        <NodeWrapper
            label="LLM Generation"
            icon={<BotMessagesSquare className="h-4 w-4" />}
            selected={selected}
            color="bg-purple-100 text-purple-900 icon-purple-900"
        >
            <div className="flex flex-col gap-1">
                <div>
                    <span className="font-semibold">Model: </span>
                    {data.model || 'gpt-4o'}
                </div>
                <div className="line-clamp-2 text-slate-500">
                    {data.prompt || 'No prompt configured'}
                </div>
            </div>
        </NodeWrapper>
    );
};

export default memo(LLMNode);
