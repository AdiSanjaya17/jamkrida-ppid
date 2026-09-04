import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: {
    default: "PPID — PT Jamkrida Bali Mandara (Perseroda)",
    template: "%s | PPID Jamkrida Bali",
  },
  description:
    "Portal Pelayanan Informasi Publik PT Jamkrida Bali Mandara (Perseroda)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={urbanist.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}