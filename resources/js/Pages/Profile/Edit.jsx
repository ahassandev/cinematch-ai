import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Edit({ mustVerifyEmail, status, auth }) {
    const user = auth?.user || { name: 'Alex Doe', email: 'alex@cinematch.ai' };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
            <Head title="Profile - CineMatch AI" />
            <Navbar />

            {/* Background Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-purple-900/10 to-transparent"></div>
            </div>

            <main className="relative z-10 pt-32 pb-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 rounded-[2rem] bg-[#1a1a24]/40 border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-50"></div>
                    
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-[#050505] shadow-[0_0_0_2px_rgba(168,85,247,0.5)] overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=6b21a8&color=fff&size=200`} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center justify-center border-4 border-[#1a1a24] transition-colors shadow-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </button>
                    </div>

                    <div className="text-center md:text-left relative z-10 flex-1">
                        <h1 className="text-3xl font-black text-white mb-1">{user.name}</h1>
                        <p className="text-gray-400 font-medium mb-4">{user.email}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest border border-purple-500/30">Pro Member</span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/30">Beta Tester</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Settings Navigation */}
                    <div className="space-y-2">
                        {['General info', 'Account Settings', 'Preferences', 'Billing & Plan'].map((tab, i) => (
                            <button key={tab} className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all flex items-center justify-between ${i === 1 ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                {tab}
                                {i === 1 && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {/* Fake update profile informtion snippet to fit design */}
                        <section className="bg-[#1a1a24]/60 border border-white/10 rounded-[1.5rem] p-6 sm:p-8 backdrop-blur-xl">
                            <h2 className="text-xl font-bold text-white mb-2">Profile Information</h2>
                            <p className="text-sm text-gray-400 mb-6">Update your account's profile information and email address.</p>
                            
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input type="text" defaultValue={user.name} className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input type="email" defaultValue={user.email} className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <button type="button" className="px-6 py-2.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-colors">Save Changes</button>
                                </div>
                            </form>
                        </section>

                        <section className="bg-[#1a1a24]/60 border border-white/10 rounded-[1.5rem] p-6 sm:p-8 backdrop-blur-xl">
                            <h2 className="text-xl font-bold text-white mb-2">Change Password</h2>
                            <p className="text-sm text-gray-400 mb-6">Ensure your account is using a long, random password to stay secure.</p>
                            
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <button type="button" className="px-6 py-2.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 transition-colors">Update Password</button>
                                </div>
                            </form>
                        </section>
                        
                        <section className="bg-red-900/10 border border-red-500/20 rounded-[1.5rem] p-6 sm:p-8 backdrop-blur-xl">
                            <h2 className="text-xl font-bold text-red-500 mb-2">Delete Account</h2>
                            <p className="text-sm text-red-400/80 mb-6">Once your account is deleted, all of its resources and data will be permanently deleted.</p>
                            <button type="button" className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors">Delete Account</button>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
