"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if Firebase is available
        if (!authService.isFirebaseAvailable()) {
            setLoading(false);
            return;
        }

        const unsubscribe = authService.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (email, password) => {
        try {
            setError(null);
            setLoading(true);
            const userData = await authService.signIn(email, password);
            setUser(userData);
            return userData;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setError(null);
            await authService.signOut();
            setUser(null);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            setError(null);
            await authService.resetPassword(email);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const createUser = async (email, password, displayName) => {
        try {
            setError(null);
            const userData = await authService.createUser(email, password, displayName);
            return userData;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        signIn,
        signOut,
        resetPassword,
        createUser,
        clearError,
        isAdmin: user?.isAdmin || false,
        isFirebaseAvailable: authService.isFirebaseAvailable()
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 
