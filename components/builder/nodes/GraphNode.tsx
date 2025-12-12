import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import NodeWrapper from './NodeWrapper';
import { Share2 } from 'lucide-react';

const GraphNode = ({ data, selected }: NodeProps) => {
    return (
        <NodeWrapper
            label="Graph Query"
            icon={<Share2 className="h-4 w-4" />}
            selected={selected}
            color="bg-blue-100 text-blue-900"
        >
            <div className="flex flex-col gap-1">
                <div>
                    <span className="font-semibold">Graph DB: </span>
                    {data.graph_connector_id ? 'Configured' : 'Not set'}
                </div>
                <div className="line-clamp-2 text-slate-500">
                    {data.cypher || data.question || 'No query configured'}
                </div>
            </div>
        </NodeWrapper>
    );
};

export default memo(GraphNode);
