import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import axios from 'axios';

export default function DislikedMovies({ auth }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/user/disliked-data')
            .then(res => {
                setMovies(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching disliked movies", err);
                setLoading(false);
            });
    }, []);

    const removeDislike = (e, movie) => {
        e.preventDefault();
        
        // Optimistic UI update
        const idToRemove = movie.id;
        setMovies(movies.filter(m => m.id !== idToRemove));

        // API call to remove feedback
        axios.post('/api/user/feedback/remove', {
            movie_id: movie.movie_id
        }).catch(err => {
            console.error("Failed to remove dislike feedback", err);
            // Re-fetch or revert on failure could be added
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
            <Head title="Disliked Movies - CineMatch AI" />
            <Navbar auth={auth} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-[-10%] w-[50rem] h-[50rem] bg-red-900/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 pt-20 pb-32">
                <PageHeader 
                    title="Disliked Movies" 
                    subtitle="Movies you've marked as not for you. This helps our AI refine your taste profile."
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    {loading ? (
                        <div className="flex justify-center my-12">
                            <svg className="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                    ) : movies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <div key={movie.id} className="relative group block rounded-[1.25rem] overflow-hidden bg-[#1a1a24]">
                                    <Link href={`/movie/${movie.movie_id}`} className="block relative w-full aspect-[2/3]">
                                        <div className="absolute inset-0 rounded-[1.25rem] border border-white/5 group-hover:border-red-500/30 transition-colors duration-500 z-30 pointer-events-none"></div>
                                        <img 
                                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
                                            alt={movie.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                                            <h3 className="text-white font-bold text-lg leading-snug line-clamp-1 mb-1">
                                                {movie.title}
                                            </h3>
                                            <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase">Disliked</span>
                                        </div>
                                    </Link>
                                    
                                    <div className="absolute top-2 right-2 flex flex-col gap-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button 
                                            onClick={(e) => removeDislike(e, movie)}
                                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                                            title="Undo Dislike"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            title="No disliked movies"
                            description="You haven't disliked any movies yet. Disliking movies you don't like helps our AI understand your taste better!"
                            actionText="Discover Movies"
                            actionLink="/movies"
                        />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
