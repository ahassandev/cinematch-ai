import React from 'react';
import { Link } from '@inertiajs/react';

export default function EmptyState({ title, description, actionText, actionLink }) {
    return (
        <div className="py-24 px-6 text-center bg-[#1a1a24]/30 rounded-[2rem] border border-white/5 backdrop-blur-sm max-w-3xl mx-auto my-12">
            <div className="w-24 h-24 mx-auto bg-[#0a0a0f] rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-4 tracking-wide">{title}</h3>
            <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg">{description}</p>
            {actionText && actionLink && (
                <Link href={actionLink} className="inline-block px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_10px_30px_rgba(147,51,234,0.3)] transition-transform hover:scale-[1.03]">
                    {actionText}
                </Link>
            )}
        </div>
    );
}
