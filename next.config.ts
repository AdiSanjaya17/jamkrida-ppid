import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary (media utama)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Thumbnail dokumen Google Drive (logo mitra via Drive)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      // Logo mitra dari situs lama (WordPress uploads)
      {
        protocol: "https",
        hostname: "ppid.jamkridabali.co.id",
      },
      {
        protocol: "https",
        hostname: "www.jamkridabali.co.id",
      },
      {
        protocol: "https",
        hostname: "jamkridabali.co.id",
      },
      // Logo Pemprov Bali
      {
        protocol: "https",
        hostname: "baliprov.go.id",
      },
    ],
  },
};

export default nextConfig;