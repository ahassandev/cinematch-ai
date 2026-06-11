import React, { useState } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Dashboard({ auth, stats }) {
    const user = auth?.user || { name: 'Guest' };

    const recentWatchlist = stats?.recent_watchlists ?? [];
    const [localRecentSearches, setLocalRecentSearches] = useState(stats?.recent_searches ?? []);

    const handleDeleteSearch = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await axios.delete(`/user/search-history/${id}`);
            setLocalRecentSearches(localRecentSearches.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete search history:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <Head title="Dashboard - CineMatch AI" />
            <Navbar auth={auth} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050505] to-[#050505]"></div>
            </div>

            <main className="relative z-10 pt-32 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white mb-2">
                            Welcome back, {user.name}
                        </h1>
                        <p className="text-gray-400 text-lg">Here's your personal cinematic universe snapshot.</p>
                    </div>
                    <Link
                        href="/recommendations"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-transform hover:scale-105 shadow-[0_10px_30px_rgba(147,51,234,0.3)]"
                    >
                      View Recommendations
                    </Link>
                </div>



                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Recent Searches */}
                    <section className="bg-[#1a1a24]/60 border border-white/10 rounded-[1.5rem] p-6 backdrop-blur-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            Recent Searches
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {localRecentSearches.length > 0 ? (
                                localRecentSearches.map((search, i) => (
                                    <div key={search.id || i} className="group/item relative">
                                        <Link
                                            href={`/?q=${encodeURIComponent(search.query)}`}
                                            className="px-4 py-2 bg-[#0a0a0f] border border-white/5 rounded-full text-sm text-gray-300 hover:bg-white/5 hover:border-purple-500/30 hover:text-purple-300 transition-all cursor-pointer flex items-center gap-2 pr-8"
                                        >
                                            🔍 {search.query}
                                        </Link>
                                        <button
                                            onClick={(e) => handleDeleteSearch(e, search.id)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 opacity-0 group-hover/item:opacity-100 hover:bg-red-500 hover:text-white transition-all text-[10px]"
                                            title="Delete search"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-sm">
                                    No recent searches yet. Try searching a movie!
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Recent Watchlist */}
                    <div className="bg-[#1a1a24]/60 border border-white/10 rounded-[1.5rem] p-6 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
                                </svg>
                                Watchlist
                            </h2>
                            <Link href="/watchlist" className="text-purple-400 font-bold hover:text-purple-300 text-sm transition-colors">
                                See all →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentWatchlist.length > 0 ? (
                                recentWatchlist.map(movie => (
                                    <Link
                                        key={movie.id}
                                        href={`/movie/${movie.movie_id}`}
                                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="w-14 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-[#0a0a0f]">
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">🎬</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                                                {movie.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">
                                                {movie.year || 'N/A'}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="text-4xl mb-3">🎬</div>
                                    <p className="text-gray-500 italic text-sm">No movies saved yet.</p>
                                    <Link href="/" className="mt-3 text-purple-400 text-sm font-bold hover:text-purple-300 transition-colors">
                                        Discover Movies →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
