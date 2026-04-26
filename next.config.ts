import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // atau ganti dengan domain cloudflare bucket Anda, misal: "imagedelivery.net"
      },
      {
        protocol: "https",
        hostname: "pub-672abad1d389407b91ac8c217037cc8a.r2.dev", // atau ganti dengan domain cloudflare bucket Anda, misal: "imagedelivery.net"
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.rumahstruktur.arthaloka.technology", // atau ganti dengan domain cloudflare bucket Anda, misal: "imagedelivery.net"
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
