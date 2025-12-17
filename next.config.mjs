/** @type {import('next').NextConfig} */
import NextPWA from "next-pwa";

const withPWA = NextPWA({
  dest: "out",
});

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/income-tax-calculator" : "";

const nextConfig = withPWA({
  output: "export",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
});

export default nextConfig;
