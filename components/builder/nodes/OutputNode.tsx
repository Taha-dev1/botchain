import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import NodeWrapper from './NodeWrapper';
import { Flag } from 'lucide-react';

const OutputNode = ({ data, selected }: NodeProps) => {
    return (
        <NodeWrapper
            label="Output"
            icon={<Flag className="h-4 w-4" />}
            selected={selected}
            color="bg-slate-800 text-white"
            outputs={false}
        >
            <div className="flex flex-col gap-1">
                <div>
                    <span className="font-semibold opacity-80">Variable: </span>
                    {data.value ? (
                        <span className="font-mono bg-slate-700 px-1 rounded">{data.value}</span>
                    ) : (
                        <span className="italic opacity-50">Not set</span>
                    )}
                </div>
            </div>
        </NodeWrapper>
    );
};

export default memo(OutputNode);
