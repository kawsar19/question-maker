/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't bundle Chromium-related packages into the serverless function
  // — they resolve from node_modules at runtime instead.
  serverExternalPackages: [
    "puppeteer",
    "puppeteer-core",
    "@sparticuz/chromium",
  ],
  // Force Vercel to include @sparticuz/chromium's binary files (.br) in the
  // serverless function bundle — Next.js trace analysis misses them otherwise.
  outputFileTracingIncludes: {
    "/api/print": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
    "app/api/print/route.js": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
