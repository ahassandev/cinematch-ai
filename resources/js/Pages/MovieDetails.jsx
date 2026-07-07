import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import MovieHero from '@/Components/MovieHero';
import MovieInfo from '@/Components/MovieInfo';

import CastSection from '@/Components/CastSection';
import Footer from '@/Components/Footer';
import axios from 'axios';

export default function MovieDetails({ auth, id, type = 'movie' }) {
    const [movieData, setMovieData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(id) {
            const endpoint = type === 'tv' ? `/api/tv/details/${id}` : `/api/movies/details/${id}`;
            axios.get(endpoint)
                .then(res => {
                    const data = res.data;
                    const isTv = type === 'tv';
                    setMovieData({
                        id: data.id,
                        title: data.title || data.name,
                        tagline: data.tagline,
                        year: (data.release_date || data.first_air_date || '').substring(0, 4) || 'N/A',
                        rating: data.vote_average ? data.vote_average.toFixed(1) : 'NR',
                        runtime: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : (data.episode_run_time && data.episode_run_time.length > 0 ? `${data.episode_run_time[0]}m` : 'N/A'),
                        genres: data.genres ? data.genres.map(g => g.name) : [],
                        poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : 'https://via.placeholder.com/500x750',
                        backdrop: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : 'https://via.placeholder.com/1920x1080',
                        overview: data.overview,
                        metadata: [
                            { label: isTv ? "First Air Date" : "Release Date", value: data.release_date || data.first_air_date },
                            ...(isTv ? [{ label: "Seasons", value: data.number_of_seasons }] : []),
                            { label: "Director", value: data.credits && data.credits.crew ? (data.credits.crew.find(c => c.job === 'Director')?.name || 'N/A') : 'N/A' },
                            { label: "Status", value: data.status },
                            { label: "Original Language", value: data.original_language ? data.original_language.toUpperCase() : 'Unknown' }
                        ],
                        cast: data.credits && data.credits.cast ? data.credits.cast.slice(0, 8).map(c => ({
                            name: c.name,
                            character: c.character,
                            image: c.profile_path ? `https://image.tmdb.org/t/p/w500${c.profile_path}` : 'https://via.placeholder.com/150'
                        })) : [],
                        reviews: data.reviews && data.reviews.results ? data.reviews.results.slice(0, 4).map(r => {
                            let avatarUrl = 'https://via.placeholder.com/150?text=User';
                            const path = r.author_details?.avatar_path;
                            
                            if (path) {
                                if (path.startsWith('http')) {
                                    avatarUrl = path;
                                } else if (path.startsWith('/')) {
                                    avatarUrl = `https://image.tmdb.org/t/p/w185${path}`;
                                } else {
                                    avatarUrl = `https://image.tmdb.org/t/p/w185/${path}`;
                                }
                            }

                            return {
                                username: r.author,
                                avatar: avatarUrl,
                                rating: r.author_details && r.author_details.rating ? `${r.author_details.rating}/10` : 'N/A',
                                date: new Date(r.created_at).toLocaleDateString(),
                                comment: r.content.substring(0, 300) + (r.content.length > 300 ? '...' : '')
                            };
                        }) : [],
                        trailerKey: data.videos && data.videos.results ? data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key : null
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed fetching movie details:", err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="bg-[#050505] min-h-screen font-sans flex items-center justify-center text-white">
                <svg className="animate-spin h-12 w-12 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (!movieData) {
        return (
            <div className="bg-[#050505] min-h-screen flex items-center justify-center text-white">
                <div className="text-xl">Movie not found</div>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen font-sans antialiased text-white selection:bg-purple-500/30 overflow-x-hidden">
            <Head title={`${movieData.title} - CineMatch AI`} />
            
            <Navbar auth={auth} />
            
            <main className="w-full relative z-0 flex flex-col pt-0">
                <MovieHero movie={movieData} auth={auth} />

                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-4">
                    <div className="flex flex-col xl:flex-row gap-10">
                        <div className="flex-1 w-full">
                            <MovieInfo overview={movieData.overview} metadata={movieData.metadata} />
                        </div>

                    </div>
                </div>

                <CastSection cast={movieData.cast} />

            </main>
            
            <Footer />
        </div>
    );
}
