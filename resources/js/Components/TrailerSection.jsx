export default function TrailerSection({ backdrop }) {
    return (
        <section className="py-12 relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3 mb-8">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                Official Trailer
            </h2>
            
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/20 transition-colors shadow-2xl">
                {/* Background Image */}
                <img 
                    src={backdrop} 
                    alt="Trailer Thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy"
                />
                
                {/* Dark Overlay gradient */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-red-600/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.6)] group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 transform group-hover:shadow-[0_0_60px_rgba(220,38,38,0.8)] border border-white/20">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
