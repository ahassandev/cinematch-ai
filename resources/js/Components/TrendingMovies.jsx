import MovieCard from './MovieCard';

// Dummy JSON Data for movies
const TRENDING_MOVIES = [
    {
        id: 1,
        title: "Interstellar",
        rating: "8.6",
        genre: "Sci-Fi",
        image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Joker",
        rating: "8.4",
        genre: "Drama",
        image: "https://images.unsplash.com/photo-1574267432553-4b462808152a?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Blade Runner 2049",
        rating: "8.0",
        genre: "Sci-Fi",
        image: "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=1974&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Dune",
        rating: "8.0",
        genre: "Adventure",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Inception",
        rating: "8.8",
        genre: "Action",
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "The Matrix",
        rating: "8.7",
        genre: "Action",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function TrendingMovies() {
    return (
        <section className="py-20 relative bg-black">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="w-2 h-8 bg-red-600 rounded-full"></span>
                            Trending Movies
                        </h2>
                        <p className="text-gray-400">Handpicked AI selections based on global trends.</p>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative group">
                    <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-8 pt-4 hide-scrollbar snap-x snap-mandatory">
                        {TRENDING_MOVIES.map((movie) => (
                            <div key={movie.id} className="snap-start">
                                <MovieCard 
                                    title={movie.title}
                                    rating={movie.rating}
                                    genre={movie.genre}
                                    image={movie.image}
                                />
                            </div>
                        ))}
                    </div>
                    
                    {/* Fade Edges for Scroll indication */}
                    <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
                </div>
            </div>

            {/* Custom CSS for hiding scrollbar added inline for simplicity */}
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
