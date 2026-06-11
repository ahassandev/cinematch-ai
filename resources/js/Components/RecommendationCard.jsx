import React from 'react';
import { Link } from '@inertiajs/react';

export default function RecommendationCard({ id, title, rating, genre, director, description, matchType, image, year, matchScore, additionalClasses = "" }) {
    return (
        <Link href={`/movie/${id}`} className={`group relative w-full aspect-[2/3] shrink-0 rounded-[1.25rem] overflow-hidden cursor-pointer transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] block ${additionalClasses}`}>
            
            <div className="absolute inset-0 rounded-[1.25rem] border-2 border-transparent group-hover:border-purple-500/40 transition-colors duration-500 z-30 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 rounded-[1.25rem]"></div>

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
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-transparent opacity-50"></div>

                {/* Match Score - Prominent Badge */}
                <div className="absolute top-3 right-3 z-20">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-lg text-xs font-black text-white shadow-[0_5px_15px_rgba(16,185,129,0.4)] border border-white/20 whitespace-nowrap transform group-hover:scale-105 transition-transform">
                        {matchScore}% Match
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-5 z-20 transform group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {year && (
                            <span className="text-[11px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm tracking-wider">{year}</span>
                        )}
                        <span className="text-[11px] font-bold text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm tracking-wider flex items-center gap-1">
                            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            {rating}
                        </span>
                    </div>

                    <h3 className="text-white font-bold text-xl leading-snug line-clamp-1 group-hover:line-clamp-2 transition-all drop-shadow-md mb-2">
                        {title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                        {director && (
                            <div className="bg-purple-600/80 backdrop-blur-md px-2 py-1 rounded-md border border-purple-400/20 text-[9px] font-bold text-white shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                                <svg className="w-2.5 h-2.5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {director}
                            </div>
                        )}
                        <div className="bg-blue-600/80 backdrop-blur-md px-2 py-1 rounded-md border border-blue-400/20 text-[9px] font-bold text-white shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                            <svg className="w-2.5 h-2.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {genre || 'Movie'}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
