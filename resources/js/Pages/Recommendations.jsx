import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SearchBar from '@/Components/SearchBar';
import RecommendationCard from '@/Components/RecommendationCard';
import axios from 'axios';

export default function Recommendations({ auth }) {
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async (query) => {
        setLoading(true);
        setError('');

        // Record search history (web route = session aware)
        axios.get(`/user/record-search?query=${encodeURIComponent(query)}`).catch(() => {});

        try {
            // First search for the movie
            const searchRes = await axios.get(`/api/movies/search?query=${query}`);
            const searchResults = searchRes.data.results;
            
            if (searchResults && searchResults.length > 0) {
                // Take the first result as the primary target
                const targetMovie = searchResults[0];
                
                // Fetch recommendations for this specific movie
                const recRes = await axios.get(`/api/movies/recommendations/${targetMovie.id}`);
                const rawRecs = recRes.data.results || [];
                
                // Map to our component format
                const mappedRecs = rawRecs.slice(0, 10).map((r, index) => ({
                    id: r.id,
                    title: r.title,
                    rating: r.vote_average ? r.vote_average.toFixed(1) : 'NR',
                    genre: 'Movie', // Simplification, TMDB provides genre_ids
                    image: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
                    year: r.release_date ? r.release_date.substring(0, 4) : 'N/A',
                    matchScore: Math.max(50, 99 - index * 3) // Simulated declining match score
                }));
                
                setRecommendations(mappedRecs);
                setHasSearched(true);
            } else {
                setError('No movies found for that search. Try something else!');
                setHasSearched(false);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch recommendations. Try again later.');
            setHasSearched(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
            <Head title="AI Recommendations - CineMatch AI" />
            <Navbar auth={auth} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[50rem] h-[50rem] bg-purple-900/15 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-blue-900/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 pt-32 pb-32">
                <div className="text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a24] border border-white/10 text-purple-400 font-bold text-sm tracking-wide mb-6 shadow-xl">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd"></path></svg>
                        POWERED BY AI
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white drop-shadow-2xl mb-6 tracking-tight">
                        AI Recommendations
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-400">
                        Movies selected specifically based on your unique interests.
                    </p>
                </div>

                <SearchBar onSearch={handleSearch} />

                {error && (
                    <div className="max-w-xl mx-auto px-4 text-center mt-[-40px] mb-8 text-red-500 font-bold bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                        {error}
                    </div>
                )}

                {hasSearched && !loading ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-2 h-8 rounded-full bg-gradient-to-b from-green-400 to-emerald-600"></span>
                                Top Matches for You
                            </h2>
                            <button onClick={() => setHasSearched(false)} className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors">
                                Clear Results
                            </button>
                        </div>
                        
                        {recommendations.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                                {recommendations.map((movie) => (
                                    <RecommendationCard key={movie.id} {...movie} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 my-16">
                                No recommendations found for this specific movie.
                            </div>
                        )}
                    </div>
                ) : !loading && !hasSearched && !error ? (
                    <div className="max-w-4xl mx-auto px-4 mt-8 text-center text-gray-500 italic">
                        Try searching for a movie you love (e.g., "Interstellar") to see AI matches...
                    </div>
                ) : null}
            </main>

            <Footer />
        </div>
    );
}
