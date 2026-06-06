export default function FeatureSection() {
    const features = [
        {
            title: "AI Movie Matching",
            description: "Our advanced algorithm analyzes your taste to find movies you're mathematically guaranteed to love.",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            ),
            color: "from-blue-600 to-cyan-600",
            glow: "shadow-cyan-500/20"
        },
        {
            title: "Smart Recommendations",
            description: "No more endless scrolling. Get highly curated lists of cinematic masterpieces instantly.",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            ),
            color: "from-purple-600 to-pink-600",
            glow: "shadow-purple-500/20"
        },
        {
            title: "User Feedback Learning",
            description: "Hit 👍 or 👎 on movies and watch the AI adapt in real-time. It learns what you want.",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            ),
            color: "from-red-600 to-orange-600",
            glow: "shadow-red-500/20"
        }
    ];

    return (
        <section className="py-24 relative bg-[#0a0a0f] z-10 w-full overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]"></div>
            
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                        Why Choose CineMatch AI?
                    </h2>
                    <p className="text-lg text-gray-400">
                        We blend massive cinematic databases with state-of-the-art machine learning algorithms to solve the biggest problem in entertainment: "What do we watch tonight?"
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group relative">
                            {/* Glass Card Container */}
                            <div className="h-full bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-default">
                                
                                {/* Top Glow Accent */}
                                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-white/70 transition-all duration-500`}></div>

                                {/* Icon Container with Glow */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500 rounded-full`}></div>
                                    <div className={`relative z-10 w-full h-full bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center ${feature.glow} shadow-xl border border-white/10 group-hover:border-white/30 transition-colors`}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {feature.icon}
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
