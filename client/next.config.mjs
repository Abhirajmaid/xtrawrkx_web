/** @type {import('next').NextConfig} */
const nextConfig = {
    // Basic image optimization only
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
        ],
    },

    // Basic performance optimizations
    compress: true,
    poweredByHeader: false,
};

export default nextConfig;
