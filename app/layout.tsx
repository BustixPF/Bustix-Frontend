import type { Metadata } from "next";
import { Inter, Varela_Round } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const varela = Varela_Round({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-headline",
});

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
      className={`${inter.variable} ${varela.variable} h-full antialiased`}
    >
      <Navbar />
      <body className="min-h-screen font-body">{children}</body>
      <Footer />
    </html>
  );
}
