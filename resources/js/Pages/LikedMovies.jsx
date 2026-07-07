import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import axios from 'axios';

export default function LikedMovies({ auth }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/user/liked-data')
            .then(res => {
                setMovies(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching liked movies", err);
                setLoading(false);
            });
    }, []);

    const removeLike = (e, movie) => {
        e.preventDefault();
        
        // Optimistic UI update
        const idToRemove = movie.id;
        setMovies(movies.filter(m => m.id !== idToRemove));

        // API call to remove feedback
        axios.post('/user/feedback/remove', {
            movie_id: movie.movie_id
        }).catch(err => {
            console.error("Failed to remove like feedback", err);
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
            <Head title="Liked Movies - CineMatch AI" />
            <Navbar auth={auth} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-[-10%] w-[50rem] h-[50rem] bg-purple-900/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 pt-20 pb-32">
                <PageHeader 
                    title="Liked Movies" 
                    subtitle="Movies you've enjoyed. These top-tier choices define your AI recommendations."
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    {loading ? (
                        <div className="flex justify-center my-12">
                            <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                    ) : movies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <div key={movie.id} className="relative group block rounded-[1.25rem] overflow-hidden bg-[#1a1a24]">
                                    <Link href={`/movie/${movie.movie_id}`} className="block relative w-full aspect-[2/3]">
                                        <div className="absolute inset-0 rounded-[1.25rem] border border-white/5 group-hover:border-purple-500/30 transition-colors duration-500 z-30 pointer-events-none"></div>
                                        <img 
                                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                                            alt={movie.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                                            <h3 className="text-white font-bold text-lg leading-snug line-clamp-1 mb-1">
                                                {movie.title}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase">Liked</span>
                                                <svg className="w-3 h-3 text-purple-500 fill-current" viewBox="0 0 20 20">
                                                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                    
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button 
                                            onClick={(e) => removeLike(e, movie)}
                                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                                            title="Remove Like"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            title="No liked movies yet"
                            description="You haven't liked any movies yet. Liking movies helps us find the perfect match for you!"
                            actionText="Discover Movies"
                            actionLink="/"
                        />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
