import React, { useState } from 'react';
import axios from 'axios';

export default function ActionButtons({ movie }) {
    const [inWatchlist, setInWatchlist] = useState(false);
    const [inFavorites, setInFavorites] = useState(false);

    const toggleWatchlist = () => {
        if (!movie) return;
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

    const toggleFavorite = () => {
        if (!movie) return;
        setInFavorites(!inFavorites);
        axios.post('/user/favorites/toggle', {
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster ? movie.poster.replace('https://image.tmdb.org/t/p/w500', '') : null
        }).catch(err => {
            console.error("Failed to toggle favorite", err);
            setInFavorites(!inFavorites); // revert
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-8">
            <button className="px-6 py-3.5 md:py-4 rounded-xl text-sm md:text-base font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 transition-all flex items-center gap-3 flex-1 md:flex-none justify-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <svg className="w-5 h-5 md:w-6 md:h-6 fill-current relative z-10" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
                <span className="relative z-10">Watch Trailer</span>
            </button>
            
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
            
            <button 
                onClick={toggleFavorite}
                className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl backdrop-blur-md border transform hover:-translate-y-1 transition-all flex items-center justify-center group relative cursor-pointer ${inFavorites ? 'bg-pink-600/30 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]'}`}
                aria-label="Favorite"
            >
                <svg className={`w-6 h-6 transition-colors ${inFavorites ? 'text-pink-500 fill-pink-500' : 'text-gray-400 group-hover:text-pink-500 fill-transparent'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>
    );
}
