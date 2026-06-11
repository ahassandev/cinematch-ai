import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RatingCard({ movieId, genres = [], rating, auth }) {
    const [feedback, setFeedback] = useState(null);
    const [matchData, setMatchData] = useState(null);
    const [loadingMatch, setLoadingMatch] = useState(false);

    const primaryGenre = genres && genres.length > 0 ? genres[0] : null;

    useEffect(() => {
        // Only fetch match score if user is logged in AND we have genre + rating
        if (!auth?.user || !primaryGenre || !rating || !movieId) return;

        setLoadingMatch(true);
        axios.get('/api/user/match-score', {
            params: {
                genre: primaryGenre,
                tmdb_rating: parseFloat(rating),
            }
        })
        .then(res => {
            setMatchData(res.data);
        })
        .catch(() => {
            setMatchData(null);
        })
        .finally(() => setLoadingMatch(false));
    }, [movieId, primaryGenre, rating, auth]);

    const handleFeedback = (type) => {
        setFeedback(type);
        if (movieId) {
            axios.post('/user/feedback', { movie_id: movieId, type })
                .catch(err => {
                    console.error("Failed to save feedback", err);
                    setFeedback(null);
                });
        }
    };

    // Determine display values
    const isNewGenre = matchData && matchData.match === null;
    const hasRealScore = matchData && matchData.match !== null;
    const matchScore = hasRealScore ? matchData.match : null;
    const noData = !auth?.user || (!loadingMatch && !isNewGenre && !hasRealScore);

    // Color based on score
    const scoreColor = matchScore >= 80
        ? 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]'
        : matchScore >= 60
            ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]'
            : 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]';

    const strokeColor = matchScore >= 80 ? 'text-green-500' : matchScore >= 60 ? 'text-yellow-400' : 'text-red-400';
    const badgeColor = matchScore >= 80 ? 'text-green-400' : matchScore >= 60 ? 'text-yellow-400' : 'text-red-400';

    const displayMessage = () => {
        if (!auth?.user) return 'Sign in to see your personal match score based on your taste.';
        if (loadingMatch) return 'Calculating your match score...';
        if (isNewGenre) return matchData.message;
        if (hasRealScore) return `Based on ${matchData.count} liked ${matchData.genre} movies (avg ${matchData.avg} rating).`;
        return 'Like movies to train your AI match score!';
    };

    return (
        <div className="bg-[#111115]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-700"></div>

            {/* Circular Score */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                {loadingMatch ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : isNewGenre ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 rounded-full border border-white/10">
                        <span className="text-3xl">⭐</span>
                        <span className="text-[9px] uppercase tracking-widest text-purple-400 font-bold mt-1">New!</span>
                    </div>
                ) : noData ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 rounded-full border border-white/10">
                        <span className="text-3xl font-black text-white/30">?</span>
                        <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold mt-1">No Data</span>
                    </div>
                ) : (
                    <>
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-white/5"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="currentColor" strokeWidth="3"
                            />
                            <path
                                className={`${strokeColor} transition-all duration-1000`}
                                strokeDasharray={`${matchScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-2xl font-black tracking-tighter ${scoreColor.split(' ')[0]}`}>{matchScore}%</span>
                            <span className={`text-[9px] uppercase tracking-widest ${badgeColor} font-bold`}>Match</span>
                        </div>
                    </>
                )}
            </div>

            {/* Info side */}
            <div className="flex-1 text-center sm:text-left z-10">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-white font-bold tracking-wide uppercase text-sm">
                        {hasRealScore ? `${primaryGenre} Match Score` : 'AI Recommendation'}
                    </h3>
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5">
                    {displayMessage()}
                </p>
            </div>
        </div>
    );
}
