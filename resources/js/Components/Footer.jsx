import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-[#020202] border-t border-white/5 py-12 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} CineMatch AI. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
