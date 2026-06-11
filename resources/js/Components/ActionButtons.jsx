import React, { useState } from 'react';
import axios from 'axios';
import RecommendationCard from '@/Components/RecommendationCard';
import AuthModal from '@/Components/AuthModal';
import TrailerModal from '@/Components/TrailerModal';

export default function ActionButtons({ movie, auth }) {
    const [inWatchlist, setInWatchlist] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [aiRecs, setAiRecs] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);

    React.useEffect(() => {
        if (!movie?.id || !auth?.user) return;

        setLoadingStatus(true);
        axios.get(`/user/movie-status/${movie.id}`)
            .then(res => {
                setInWatchlist(res.data.in_watchlist);
                setInFavorites(res.data.is_liked);
                setIsDisliked(res.data.is_disliked);
            })
            .catch(err => console.error("Failed to fetch movie status", err))
            .finally(() => setLoadingStatus(false));
    }, [movie?.id, auth?.user]);

    const toggleWatchlist = () => {
        if (!movie) return;
        if (!auth?.user) {
            setShowAuthModal(true);
            return;
        }
        setInWatchlist(!inWatchlist);
        axios.post('/user/watchlist/toggle', {
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null,
            year: movie.year,
            genres: movie.genre || (movie.genres ? movie.genres[0] : null)
        }).catch(err => {
            console.error("Failed to toggle watchlist", err);
            setInWatchlist(!inWatchlist); // revert
        });
    };

    const fetchAiRecs = async (movieId) => {
        setLoadingRecs(true);
        try {
            const res = await axios.get(`/api/movies/ai-recommendations/${movieId}`);
            const rawRecs = res.data.results || [];
            
            const mapped = rawRecs.slice(0, 4).map((r, index) => ({
                id: r.id,
                title: r.title,
                rating: r.vote_average ? r.vote_average.toFixed(1) : 'NR',
                genre: r.ai_genre_name || 'Movie',
                director: r.ai_director || 'N/A',
                image: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
                year: r.release_date ? r.release_date.substring(0, 4) : 'N/A',
                matchScore: Math.max(75, 98 - index * 4)
            }));
            
            setAiRecs(mapped);
        } catch (err) {
            console.error("Failed to fetch AI recs", err);
        } finally {
            setLoadingRecs(false);
        }
    };

    const toggleFavorite = () => {
        if (!movie) return;
        if (!auth?.user) {
            setShowAuthModal(true);
            return;
        }
        
        const newState = !inFavorites;
        setInFavorites(newState);
        if (newState) {
            setIsDisliked(false);
            fetchAiRecs(movie.id);
        } else {
            setAiRecs([]);
        }

        // Update favorites
        axios.post('/user/favorites/toggle', {
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null
        }).catch(err => {
            console.error("Failed to toggle favorite", err);
            setInFavorites(!newState); // revert
        });

        // Also update feedback if liked
        if (newState) {
            axios.post('/user/feedback', {
                movie_id: movie.id,
                type: 'like',
                title: movie.title,
                poster_path: movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null,
                genre: movie.genres && movie.genres.length > 0 ? movie.genres[0] : null,
                tmdb_rating: movie.rating ? parseFloat(movie.rating) : null,
            }).catch(err => console.error("Feedback update failed", err));
        }
    };

    const toggleDislike = () => {
        if (!movie) return;
        if (!auth?.user) {
            setShowAuthModal(true);
            return;
        }

        const newState = !isDisliked;
        setIsDisliked(newState);
        if (newState) {
            setInFavorites(false);
            setAiRecs([]);
            
            // Update feedback
            axios.post('/user/feedback', {
                movie_id: movie.id,
                type: 'dislike',
                title: movie.title,
                poster_path: movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null
            }).catch(err => {
                console.error("Failed to update feedback", err);
                setIsDisliked(false); // revert
            });

            // If we were favorites, remove from favorites
            if (inFavorites) {
                axios.post('/user/favorites/toggle', {
                    movie_id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null
                }).catch(err => console.error("Favorite removal failed", err));
            }
        }
    };

    return (
        <div className="flex flex-col gap-8 mt-8">
            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
            />
            <TrailerModal 
                isOpen={showTrailerModal} 
                onClose={() => setShowTrailerModal(false)} 
                trailerKey={movie?.trailerKey}
                title={movie?.title}
            />
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {movie?.trailerKey && (
                    <button 
                        onClick={() => setShowTrailerModal(true)}
                        className="px-6 py-3.5 md:py-4 rounded-xl text-sm md:text-base font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 transition-all flex items-center gap-3 flex-1 md:flex-none justify-center group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <svg className="w-5 h-5 md:w-6 md:h-6 fill-current relative z-10" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <span className="relative z-10">Watch Trailer</span>
                    </button>
                )}
                
                <button 
                    onClick={toggleWatchlist}
                    className={`px-5 py-3.5 md:py-4 rounded-xl text-sm md:text-base font-bold text-white backdrop-blur-md border transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group flex-1 md:flex-none ${inWatchlist ? 'bg-purple-600/30 border-purple-500 hover:bg-purple-600/50' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                >
                    <svg className={`w-5 h-5 transition-colors ${inWatchlist ? 'text-white' : 'text-gray-300 group-hover:text-white'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        {inWatchlist ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        )}
                    </svg>
                    <span className={`transition-colors ${inWatchlist ? 'text-white' : 'group-hover:text-white text-gray-200'}`}>
                        {inWatchlist ? 'In Watchlist' : 'Watchlist'}
                    </span>
                </button>
                
                <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 gap-1">
                    <button 
                        onClick={toggleFavorite}
                        className={`w-11 h-11 md:w-12 md:h-12 rounded-lg transition-all flex items-center justify-center group relative cursor-pointer ${inFavorites ? 'bg-blue-600/40 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'hover:bg-white/10 text-gray-400 hover:text-blue-400'}`}
                        aria-label="Like"
                        title="Like"
                    >
                        <svg className={`w-5 h-5 md:w-6 md:h-6 transition-all ${inFavorites ? 'fill-current' : 'fill-transparent group-hover:scale-110'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                        </svg>
                    </button>

                    <div className="w-[1px] h-6 bg-white/10 mx-0.5"></div>

                    <button 
                        onClick={toggleDislike}
                        className={`w-11 h-11 md:w-12 md:h-12 rounded-lg transition-all flex items-center justify-center group relative cursor-pointer ${isDisliked ? 'bg-red-600/40 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'hover:bg-white/10 text-gray-400 hover:text-red-500'}`}
                        aria-label="Dislike"
                        title="Dislike"
                    >
                        <svg className={`w-5 h-5 md:w-6 md:h-6 transition-all ${isDisliked ? 'fill-current' : 'fill-transparent group-hover:scale-110'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* AI Recommendations Section */}
            {(loadingRecs || aiRecs.length > 0) && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center border-2 border-[#050505] z-10">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z"></path></svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 whitespace-nowrap">
                            {loadingRecs ? 'AI is finding matches...' : 'Because you liked this movie'}
                        </h3>
                        <div className="h-px bg-gradient-to-r from-purple-500/30 to-transparent flex-1"></div>
                    </div>

                    {loadingRecs ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {aiRecs.map(rec => (
                                <RecommendationCard key={rec.id} {...rec} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
