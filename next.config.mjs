/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  browser: {
    child_process: false,
  },
};

export default nextConfig;
