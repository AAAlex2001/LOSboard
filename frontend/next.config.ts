import type { NextConfig } from "next";

/** remotePatterns строим из NEXT_PUBLIC_API_BASE_URL: хост ассетов совпадает с origin API */
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (apiBaseUrl) {
  try {
    const { protocol, hostname, port } = new URL(apiBaseUrl);
    remotePatterns.push({
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      port: port || undefined,
    });
  } catch {
    remotePatterns.length = 0;
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
