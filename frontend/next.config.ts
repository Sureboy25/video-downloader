import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/video-downloader",
  assetPrefix: "/video-downloader/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;