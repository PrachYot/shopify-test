/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "avatars.dicebear.com",
      "images.unsplash.com",
      "via.placeholder.com",
      "lh3.googleusercontent.com",
      ...(process.env.NEXT_PUBLIC_S3_BUCKET?.split(",") || []),
    ],
  },
};

module.exports = nextConfig;
