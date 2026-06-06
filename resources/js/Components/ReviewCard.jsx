export default function ReviewCard({ avatar, username, rating, date, comment }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl hover:bg-white/[0.07] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:border-white/20 group">
            
            <div className="flex items-start justify-between mb-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 group-hover:border-purple-500/50 transition-colors shadow-lg">
                        <img 
                            src={avatar} 
                            alt={username} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-base tracking-wide">{username}</h4>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{date}</p>
                    </div>
                </div>
                
                {/* Rating Badge */}
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 group-hover:border-yellow-500/30 transition-colors">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-bold text-sm tracking-wide">{rating}</span>
                </div>
            </div>
            
            {/* Review Comment */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                "{comment}"
            </p>
        </div>
    );
}
