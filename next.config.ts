import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://127.0.0.1:8000";
const { protocol, hostname, port } = new URL(apiOrigin);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port: port || undefined,
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
