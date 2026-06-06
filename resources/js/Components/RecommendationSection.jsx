import MovieCard from './MovieCard';

export default function RecommendationSection() {
    const RECOMMENDED_MOVIES = [
        { id: 101, title: 'Arrival', rating: '7.9', genre: 'Sci-Fi', year: 2016, match: 96, image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2058&auto=format&fit=crop' },
        { id: 102, title: 'Ex Machina', rating: '7.7', genre: 'Sci-Fi', year: 2014, match: 92, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop' },
        { id: 103, title: 'Gravity', rating: '7.7', genre: 'Sci-Fi', year: 2013, match: 89, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop' },
        { id: 104, title: 'Her', rating: '8.0', genre: 'Drama', year: 2013, match: 85, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070&auto=format&fit=crop' },
    ];

    return (
        <section className="py-24 relative bg-black/50 overflow-hidden border-t border-t-white/5">
            {/* Background glowing orb for AI feel */}
            <div className="absolute top-0 right-0 w-[80wv] h-[80wv] max-w-[800px] max-h-[800px] bg-purple-600/10 rounded-full blur-[150px] opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                
                {/* Section Header with AI Indicator */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-purple-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-bold tracking-widest text-purple-400 uppercase">AI-Generated Matches</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Recommended for You
                        </h2>
                    </div>
                </div>

                {/* Recommendations Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {RECOMMENDED_MOVIES.map((movie) => (
                        <div key={movie.id} className="relative group perspective-[1000px]">
                            {/* Match Percentage Badge overlay on card */}
                            <div className="absolute -top-3 -right-3 z-50 transform rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                                <div className="bg-gradient-to-br from-green-400 to-green-600 text-black font-black text-xs md:text-sm px-3 md:px-4 py-2 rounded-xl shadow-[0_10px_20px_rgba(34,197,94,0.4)] border-2 border-black">
                                    {movie.match}% MATCH
                                </div>
                            </div>
                            
                            <MovieCard 
                                title={movie.title}
                                rating={movie.rating}
                                genre={movie.genre}
                                image={movie.image}
                                year={movie.year}
                                additionalClasses="ring-1 ring-purple-500/20 group-hover:ring-purple-500/50"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
