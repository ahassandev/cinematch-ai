import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import HeroSection from '@/Components/HeroSection';
import SearchBar from '@/Components/SearchBar';
import MovieGrid from '@/Components/MovieGrid';
import RecommendationSection from '@/Components/RecommendationSection';
import FeatureSection from '@/Components/FeatureSection';
import FilterBar from '@/Components/FilterBar';
import Footer from '@/Components/Footer';
import axios from 'axios';

export default function Home({ auth }) {
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [activeFilters, setActiveFilters] = useState({ genre: '', year: '', rating: '' });
    const [isFiltering, setIsFiltering] = useState(false);

    // Load popular movies or handle auto-search from URL param
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('q');

        if (queryParam) {
            handleSearch(queryParam);
        }

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
                    year: r.release_date ? r.release_date.substring(0, 4) : 'N/A',
                    inWatchlist: r.in_watchlist,
                    isLiked: r.is_liked,
                    isDisliked: r.is_disliked
                }));
                setPopularMovies(mapped);
                setLoadingPopular(false);
            })
            .catch(err => {
                console.error('Failed to load popular movies:', err);
                setLoadingPopular(false);
            });
    }, []);

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
        setHasSearched(false);
        setIsFiltering(true);
        setLoadingPopular(true);

        const hasActiveFilters = newFilters.genre || newFilters.year || newFilters.rating;

        if (!hasActiveFilters) {
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
                        year: r.release_date ? r.release_date.substring(0, 4) : 'N/A',
                        inWatchlist: r.in_watchlist,
                        isLiked: r.is_liked,
                        isDisliked: r.is_disliked
                    }));
                    setPopularMovies(mapped);
                    setLoadingPopular(false);
                    setIsFiltering(false);
                })
                .catch(err => {
                    console.error('Failed to load popular movies:', err);
                    setLoadingPopular(false);
                    setIsFiltering(false);
                });
            return;
        }

        let params = {};
        if (newFilters.genre) params.with_genres = newFilters.genre;
        if (newFilters.year) params.primary_release_year = newFilters.year;
        if (newFilters.rating) params.vote_average_gte = newFilters.rating;

        axios.get('/api/movies/discover', { params })
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
                    year: r.release_date ? r.release_date.substring(0, 4) : 'N/A',
                    inWatchlist: r.in_watchlist,
                    isLiked: r.is_liked,
                    isDisliked: r.is_disliked
                }));
                setPopularMovies(mapped);
                setLoadingPopular(false);
                setIsFiltering(false);
            })
            .catch(err => {
                console.error('Failed to fetch filtered movies:', err);
                setLoadingPopular(false);
                setIsFiltering(false);
            });
    };

    const handleSearch = (query) => {
        if (!query.trim()) return;
        setSearchQuery(query);
        setIsSearching(true);
        setHasSearched(true);
        setActiveFilters({ genre: '', year: '', rating: '' });

        // Record search history (web route = session aware)
        axios.get(`/user/record-search?query=${encodeURIComponent(query)}`).catch(() => {});

        axios.get(`/api/movies/search?query=${encodeURIComponent(query)}`)
            .then(res => {
                const results = res.data.results || [];
                const mapped = results
                    .filter(r => r.media_type === 'movie' || r.media_type === 'tv')
                    .map(r => ({
                        id: r.id,
                        title: r.title || r.name,
                        rating: r.vote_average ? r.vote_average.toFixed(1) : 'NR',
                        genre: r.media_type === 'tv' ? 'TV Series' : 'Movie',
                        image: r.poster_path
                            ? `https://image.tmdb.org/t/p/w500${r.poster_path}`
                            : 'https://via.placeholder.com/500x750?text=No+Poster',
                        year: (r.release_date || r.first_air_date || '').substring(0, 4) || 'N/A',
                        inWatchlist: r.in_watchlist,
                        isLiked: r.is_liked,
                        isDisliked: r.is_disliked
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
                            <FilterBar onFilterChange={handleFilterChange} />

                            <MovieGrid
                                title={isFiltering || activeFilters.genre || activeFilters.year || activeFilters.rating ? "Filtered Results" : "Trending Movies"}
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
