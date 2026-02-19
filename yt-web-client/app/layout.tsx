import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./navbar/navbar";

export const metadata: Metadata = {
  title: "VideoX",
  description: "YouTube skeleton clone with Firebase auth and video processing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
