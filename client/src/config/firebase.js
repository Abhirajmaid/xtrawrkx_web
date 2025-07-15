// Firebase configuration - with fallback values for development
const firebaseConfig = {
    apiKey: "AIzaSyCRyooUo6KheeDUEuEV9Add_XozmN_p--0",
    authDomain: "xtrawrkx.firebaseapp.com",
    projectId: "xtrawrkx",
    storageBucket: "xtrawrkx.firebasestorage.app",
    messagingSenderId: "647527626177",
    appId: "1:647527626177:web:7a791b0e6a5d8c14f9ab40"
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey &&
        firebaseConfig.authDomain &&
        firebaseConfig.projectId &&
        firebaseConfig.storageBucket &&
        firebaseConfig.messagingSenderId &&
        firebaseConfig.appId;
};

// Initialize Firebase only if properly configured
let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;

// Only import Firebase if we're in a browser environment
if (typeof window !== 'undefined') {
    try {
        // Dynamic imports to prevent server-side issues
        const { initializeApp } = require('firebase/app');
        const { getAuth } = require('firebase/auth');
        const { getFirestore } = require('firebase/firestore');
        const { getStorage } = require('firebase/storage');

        if (isFirebaseConfigured()) {
            app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);
            storage = getStorage(app);

            // Initialize Analytics only if measurement ID is provided
            if (firebaseConfig.measurementId) {
                const { getAnalytics } = require('firebase/analytics');
                analytics = getAnalytics(app);
            }
        } else {
            console.warn('Firebase configuration is incomplete. Using static data fallback.');
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        console.warn('Firebase services will not be available. The app will use static data fallback.');
    }
}

// Export services with null checks
export { auth, db, storage, analytics };
export default app;

// Helper function to check if Firebase is available
export const isFirebaseAvailable = () => {
    return typeof window !== 'undefined' && app !== null && auth !== null && db !== null && storage !== null;
};

// Helper function to get Firebase configuration status
export const getFirebaseStatus = () => {
    return {
        configured: isFirebaseConfigured(),
        initialized: app !== null,
        clientSide: typeof window !== 'undefined',
        services: {
            auth: auth !== null,
            firestore: db !== null,
            storage: storage !== null,
            analytics: analytics !== null
        }
    };
}; 