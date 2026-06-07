import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PageHeader from '@/Components/PageHeader';
import TrendingMovies from '@/Components/TrendingMovies';

export default function Trending({ auth }) {
    // We can reuse TrendingMovies.jsx which looks like a carousel.
    // If we need multiple sections, we can render multiple instances of it.
    
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
            <Head title="Trending - CineMatch AI" />
            <Navbar auth={auth} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-blue-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-purple-900/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 pt-20 pb-32">
                <PageHeader 
                    title="Trending Now" 
                    subtitle="Discover what people are watching right now. Updated daily across the globe."
                />

                <div className="mt-12">
                    <TrendingMovies 
                        title="Trending Today" 
                        period="day" 
                        type="trending"
                        subtitle="The most popular movies across the world in the last 24 hours."
                    />
                    
                    <TrendingMovies 
                        title="Most Popular This Week" 
                        period="week" 
                        type="trending"
                        subtitle="Movies that have gained the most traction over the past 7 days."
                    />

                    <TrendingMovies 
                        title="Top Rated Movies" 
                        type="top_rated"
                        subtitle="Cinematic masterpieces highly rated by the global community."
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
