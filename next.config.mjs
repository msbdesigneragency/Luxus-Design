/** @type {import('next').NextConfig} */
const config = {
  experimental: { cpus: 2 },
  images: { qualities: [75, 90] },
  devIndicators: false,
};
export default config;
