/** @type {import('next').NextConfig} */

const nextConfig = {

  reactCompiler: true,

  images: {

    remotePatterns: [

      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },

      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },

      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },

    ],

  },

};

export default nextConfig;