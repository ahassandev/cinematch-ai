import ActionButtons from './ActionButtons';

export default function MovieHero({ movie, auth }) {
    return (
        <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden min-h-[85vh] flex items-center bg-[#050505]">
            {/* Blurred Background with Gradients */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity brightness-50 blur-sm transform scale-105"
                    style={{ backgroundImage: `url('${movie.backdrop || movie.poster}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/40"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent"></div>
                <div className="absolute -left-1/4 top-1/4 w-[50vw] h-[50vw] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start md:items-center">
                    
                    {/* Left side: Poster */}
                    <div className="w-[60%] sm:w-[45%] md:w-[30%] lg:w-[25%] shrink-0 mx-auto md:mx-0 group perspective-[1000px]">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-white/20 transition-all duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02]">
                            <img 
                                src={movie.poster} 
                                alt={movie.title} 
                                className="w-full aspect-[2/3] object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>

                    {/* Right side: Info */}
                    <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                        {/* Title & Tagline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-tight mb-4 drop-shadow-2xl">
                            {movie.title}
                        </h1>
                        {movie.tagline && (
                            <p className="text-xl md:text-2xl font-light text-gray-300 italic mb-6">
                                "{movie.tagline}"
                            </p>
                        )}

                        {/* Meta Info Row */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mb-8 text-sm md:text-base font-medium">
                            <span className="text-white bg-white/10 px-3 py-1 rounded-md border border-white/10">{movie.year}</span>
                            <div className="flex items-center gap-1.5 text-yellow-500 font-bold bg-black/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {movie.rating} TMDB
                            </div>
                            <span className="text-gray-300 tracking-wider uppercase font-semibold">{movie.runtime}</span>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
                            {movie.genres.map((genre, idx) => (
                                <span key={idx} className="px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide text-purple-300 bg-purple-900/40 border border-purple-500/30">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Interactive Buttons */}
                        <ActionButtons movie={movie} auth={auth} />
                    </div>
                </div>
            </div>
            
            {/* Bottom transition gradient to body */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div>
        </section>
    );
}
