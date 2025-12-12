import { create } from 'zustand';
import {
    Edge,
    Node,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Connection
} from 'reactflow';

// Define Node Data Interface
export interface NodeData {
    label?: string;
    [key: string]: any;
}

// Store State Interface
interface AgentState {
    agentName: string;
    agentId: string | null;
    nodes: Node<NodeData>[];
    edges: Edge[];
    selectedNodeId: string | null;
    isSaved: boolean;

    // Actions
    setAgentName: (name: string) => void;
    setAgentId: (id: string) => void;
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addNode: (node: Node) => void;
    updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
    selectNode: (nodeId: string | null) => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
    agentName: 'New Agent',
    agentId: null,
    nodes: [],
    edges: [],
    selectedNodeId: null,
    isSaved: true,

    setAgentName: (name) => set({ agentName: name, isSaved: false }),
    setAgentId: (id) => set({ agentId: id }),
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
            isSaved: false,
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
            isSaved: false,
        });
    },

    onConnect: (connection: Connection) => {
        set({
            edges: addEdge(connection, get().edges),
            isSaved: false,
        });
    },

    addNode: (node) => {
        set({
            nodes: [...get().nodes, node],
            isSaved: false,
        });
    },

    updateNodeData: (nodeId, data) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: { ...node.data, ...data },
                    };
                }
                return node;
            }),
            isSaved: false,
        });
    },

    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
}));
