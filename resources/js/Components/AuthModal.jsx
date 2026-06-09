import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function AuthModal({ isOpen, onClose, title = "Join CineMatch AI", subtitle = "Sign up or log in to unlock favorites, watchlists, and AI-powered recommendations tailored just for you." }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0f0f13]/90 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all duration-300 scale-100 animate-in zoom-in-95">
                
                {/* Visual Accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-[60px] rounded-full"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-600/10 blur-[60px] rounded-full"></div>

                <div className="relative p-8 md:p-10 flex flex-col items-center text-center">
                    {/* Icon Container */}
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600/20 to-red-600/20 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                        {title}
                    </h2>
                    
                    <p className="text-gray-400 text-lg leading-relaxed mb-10 px-2">
                        {subtitle}
                    </p>

                    <div className="flex flex-col w-full gap-4">
                        <Link 
                            href={route('register')}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-[0_10px_20px_rgba(124,58,237,0.3)] transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            Get Started Free
                        </Link>
                        
                        <Link 
                            href={route('login')}
                            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-lg transition-all active:scale-95"
                        >
                            Already have an account? Log In
                        </Link>

                        <button 
                            onClick={onClose}
                            className="mt-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
