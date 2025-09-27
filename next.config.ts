/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      // --- Add this new object for Timeout ---
      {
        protocol: 'https',
        hostname: 'media.timeout.com',
      },
         {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
       {
        protocol: 'http',
        hostname: 'googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;