import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Initialize Supabase Client
const supabase = createClientComponentClient();

export interface Agent {
    id: string;
    name: string;
    flow: any;
    published: boolean;
    published_version: number;
}

export const agentApi = {
    // Get Agent by ID
    getAgent: async (id: string): Promise<Agent | null> => {
        const { data, error } = await supabase
            .from('agents')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching agent:', error);
            return null;
        }
        return data;
    },

    // Update Agent Flow
    updateAgent: async (id: string, updates: Partial<Agent>): Promise<boolean> => {
        // We use our custom API endpoint for updates to handle versioning logic if needed
        // But for MVP direct Supabase update is fine IF RLS allows it
        // However, the backend implementation plan created a PUT /api/v1/agents/{id} endpoint
        // which handles version incrementing. We should use that over Supabase client if possible
        // to keep logic centralized.

        // To call backend API, we need the session token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/agents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(updates),
            });

            return response.ok;
        } catch (e) {
            console.error('Update failed:', e);
            return false;
        }
    },

    // Execute Agent
    executeAgent: async (id: string, inputs: any): Promise<any> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/execute/${id}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ inputs }),
        });

        if (!response.ok) throw new Error('Execution failed');
        return response.json();
    }
};
