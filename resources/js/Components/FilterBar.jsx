import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FilterBar({ onFilterChange }) {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedRating, setSelectedRating] = useState('');

    const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);
    const ratings = [9, 8, 7, 6, 5, 4, 3, 2, 1];

    useEffect(() => {
        axios.get('/api/movies/genres')
            .then(res => {
                setGenres(res.data.genres || []);
            })
            .catch(err => console.error('Error fetching genres:', err));
    }, []);

    const handleApply = () => {
        onFilterChange({
            genre: selectedGenre,
            year: selectedYear,
            rating: selectedRating
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-20">
            <div className="bg-[#1a1a24]/60 p-4 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-wrap gap-4 items-center justify-between hover:border-white/20 transition-colors">
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {/* Genre Filter */}
                    <div className="flex-1 md:flex-none relative">
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="w-full bg-[#0a0a0f] border border-white/10 text-white rounded-xl pl-4 pr-10 py-2.5 focus:border-purple-500/50 focus:ring-0 focus:outline-none cursor-pointer appearance-none text-sm font-medium hover:bg-white/5 transition-colors [color-scheme:dark]"
                        >
                            <option value="" className="bg-[#0a0a0f]">All Genres</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id} className="bg-[#0a0a0f]">{genre.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    {/* Year Filter */}
                    <div className="flex-1 md:flex-none relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full bg-[#0a0a0f] border border-white/10 text-white rounded-xl pl-4 pr-10 py-2.5 focus:border-purple-500/50 focus:ring-0 focus:outline-none cursor-pointer appearance-none text-sm font-medium hover:bg-white/5 transition-colors [color-scheme:dark]"
                        >
                            <option value="" className="bg-[#0a0a0f]">All Years</option>
                            {years.map(year => (
                                <option key={year} value={year} className="bg-[#0a0a0f]">{year}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="flex-1 md:flex-none relative">
                        <select
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(e.target.value)}
                            className="w-full bg-[#0a0a0f] border border-white/10 text-white rounded-xl pl-4 pr-10 py-2.5 focus:border-purple-500/50 focus:ring-0 focus:outline-none cursor-pointer appearance-none text-sm font-medium hover:bg-white/5 transition-colors [color-scheme:dark]"
                        >
                            <option value="" className="bg-[#0a0a0f]">All Ratings</option>
                            {ratings.map(rating => (
                                <option key={rating} value={rating} className="bg-[#0a0a0f]">{rating}+ Stars</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleApply}
                    className="w-full md:w-auto px-8 py-2.5 rounded-xl text-white font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-white/10 transition-all flex items-center justify-center gap-2 group shadow-[0_10px_20px_rgba(147,51,234,0.3)] active:scale-95"
                >
                    <svg className="w-4 h-4 text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                    </svg>
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
