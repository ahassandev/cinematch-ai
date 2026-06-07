import React, { useState, useEffect } from 'react';
import RecommendationCard from './RecommendationCard';
import axios from 'axios';

export default function RecommendationSection({ movieId }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (movieId) {
            fetchRecs();
        }
    }, [movieId]);

    const fetchRecs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/movies/ai-recommendations/${movieId}`);
            const rawRecs = res.data.results || [];
            
            const mapped = rawRecs.slice(0, 4).map((r, index) => ({
                id: r.id,
                title: r.title,
                rating: r.vote_average ? r.vote_average.toFixed(1) : 'NR',
                genre: r.ai_reason || 'AI Match',
                image: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
                year: r.release_date ? r.release_date.substring(0, 4) : 'N/A',
                matchScore: Math.max(75, 98 - index * 3)
            }));
            
            setRecommendations(mapped);
        } catch (err) {
            console.error("Failed to fetch recommendations:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 relative bg-black/50 overflow-hidden border-t border-t-white/5">
            <div className="absolute top-0 right-0 w-[80wv] h-[80wv] max-w-[800px] max-h-[800px] bg-purple-600/10 rounded-full blur-[150px] opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-bold tracking-widest text-purple-400 uppercase">AI-Powered Similarity</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Recommended for You
                        </h2>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse"></div>
                        ))}
                    </div>
                ) : recommendations.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {recommendations.map((movie) => (
                            <RecommendationCard key={movie.id} {...movie} />
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 italic">No similar movies found by AI.</div>
                )}
            </div>
        </section>
    );
}
