/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF is ~20–30% smaller than WebP for photos; browsers that can't
    // decode it get WebP.
    formats: ["image/avif", "image/webp"],
    // Optimized variants are cached for 31 days instead of a few hours, so
    // visitors rarely hit a cold (slow) resize on Vercel.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
