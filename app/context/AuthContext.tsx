'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AuthUser = {
    username: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'MANAGER';
    name: string;
};

export const USERS_DB: Record<string, { pass: string; user: AuthUser }> = {
    user: {
        pass: 'pass',
        user: {
            username: 'user',
            email: 'user@company.com',
            role: 'USER',
            name: 'น.ส. ใช้งาน ธรรมดา',
        },
    },
    admin: {
        pass: 'pass',
        user: {
            username: 'admin',
            email: 'admin@company.com',
            role: 'ADMIN',
            name: 'นายดูแล ระบบ',
        },
    },
    manager: {
        pass: 'pass',
        user: {
            username: 'manager',
            email: 'manager@company.com',
            role: 'MANAGER',
            name: 'นายจัดการ งานดี',
        },
    },
};

interface AuthContextType {
    user: AuthUser | null;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
    login: (username: string, pass: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'csi205_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                setUser(null);
                setIsLoginModalOpen(true);
            }
        } else {
            // First time visit: show login modal
            setIsLoginModalOpen(true);
        }
    }, []);

    const login = (usernameInput: string, passInput: string): boolean => {
        const cleanUsername = usernameInput.trim().replace(/@company\.com$/i, '').toLowerCase();
        const account = USERS_DB[cleanUsername];

        if (account && account.pass === passInput.trim()) {
            setUser(account.user);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account.user));
            setIsLoginModalOpen(false);
            return true;
        } else {
            alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Invalid username or password)');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setIsLoginModalOpen(true);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoginModalOpen,
                openLoginModal: () => setIsLoginModalOpen(true),
                closeLoginModal: () => setIsLoginModalOpen(false),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

