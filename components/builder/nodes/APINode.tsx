import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import NodeWrapper from './NodeWrapper';
import { Globe } from 'lucide-react';

const APINode = ({ data, selected }: NodeProps) => {
    return (
        <NodeWrapper
            label="API Call"
            icon={<Globe className="h-4 w-4" />}
            selected={selected}
            color="bg-green-100 text-green-900"
        >
            <div className="flex flex-col gap-1">
                <div>
                    <span className="font-semibold">{data.method || 'GET'}</span> {data.url || 'https://...'}
                </div>
            </div>
        </NodeWrapper>
    );
};

export default memo(APINode);
