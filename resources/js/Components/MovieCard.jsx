import { Link } from '@inertiajs/react';

export default function MovieCard({ id, title, rating, genre, image, year, inWatchlist = false, isLiked = false, isDisliked = false, additionalClasses = "" }) {
    const detailsUrl = genre === 'TV Series' ? `/tv/${id}` : `/movie/${id}`;

    return (
        <Link href={detailsUrl} className={`group relative w-full aspect-[2/3] shrink-0 rounded-[1.25rem] overflow-hidden cursor-pointer transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] block ${additionalClasses}`}>
            
            {/* Edge lighting / Border glow */}
            <div className="absolute inset-0 rounded-[1.25rem] border-2 border-transparent group-hover:border-white/20 transition-colors duration-500 z-30 pointer-events-none"></div>
            
            {/* Subtle glow behind card on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 rounded-[1.25rem]"></div>

            {/* Movie Poster Image */}
            <div className="w-full h-full relative z-0">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                    }}
                />
                
                {/* Multi-layered Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-transparent opacity-50"></div>
                
                {/* Top Badge Container */}
                <div className="absolute top-3 w-full px-3 flex justify-between items-start z-20">
                    {/* Rating Badge */}
                    <div className="bg-black/40 backdrop-blur-xl px-2.5 py-1.5 rounded-lg text-sm font-bold border border-white/10 flex items-center gap-1.5 shadow-lg group-hover:border-white/20 transition-colors">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white text-xs tracking-wide">{rating}</span>
                    </div>

                    {/* Quality/Features Badges */}
                    <div className="flex flex-col gap-1.5 items-end">
                        <div className="bg-black/40 backdrop-blur-xl px-2 py-1 rounded-md border border-white/10 group-hover:border-white/20 transition-colors">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">4K</span>
                        </div>
                        
                        {/* Status Interaction Badges */}
                        <div className="flex flex-col gap-1.5">
                            {/* Watchlist Badge */}
                            <div className={`transition-all duration-300 bg-black/40 backdrop-blur-xl p-2 rounded-md border border-white/10 group-hover:translate-x-0 translate-x-2 opacity-0 group-hover:opacity-100 flex items-center justify-center ${inWatchlist ? '!opacity-100 !translate-x-0 !border-purple-500/50 !bg-purple-600/30' : ''}`}>
                                <svg className={`w-3.5 h-3.5 ${inWatchlist ? 'text-purple-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>

                            {/* Like/Favorite Badge */}
                            <div className={`transition-all duration-300 bg-black/40 backdrop-blur-xl p-2 rounded-md border border-white/10 group-hover:translate-x-0 translate-x-3 opacity-0 group-hover:opacity-100 flex items-center justify-center delay-75 ${isLiked ? '!opacity-100 !translate-x-0 !border-blue-500/50 !bg-blue-600/30' : ''}`}>
                                <svg className={`w-3.5 h-3.5 ${isLiked ? 'text-blue-400 fill-current' : 'text-gray-400 fill-transparent'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Play Button Overlay (visible on hover) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.15)] opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out group-hover:delay-100">
                        <svg className="w-6 h-6 text-white ml-1 translate-x-[1px]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                {/* Bottom Content Info */}
                <div className="absolute bottom-0 left-0 w-full p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {year && (
                            <span className="text-[11px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm tracking-wider">{year}</span>
                        )}
                        <span className="text-[11px] font-bold text-purple-400 tracking-widest uppercase">{genre}</span>
                    </div>
                    
                    <h3 className="text-white font-bold text-xl leading-snug line-clamp-1 group-hover:line-clamp-2 transition-all drop-shadow-md">
                        {title}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
