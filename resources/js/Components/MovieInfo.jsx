export default function MovieInfo({ overview, metadata }) {
    return (
        <section className="py-12 relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Overview Text */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                        Overview
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                        {overview}
                    </p>
                </div>

                {/* Info Cards */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest hidden lg:block opacity-0">Details</h2>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-1 md:grid-cols-3 gap-4">
                        {metadata.map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/[0.07] transition-colors">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{item.label}</h4>
                                <p className="text-white font-medium text-base">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
