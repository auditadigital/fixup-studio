import type { Metadata } from "next";
import { Jua, Noto_Sans_KR, Space_Mono } from "next/font/google";
import "./globals.css";

const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua" });
const noto = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-noto-kr" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Fixup Studio — Pipeline",
  description: "Panel de control interno",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jua.variable} ${noto.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
