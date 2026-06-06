import React from 'react';

export default function StatsCard({ title, value, icon }) {
    return (
        <div className="bg-[#1a1a24]/60 border border-white/10 rounded-[1.5rem] p-6 backdrop-blur-xl shadow-lg hover:border-white/20 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h4 className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-widest">{title}</h4>
                    <p className="text-4xl font-black text-white">{value}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#111] to-[#222] border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <div className="text-purple-400">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}
