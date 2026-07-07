import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PwaRegister from "./components/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Question Maker — বাংলা প্রশ্ন তৈরি",
  description:
    "শ্রেণি অনুযায়ী বাংলা প্রশ্নের টেমপ্লেট দিয়ে দ্রুত প্রশ্নপত্র তৈরি ও PDF ডাউনলোড করুন।",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Question Maker",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
