import React from 'react';

export default function PageHeader({ title, subtitle }) {
    return (
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white drop-shadow-lg mb-6 tracking-tight">
                {title}
            </h1>
            {subtitle && (
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
