export default function manifest() {
  return {
    name: "Question Maker — বাংলা প্রশ্ন তৈরি",
    short_name: "Question Maker",
    description:
      "শ্রেণি অনুযায়ী বাংলা প্রশ্নের টেমপ্লেট দিয়ে দ্রুত প্রশ্নপত্র তৈরি ও PDF ডাউনলোড করুন।",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
