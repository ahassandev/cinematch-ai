import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar({ auth }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav 
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                scrolled 
                    ? 'bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)]' 
                    : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center transition-all duration-300">
                    
                    {/* Main Menu Links & Logo */}
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group relative">
                            {/* Logo Glow Behind */}
                            <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all z-10 border border-red-500/30">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight z-10">
                                CineMatch AI
                            </span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex space-x-1">
                            {[
                                { name: 'Home', href: '/' }, 
                                { name: 'Movies', href: '/movies' }, 
                                { name: 'Trending', href: '/trending' }
                            ].map((item) => (
                                <Link key={item.name} href={item.href} className="px-4 py-2 rounded-full text-sm font-semibold tracking-wide text-gray-300 hover:text-white hover:bg-white/5 transition-all relative overflow-hidden group">
                                    {item.name}
                                </Link>
                            ))}
                            
                            <Link href="/recommendations" className="px-4 py-2 flex items-center gap-2 rounded-full relative group overflow-hidden">
                                <div className="absolute inset-0 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400 font-semibold tracking-wide text-sm relative z-10 transition-all group-hover:brightness-125">
                                    Recommendations
                                </span>
                                <span className="relative flex w-2 h-2 z-10">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full w-2 h-2 bg-red-500"></span>
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Right side buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link 
                            href="/movies"
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors border border-white/5"
                            aria-label="Search Movies"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Link>
                        
                        <div className="w-px h-6 bg-white/10 mx-2"></div>

                        {auth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-gray-300 hover:text-white text-sm font-semibold transition-colors px-4 py-2 hover:bg-white/5 rounded-full"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-gray-300 hover:text-white text-sm font-semibold transition-colors px-4 py-2 hover:bg-white/5 rounded-full"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-0.5 border border-red-500/50"
                                >
                                    Sign Up Free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="lg:hidden flex items-center gap-4">
                        <Link 
                            href="/movies"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-300 border border-white/5"
                            aria-label="Search Movies"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Link>
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`lg:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100 border-b border-white/10' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-2xl">
                    <div className="px-4 py-6 flex flex-col gap-2">
                        {[
                            { name: 'Home', href: '/' }, 
                            { name: 'Movies', href: '/movies' }, 
                            { name: 'Trending', href: '/trending' }
                        ].map((item) => (
                            <Link key={item.name} href={item.href} className="px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 font-semibold text-lg transition-colors border-l-2 border-transparent hover:border-red-500">
                                {item.name}
                            </Link>
                        ))}
                        
                        <Link href="/recommendations" className="px-4 py-3 rounded-xl hover:bg-white/5 font-semibold text-lg transition-colors flex items-center justify-between border-l-2 border-transparent hover:border-purple-500 group">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400 group-hover:brightness-125">Recommendations</span>
                            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
                        </Link>
                        
                        <div className="h-px bg-white/5 my-4"></div>
                        
                        <div className="flex flex-col gap-3">
                            {auth?.user ? (
                                <Link href={route('dashboard')} className="w-full text-center px-4 py-3 rounded-xl text-white font-bold bg-white/10">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="w-full text-center px-4 py-3 rounded-xl text-white font-bold bg-white/5 border border-white/10">Log In</Link>
                                    <Link href={route('register')} className="w-full text-center px-4 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-600/20">Sign Up Free</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
