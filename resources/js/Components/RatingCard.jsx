import React, { useState } from 'react';
import axios from 'axios';

export default function RatingCard({ movieId }) {
    const [feedback, setFeedback] = useState(null);

    const handleFeedback = (type) => {
        setFeedback(type);
        if (movieId) {
            axios.post('/user/feedback', { movie_id: movieId, type })
                .catch(err => {
                    console.error("Failed to save feedback", err);
                    setFeedback(null);
                });
        }
    };

    return (
        <div className="bg-[#111115]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-700"></div>

            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                        className="text-white/5"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                        strokeDasharray="95, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white tracking-tighter">95%</span>
                    <span className="text-[9px] uppercase tracking-widest text-green-400 font-bold">Match</span>
                </div>
            </div>

            <div className="flex-1 text-center sm:text-left z-10">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-white font-bold tracking-wide uppercase text-sm">AI Recommendation</h3>
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5">
                    Recommended because it matches your recent viewing patterns and selected genres perfectly.
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-3">
                    <button 
                        onClick={() => handleFeedback('like')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-semibold group/btn ${feedback === 'like' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400 text-gray-400'}`}
                    >
                        <svg className="w-4 h-4 transform group-hover/btn:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Spot On
                    </button>
                    <button 
                        onClick={() => handleFeedback('dislike')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-semibold group/btn ${feedback === 'dislike' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-gray-400'}`}
                    >
                        <svg className="w-4 h-4 transform group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        Not For Me
                    </button>
                </div>
            </div>
        </div>
    );
}
