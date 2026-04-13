/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't bundle Chromium-related packages into the serverless function
  // — they resolve from node_modules at runtime instead.
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-core",
    "@sparticuz/chromium",
  ],
};

export default nextConfig;
