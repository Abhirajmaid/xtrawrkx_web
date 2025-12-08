// CMS Configuration
// This file controls whether to use Firebase CMS data or static data

export const CMS_CONFIG = {
    // Set to true to use Firebase CMS data, false to use static data
    USE_CMS_DATA: process.env.NEXT_PUBLIC_USE_CMS_DATA === 'true',

    // Admin configuration
    ADMIN_EMAILS: process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || ['admin@xtrawrkx.com'],

    // Strapi backend configuration
    STRAPI_API_URL: 'https://xtrawrkxsuits-production.up.railway.app/api',

    // Firebase project configuration
    FIREBASE_CONFIG: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    }
};

// Helper function to check if CMS is enabled
export const isCMSEnabled = () => CMS_CONFIG.USE_CMS_DATA;

// Helper function to check if user is admin
export const isUserAdmin = (email) => {
    return CMS_CONFIG.ADMIN_EMAILS.includes(email);
};

// Data source labels for UI
export const DATA_SOURCE_LABELS = {
    static: 'Static Data',
    cms: 'Firebase CMS',
    current: CMS_CONFIG.USE_CMS_DATA ? 'Firebase CMS' : 'Static Data'
}; 