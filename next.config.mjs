/** @type {import('next').NextConfig} */
import NextPWA from "next-pwa";

const withPWA = NextPWA({
  dest: "out",
});

const nextConfig = withPWA({
  output: "export",
});

export default nextConfig;
