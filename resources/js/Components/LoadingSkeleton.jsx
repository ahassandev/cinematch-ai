import React from 'react';

export default function LoadingSkeleton({ count = 10 }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="w-full aspect-[2/3] rounded-[1.25rem] bg-[#1a1a24]/80 animate-pulse border border-white/5 relative overflow-hidden">
                    {/* Shimmer effect simulation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]"></div>
                </div>
            ))}
        </div>
    );
}
