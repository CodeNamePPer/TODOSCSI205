'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Keyboard, EyeDisabled } from '@tailgrids/icons';

export default function LoginModal() {
    const { isLoginModalOpen, closeLoginModal, login, user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    if (!isLoginModalOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(username, password);
        if (success) {
            setUsername('');
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 relative">
                <h2 className="text-center font-bold text-gray-900 text-base mb-5">
                    Who are you?
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Username Field */}
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-3 focus-within:border-blue-500 transition bg-white">
                        <Keyboard className="size-4 text-gray-500 shrink-0 mr-2" />
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="user | admin | manager"
                            className="w-full text-sm outline-none text-gray-800 bg-transparent placeholder:text-gray-400"
                            autoFocus
                        />
                        <span className="text-xs text-gray-600 font-medium shrink-0 ml-1">
                            @company.com
                        </span>
                    </div>

                    {/* Password Field */}
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 focus-within:border-blue-500 transition bg-white">
                        <EyeDisabled className="size-4 text-gray-500 shrink-0 mr-2" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="pass"
                            className="w-full text-sm outline-none text-gray-800 bg-transparent placeholder:text-gray-400"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end items-center gap-2">
                        {user && (
                            <button
                                type="button"
                                onClick={closeLoginModal}
                                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="border border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-800 text-sm font-medium px-5 py-1.5 rounded-lg transition shadow-xs"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

