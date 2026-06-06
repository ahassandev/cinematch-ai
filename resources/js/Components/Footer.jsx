import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-[#020202] border-t border-white/5 pt-20 pb-10 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    
                    {/* Brand Col */}
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-black text-sm tracking-tighter">C</span>
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">
                                CineMatch AI
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            The ultimate AI-powered movie recommendation platform. Stop searching. Start watching.
                        </p>
                    </div>

                    {/* Links Col 1 */}
                    <div>
                        <h4 className="text-white font-semibold mb-5 tracking-wide">Platform</h4>
                        <ul className="space-y-3">
                            {['Browse Movies', 'AI Recommendations', 'Trending Now', 'Top Rated'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Col 2 */}
                    <div>
                        <h4 className="text-white font-semibold mb-5 tracking-wide">Company</h4>
                        <ul className="space-y-3">
                            {['About Us', 'Careers', 'Contact', 'Blog'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Col 3 */}
                    <div>
                        <h4 className="text-white font-semibold mb-5 tracking-wide">Legal</h4>
                        <ul className="space-y-3">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="h-px w-full bg-white/5 mb-8"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} CineMatch AI. All rights reserved.
                    </p>
                    
                    {/* Socials */}
                    <div className="flex items-center gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <span className="sr-only">Social Link {i}</span>
                                <div className="w-4 h-4 bg-current rounded-sm"></div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
