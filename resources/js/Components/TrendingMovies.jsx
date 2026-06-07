import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import axios from 'axios';

export default function TrendingMovies({ 
    title = "Trending Movies", 
    period = "day", 
    type = "trending",
    subtitle = "Handpicked AI selections based on global trends." 
}) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/movies/trending', {
                    params: { period, type }
                });
                setMovies(response.data.results || []);
            } catch (error) {
                console.error("Failed to fetch trending movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [period, type]);

    return (
        <section className="py-20 relative bg-black">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                            {title}
                        </h2>
                        <p className="text-gray-400">{subtitle}</p>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative group">
                    <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-8 pt-4 hide-scrollbar snap-x snap-mandatory">
                        {loading ? (
                            // Skeleton Loading State
                            [1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="snap-start w-[260px] md:w-[300px] shrink-0 aspect-[2/3] bg-[#1a1a24] animate-pulse rounded-[1.25rem]"></div>
                            ))
                        ) : movies.length > 0 ? (
                            movies.map((movie) => (
                                <div key={movie.id} className="snap-start w-[260px] md:w-[300px] shrink-0">
                                    <MovieCard 
                                        id={movie.id}
                                        title={movie.title}
                                        rating={movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
                                        genre={movie.release_date ? movie.release_date.substring(0, 4) : 'Movie'}
                                        image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-12 text-gray-500">
                                No movies found.
                            </div>
                        )}
                    </div>
                    
                    {/* Fade Edges for Scroll indication */}
                    <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
                </div>
            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
        </section>
    );
}
