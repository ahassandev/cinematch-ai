import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SearchBar from '@/Components/SearchBar';
import RecommendationCard from '@/Components/RecommendationCard';
import axios from 'axios';

export default function Recommendations({ auth }) {
    const [loading, setLoading] = useState(true);
    const [personalizedRecs, setPersonalizedRecs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPersonalized();
    }, [auth.user]);

    const fetchPersonalized = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('/api/movies/personalized');
            const rawRecs = res.data.results || [];
            
            const mapped = rawRecs.map((r, index) => ({
                id: r.id,
                title: r.title,
                rating: r.vote_average ? r.vote_average.toFixed(1) : 'NR',
                genre: r.ai_genre_name || 'Movie',
                director: r.ai_director || null,
                description: r.ai_description || null,
                matchType: r.ai_reason || 'type',
                image: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
                year: r.release_date ? r.release_date.substring(0, 4) : 'N/A',
                matchScore: r.score || Math.max(70, 95 - index * 5)
            }));
            
            setPersonalizedRecs(mapped);
        } catch (err) {
            console.error("Personalized fetch failed", err);
            setError('Unable to load recommendations. Please try refreshing.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
            <Head title="Discovery Feed - CineMatch AI" />
            <Navbar auth={auth} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[50rem] h-[50rem] bg-purple-900/15 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 pt-32 pb-32">
                <div className="text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a24] border border-white/10 text-purple-400 font-bold text-sm tracking-wide mb-6 shadow-xl">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd"></path></svg>
                        PERSONALIZED FEED
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white drop-shadow-2xl mb-6 tracking-tight">
                        Discovery Feed
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-400">
                        Sit back and relax. We've handpicked these movies specifically for you.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {error && (
                        <div className="max-w-xl mx-auto px-4 text-center mb-12 text-red-500 font-bold bg-red-500/10 py-4 rounded-2xl border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-green-400 to-emerald-600"></span>
                                Top AI Picks
                            </h2>
                        </div>
                        
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                    <div key={i} className="aspect-[2/3] rounded-[1.25rem] bg-white/5 animate-pulse border border-white/5"></div>
                                ))}
                            </div>
                        ) : personalizedRecs.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                                {personalizedRecs.map((movie) => (
                                    <RecommendationCard key={movie.id} {...movie} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white/5 rounded-[2rem] border border-white/10 px-6 backdrop-blur-md">
                                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-purple-500/20 shadow-2xl">
                                    <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Feed is being prepared</h3>
                                <p className="text-gray-400 max-w-sm mx-auto mb-10 leading-relaxed text-lg">Like some movies or search for films to help the AI understand your unique taste better.</p>
                                <a href="/movies" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-xl">
                                    Browse Movies
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
