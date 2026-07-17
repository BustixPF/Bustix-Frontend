import type { Metadata } from "next";
import "./globals.css";
import { workSans, jetbrainsMono, bigShouldersDisplay } from "./fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bustix",
  description: "Bustix frontend built with Next.js, Tailwind CSS, and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${jetbrainsMono.variable} ${bigShouldersDisplay.variable} h-full antialiased`}
    >
      <Navbar />
      <body className="min-h-screen font-sans">{children}</body>
      <Footer />
    </html>
  );
}