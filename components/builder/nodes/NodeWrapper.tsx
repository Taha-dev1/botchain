import React, { memo, ReactNode } from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

interface NodeWrapperProps {
    label: string;
    icon?: ReactNode;
    selected?: boolean;
    color?: string;
    children?: ReactNode;
    inputs?: boolean; // Show input handle
    outputs?: boolean; // Show output handle
    className?: string;
}

const NodeWrapper = ({
    label,
    icon,
    selected,
    color = 'bg-slate-100',
    children,
    inputs = true,
    outputs = true,
    className,
}: NodeWrapperProps) => {
    return (
        <div
            className={cn(
                'w-64 rounded-md border bg-white shadow-sm transition-all',
                selected ? 'border-primary ring-1 ring-primary' : 'border-slate-200',
                className
            )}
        >
            {/* Input Handle */}
            {inputs && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="h-3 w-3 border-2 border-white bg-slate-400 !-left-1.5"
                />
            )}

            {/* Header */}
            <div className={cn('flex items-center gap-2 rounded-t-md px-3 py-2', color)}>
                {icon}
                <span className="text-sm font-medium text-slate-800">{label}</span>
            </div>

            {/* Content */}
            <div className="p-3 text-xs text-slate-600">
                {children}
            </div>

            {/* Output Handle */}
            {outputs && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="h-3 w-3 border-2 border-white bg-slate-400 !-right-1.5"
                />
            )}
        </div>
    );
};

export default memo(NodeWrapper);
