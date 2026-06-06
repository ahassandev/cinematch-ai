export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 w-full h-full bg-[#050505] z-0">
                {/* Background Poster/Image Matrix */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity brightness-50"></div>
                
                {/* Dynamic Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-[#050505]/90"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-transparent"></div>
                
                {/* Ambient glow blobs beneath the text */}
                <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-red-600/15 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] bg-blue-600/15 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '10s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen opacity-50 relative z-0"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center mt-8">
                <div className="max-w-4xl flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">Powered by TMDB & AI</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6 relative drop-shadow-2xl">
                        Find Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 relative inline-block">
                            Favorite Movie
                            {/* Subtle underglow */}
                            <span className="absolute -inset-2 bg-gradient-to-r from-red-600 to-purple-600 blur-[40px] opacity-20 -z-10 rounded-full"></span>
                        </span> <br />
                        with AI.
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mb-12 leading-relaxed drop-shadow-sm">
                        Smart movie recommendations based on your taste, powered by intelligent matching and massive cinematic data. Let the algorithm find exactly what you're in the mood for.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                        <button className="px-8 py-4 rounded-xl text-base md:text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 flex justify-center items-center gap-3 group relative overflow-hidden">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-12 group-hover:animate-shine"></span>
                            <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors relative z-10" fill="currentColor" viewBox="0 0 20 20">
                                <path stroke="white" strokeWidth="0.5" d="M12.43 9.42l-5-2.85A1 1 0 006 7.42v5.16a1 1 0 001.43.87l5-2.85a1 1 0 000-1.74z" />
                            </svg>
                            <span className="relative z-10 tracking-wide">Explore Movies</span>
                        </button>
                        
                        <button className="px-8 py-4 rounded-xl text-base md:text-lg font-bold text-white bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 transition-all hover:border-white/20 hover:-translate-y-1 flex justify-center items-center gap-2 group shadow-xl">
                            <span className="relative z-10 tracking-wide">Get Recommendations</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform text-purple-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Bottom fading edge matching page background */}
            <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none"></div>

            <style jsx>{`
                @keyframes shine {
                    100% {
                        transform: translateX(150%) skewX(12deg);
                    }
                }
                .animate-shine {
                    animation: shine 1.5s ease-out infinite;
                }
            `}</style>
        </section>
    );
}
