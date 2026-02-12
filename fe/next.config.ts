import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

// dev : destination: "http://localhost:8080/api/:path*",
// deploy: destination: "http://3.38.237.211:8080/api/:path*",

export default nextConfig;
