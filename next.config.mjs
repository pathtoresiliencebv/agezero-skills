/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  async rewrites() {
    return [
      // Map / and any subpath (except _next, api, files) to /skills/...
      { source: "/", destination: "/skills" },
      { source: "/:path(.*)", destination: "/skills/:path" },
    ];
  },
};
export default nextConfig;
