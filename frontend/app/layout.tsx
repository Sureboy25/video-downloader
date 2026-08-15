import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Downloader",
  description: "Download videos online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}