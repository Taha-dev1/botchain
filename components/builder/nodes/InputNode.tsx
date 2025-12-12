import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import NodeWrapper from './NodeWrapper';
import { Play } from 'lucide-react';

const InputNode = ({ data, selected }: NodeProps) => {
    return (
        <NodeWrapper
            label="Start"
            icon={<Play className="h-4 w-4" />}
            selected={selected}
            color="bg-slate-800 text-white icon-white"
            inputs={false}
        >
            <div className="flex flex-col gap-1">
                <div className="text-slate-300">
                    Entry point
                </div>
            </div>
        </NodeWrapper>
    );
};

export default memo(InputNode);
