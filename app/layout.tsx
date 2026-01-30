import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google'
import "./globals.css";
import Sidebar from "@/components/sidebar";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PixelHost",
  description:
    "PixelHost provides fast, secure, and affordable Minecraft server hosting.",
  icons: {
    icon: [
      { url: "/logo-sm.png", sizes: "32x32", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
