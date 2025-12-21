/** @type {import('next').NextConfig} */
import NextPWA from "next-pwa";

const withPWA = NextPWA({
  dest: "out",
  disable: process.env.NODE_ENV === "development", // Disable PWA only in development
});

const nextConfig = withPWA({
  output: "export",
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
});

export default nextConfig;
