/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.deepgram.com",
        port: "",
        pathname: "/examples/avatars/**",
      },
    ],
    domains: ["assets.artistfirst.in"],
  },
};

export default nextConfig;
