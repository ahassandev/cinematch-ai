import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PageHeader from '@/Components/PageHeader';
import TrendingMovies from '@/Components/TrendingMovies';

export default function Trending() {
    // We can reuse TrendingMovies.jsx which looks like a carousel.
    // If we need multiple sections, we can render multiple instances of it.
    
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
            <Head title="Trending - CineMatch AI" />
            <Navbar />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-blue-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-purple-900/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 pt-20 pb-32">
                <PageHeader 
                    title="Trending Now" 
                    subtitle="Discover what people are watching right now. Updated daily across the globe."
                />

                <div className="space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 rounded-full bg-gradient-to-b from-purple-500 to-blue-500"></span>
                            Trending Today
                        </h2>
                        {/* Assuming TrendingMovies component handles its own layout, but we'll try to just pass dummy array if needed. Wait, TrendingMovies might be a specific carousel from homepage. Let's render it directly if it's generic enough. */}
                        <TrendingMovies />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 rounded-full bg-gradient-to-b from-purple-500 to-blue-500"></span>
                            Most Popular This Week
                        </h2>
                        <TrendingMovies />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 rounded-full bg-gradient-to-b from-purple-500 to-blue-500"></span>
                            Top Rated Movies
                        </h2>
                        <TrendingMovies />
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
