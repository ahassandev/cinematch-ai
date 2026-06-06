import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import HeroSection from '@/Components/HeroSection';
import SearchBar from '@/Components/SearchBar';
import MovieGrid from '@/Components/MovieGrid';
import RecommendationSection from '@/Components/RecommendationSection';
import FeatureSection from '@/Components/FeatureSection';
import Footer from '@/Components/Footer';
import axios from 'axios';

export default function Home({ auth }) {
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [loadingPopular, setLoadingPopular] = useState(true);

    // Load popular movies on first render for the default "Trending" section
    useEffect(() => {
        axios.get('/api/movies/popular')
            .then(res => {
                const results = res.data.results || [];
                const mapped = results.map(r => ({
                    id: r.id,
                    title: r.title,
                    rating: r.vote_average ? r.vote_average.toFixed(1) : 'NR',
                    genre: 'Movie',
                    image: r.poster_path
                        ? `https://image.tmdb.org/t/p/w500${r.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Poster',
                    year: r.release_date ? r.release_date.substring(0, 4) : 'N/A'
                }));
                setPopularMovies(mapped);
                setLoadingPopular(false);
            })
            .catch(err => {
                console.error('Failed to load popular movies:', err);
                setLoadingPopular(false);
            });
    }, []);

    const handleSearch = (query) => {
        if (!query.trim()) return;
        setSearchQuery(query);
        setIsSearching(true);
        setHasSearched(true);

        // Record search history (web route = session aware)
        axios.get(`/user/record-search?query=${encodeURIComponent(query)}`).catch(() => {});

        axios.get(`/api/movies/search?query=${encodeURIComponent(query)}`)
            .then(res => {
                const results = res.data.results || [];
                const mapped = results.map(r => ({
                    id: r.id,
                    title: r.title,
                    rating: r.vote_average ? r.vote_average.toFixed(1) : 'NR',
                    genre: 'Movie',
                    image: r.poster_path
                        ? `https://image.tmdb.org/t/p/w500${r.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Poster',
                    year: r.release_date ? r.release_date.substring(0, 4) : 'N/A'
                }));
                setSearchResults(mapped);
                setIsSearching(false);
            })
            .catch(err => {
                console.error('Search failed:', err);
                setIsSearching(false);
            });
    };

    return (
        <div className="bg-[#050505] min-h-screen font-sans antialiased text-white selection:bg-red-500/30 overflow-x-hidden">
            <Head title="Find Your Next Favorite Movie with AI - CineMatch AI" />
            
            <Navbar auth={auth} />
            
            <main className="w-full relative z-0 flex flex-col items-center">
                <HeroSection />
                
                {/* Search Interaction Flow */}
                <div className="w-full relative z-20" id="search-section">
                    <SearchBar onSearch={handleSearch} />
                </div>
                
                <div className="w-full flex flex-col items-center">
                    {!hasSearched ? (
                        <>
                            <MovieGrid
                                title="Trending Movies"
                                movies={popularMovies}
                                loading={loadingPopular}
                            />
                            <FeatureSection />
                        </>
                    ) : (
                        <div className="w-full animate-fade-in divide-y divide-white/5">
                            <MovieGrid 
                                title={`Results for "${searchQuery}"`}
                                subtitle={isSearching ? 'Searching database...' : `${searchResults.length} movies found`}
                                loading={isSearching}
                                movies={searchResults}
                            />
                            
                            {!isSearching && (
                                <RecommendationSection />
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
