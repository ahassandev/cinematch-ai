import { useState, useRef } from 'react';

export default function CastSection({ cast }) {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                    Top Cast
                </h2>
                
                {/* Scroll Buttons */}
                <div className="hidden md:flex gap-3">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative group">
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 hide-scrollbar snap-x snap-mandatory"
                >
                    {cast.map((actor, idx) => (
                        <div key={idx} className="w-[140px] md:w-[180px] shrink-0 snap-start group/card relative">
                            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden mb-4 border border-white/10 group-hover/card:border-white/20 transition-colors shadow-lg">
                                <img 
                                    src={actor.image} 
                                    alt={actor.name} 
                                    className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Photo';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                            </div>
                            <h4 className="text-white font-bold text-sm md:text-base leading-tight mb-1 truncate">{actor.name}</h4>
                            <p className="text-gray-400 text-xs md:text-sm font-medium truncate">{actor.character}</p>
                        </div>
                    ))}
                </div>
                
                {/* Fade Edges for Scroll indication */}
                <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10 md:hidden"></div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
