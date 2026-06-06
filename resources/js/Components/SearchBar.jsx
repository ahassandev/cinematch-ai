import { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        
        // Pass query up if callback exists
        if (onSearch) {
            onSearch(query);
        }

        // Mock loading state delay for visual effect
        setTimeout(() => {
            setIsSearching(false);
        }, 1500);
    };

    return (
        <section className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-24">
            <div className="bg-[#1a1a24]/60 p-2 md:p-3 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative overflow-hidden group hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all duration-500">
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative z-10 flex flex-col md:flex-row items-center gap-2">
                    <div className="flex-1 w-full relative flex items-center bg-[#0a0a0f]/50 rounded-[1.5rem] p-1 border border-transparent focus-within:border-white/10 transition-colors">
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 ml-2">
                            <svg className="w-6 h-6 text-gray-500 group-focus-within:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search any movie like Interstellar, Avatar, Joker..." 
                            className="w-full bg-transparent border-none text-white placeholder-gray-600 pl-2 pr-6 py-4 focus:ring-0 focus:outline-none text-lg md:text-xl"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSearching}
                        className="w-full md:w-auto px-10 py-5 h-full rounded-[1.5rem] font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] flex justify-center items-center gap-3 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                    >
                        {/* Button internal glow */}
                        <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        
                        {isSearching ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Searching...</span>
                            </>
                        ) : (
                            <span className="tracking-wide">Search Movies</span>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
}
