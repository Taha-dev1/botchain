'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

// Define Agent Type matching backend
interface Agent {
    id: string
    name: string
    published: boolean
    updated_at: string
}

export default function Dashboard() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        // Check session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push('/login')
            } else {
                setUser(session.user)
                fetchAgents(session.access_token)
            }
        })
    }, [])

    const fetchAgents = async (token: string) => {
        try {
            // Fetch from OUR Backend API, not Supabase directly (to test API flow)
            const res = await fetch('http://localhost:8000/api/v1/agents/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setAgents(data)
            } else {
                console.error('Failed to fetch agents')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateAgent = async () => {
        const name = prompt("Enter agent name:")
        if (!name) return

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        const res = await fetch('http://localhost:8000/api/v1/agents/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ name })
        })

        if (res.ok) {
            fetchAgents(session.access_token) // refresh
        } else {
            alert("Error creating agent")
        }
    }

    if (loading) return <div className="p-10 text-white">Loading...</div>

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="flex gap-4">
                        <span className="text-zinc-500 self-center">{user?.email}</span>
                        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-sm border border-zinc-700 px-3 py-1 rounded hover:bg-zinc-800">Sign Out</button>
                    </div>
                </div>

                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">My Agents</h2>
                        <button onClick={handleCreateAgent} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm font-medium">
                            + New Agent
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {agents.length === 0 && (
                            <div className="col-span-3 text-center py-20 border border-dashed border-zinc-800 rounded-lg text-zinc-500">
                                No agents found. Create one to get started.
                            </div>
                        )}
                        {agents.map(agent => (
                            <div key={agent.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-indigo-500/50 transition cursor-pointer">
                                <h3 className="font-bold text-lg mb-2">{agent.name}</h3>
                                <div className="flex justify-between items-center mt-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${agent.published ? 'bg-green-900 text-green-300' : 'bg-zinc-800 text-zinc-400'}`}>
                                        {agent.published ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="text-xs text-zinc-500">v1.0</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
