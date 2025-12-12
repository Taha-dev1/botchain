'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Zap } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define Paddle global type
declare global {
    interface Window {
        Paddle?: any;
    }
}

export default function BillingPage() {
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<string>('free');

    // Initialize Paddle
    useEffect(() => {
        // Only load in browser
        if (typeof window !== 'undefined' && !window.Paddle) {
            // In a real app, you'd load the script in layout or head
            // <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
        }
    }, []);

    const handleUpgrade = async () => {
        setLoading(true);
        // 1. Call backend to get transaction/checkout URL or ID
        // const res = await fetch('/api/v1/billing/checkout', ...)

        // 2. Open Paddle Checkout
        if (window.Paddle) {
            window.Paddle.Checkout.open({
                product: 12345, // ID from env
                email: "user@example.com",
                successCallback: (data: any) => {
                    alert('Subscription successful!');
                    setLoading(false);
                },
                closeCallback: () => {
                    setLoading(false);
                }
            });
        } else {
            alert("Paddle not loaded (Simulated Upgrade)");
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-slate-500 mb-8">Manage your plan and usage limits.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Free Plan */}
                <div className="border rounded-xl p-6 bg-white shadow-sm flex flex-col">
                    <div className="mb-4">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                            Current Plan
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Free Tier</h3>
                    <p className="text-slate-500 mb-6 text-sm">Perfect for testing and small agents.</p>
                    <div className="mb-6">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-slate-400">/mo</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" /> 1 Agent
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" /> 100 Runs / mo
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" /> Community Support
                        </li>
                    </ul>

                    <button
                        disabled
                        className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-not-allowed"
                    >
                        Active
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="border-2 border-blue-600 rounded-xl p-6 bg-white shadow-lg flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        RECOMMENDED
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Pro</h3>
                    <p className="text-slate-500 mb-6 text-sm">For professional agent deployment.</p>
                    <div className="mb-6">
                        <span className="text-4xl font-bold">$29</span>
                        <span className="text-slate-400">/mo</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-blue-600" /> 5 Agents
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-blue-600" /> 10,000 Runs / mo
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-blue-600" /> Priority Support
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-blue-600" /> Faster Execution
                        </li>
                    </ul>

                    <button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                        {loading ? 'Processing...' : 'Upgrade to Pro'}
                    </button>
                </div>

                {/* Enterprise */}
                <div className="border rounded-xl p-6 bg-slate-50 shadow-sm flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                    <p className="text-slate-500 mb-6 text-sm">Custom solutions for large teams.</p>
                    <div className="mb-6">
                        <span className="text-xl font-bold">Custom</span>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-slate-600" /> Unlimited Agents
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-slate-600" /> Custom Connector Integrations
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-slate-600" /> Dedicated Account Manager
                        </li>
                    </ul>

                    <button className="w-full py-2 px-4 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    );
}
