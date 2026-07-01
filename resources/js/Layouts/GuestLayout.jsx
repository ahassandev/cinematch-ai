import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Cinematic Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-700/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-red-800/8 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Card (Logo inside) */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                    {/* Logo inside card at top */}
                    <div className="flex justify-center mb-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-[0_0_16px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_28px_rgba(220,38,38,0.7)] transition-all duration-300 border border-red-500/30">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
                                CineMatch AI
                            </span>
                        </Link>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
