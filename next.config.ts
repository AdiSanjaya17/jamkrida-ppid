import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary (media utama)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // URL eksternal lain (logo mitra, thumbnail Google Drive, dll)
      // — hanya HTTPS, protokol HTTP tidak diizinkan
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;