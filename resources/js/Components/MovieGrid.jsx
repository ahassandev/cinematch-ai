import MovieCard from './MovieCard';

export default function MovieGrid({ title, subtitle, movies = [], loading = false }) {
    // Array of mock movies for visual testing since real API is disabled right now
    const DUMMY_MOVIES = [
        { id: 1, title: 'Inception', rating: '8.8', genre: 'Sci-Fi', year: 2010, image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop' },
        { id: 2, title: 'Blade Runner 2049', rating: '8.0', genre: 'Sci-Fi', year: 2017, image: 'https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=1974&auto=format&fit=crop' },
        { id: 3, title: 'The Dark Knight', rating: '9.0', genre: 'Action', year: 2008, image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop' },
        { id: 4, title: 'Interstellar', rating: '8.6', genre: 'Sci-Fi', year: 2014, image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop' },
        { id: 5, title: 'Dune', rating: '8.0', genre: 'Sci-Fi', year: 2021, image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop' },
        { id: 6, title: 'The Matrix', rating: '8.7', genre: 'Action', year: 1999, image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop' },
        { id: 7, title: 'Joker', rating: '8.4', genre: 'Drama', year: 2019, image: 'https://images.unsplash.com/photo-1574267432553-4b462808152a?q=80&w=2070&auto=format&fit=crop' },
        { id: 8, title: 'Avengers: Endgame', rating: '8.4', genre: 'Action', year: 2019, image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=2070&auto=format&fit=crop' },
    ];

    const displayMovies = movies;

    return (
        <section className="py-16 bg-[#050505] relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-4 tracking-tight">
                        <span className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
                        {title}
                    </h2>
                    {subtitle && <p className="text-gray-400 font-medium ml-6">{subtitle}</p>}
                </div>
            </div>

            {loading ? (
                /* Skeleton Loader Grid */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-full aspect-[2/3] bg-[#111] rounded-[1.25rem] animate-pulse relative overflow-hidden border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent w-[200%] animate-[shimmer_1.5s_infinite] -translate-x-[100%]"></div>
                            <div className="absolute bottom-4 left-4 w-3/4 h-5 bg-white/10 rounded"></div>
                            <div className="absolute top-4 right-4 w-12 h-6 bg-white/10 rounded-md"></div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Movie Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                    {displayMovies.map((movie) => (
                        <div key={movie.id} className="w-full flex justify-center perspective-[1000px]">
                            <MovieCard 
                                title={movie.title}
                                rating={movie.rating}
                                genre={movie.genre}
                                image={movie.image}
                                year={movie.year}
                            />
                        </div>
                    ))}
                </div>
            )}
            
            <style jsx>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </section>
    );
}
