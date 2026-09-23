import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin/login",
        destination: "/admin-login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
