import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import NodeWrapper from './NodeWrapper';
import { Database } from 'lucide-react';

const RAGNode = ({ data, selected }: NodeProps) => {
    return (
        <NodeWrapper
            label="RAG Search"
            icon={<Database className="h-4 w-4" />}
            selected={selected}
            color="bg-orange-100 text-orange-900"
        >
            <div className="flex flex-col gap-1">
                <div>
                    <span className="font-semibold">Vector DB: </span>
                    {data.vector_connector_id ? 'Configured' : 'Not set'}
                </div>
                <div className="line-clamp-2 text-slate-500">
                    Query: {data.query || '{{ input }}'}
                </div>
            </div>
        </NodeWrapper>
    );
};

export default memo(RAGNode);
