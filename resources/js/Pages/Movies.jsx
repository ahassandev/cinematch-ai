import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import PageHeader from '@/Components/PageHeader';
import SearchBar from '@/Components/SearchBar';
import FilterBar from '@/Components/FilterBar';
import MovieGrid from '@/Components/MovieGrid';
import LoadingSkeleton from '@/Components/LoadingSkeleton';
import axios from 'axios';

export default function Movies({ auth }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({ genre: '', year: '', rating: '' });

    const fetchMoviesData = (query = '', filters = { genre: '', year: '', rating: '' }) => {
        setLoading(true);
        
        let endpoint = '/api/movies/popular';
        let params = {};

        if (query) {
            endpoint = '/api/movies/search';
            params.query = query;
        } else if (filters.genre || filters.year || filters.rating) {
            endpoint = '/api/movies/discover';
            if (filters.genre) params.with_genres = filters.genre;
            if (filters.year) params.primary_release_year = filters.year;
            if (filters.rating) params.vote_average_gte = filters.rating;
        }
        
        axios.get(endpoint, { params })
            .then(res => {
                const results = res.data.results || [];
                const mapped = results.map(r => ({
                    id: r.id,
                    title: r.title,
                    rating: r.vote_average ? r.vote_average.toFixed(1) : 'NR',
                    genre: 'Movie',
                    image: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster',
                    year: r.release_date ? r.release_date.substring(0, 4) : 'N/A'
                }));
                setMovies(mapped);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed fetching movies:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMoviesData(searchQuery, activeFilters);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setActiveFilters({ genre: '', year: '', rating: '' }); // Clear filters on search
        axios.get(`/user/record-search?query=${encodeURIComponent(query)}`).catch(() => {});
        fetchMoviesData(query, { genre: '', year: '', rating: '' });
    };

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
        setSearchQuery(''); // Clear search on filter
        fetchMoviesData('', newFilters);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
            <Head title={searchQuery ? `Search: ${searchQuery} - CineMatch AI` : "Movies Library - CineMatch AI"} />
            <Navbar auth={auth} />

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-[#050505] to-[#050505]"></div>
            </div>

            <main className="relative z-10 pt-20 pb-32">
                <PageHeader 
                    title={searchQuery ? `Results for "${searchQuery}"` : "Movie Library"} 
                    subtitle={searchQuery ? "Browse matching titles." : "Explore thousands of movies instantly. Filter by genre, year, rating, or language to find your perfect watch."}
                />
                
                <SearchBar onSearch={handleSearch} />
                
                <FilterBar onFilterChange={handleFilterChange} />

                {loading ? (
                    <LoadingSkeleton count={10} />
                ) : movies.length > 0 ? (
                    <MovieGrid movies={movies} />
                ) : (
                    <div className="text-center text-gray-500 py-20 italic">
                        No movies found matching your criteria. Try adjusting your filters!
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
