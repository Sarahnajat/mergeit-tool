// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "esnext"
  }

};

module.exports = nextConfig;