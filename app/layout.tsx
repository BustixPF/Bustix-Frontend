import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { workSans, jetbrainsMono, bigShouldersDisplay } from "./fonts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/context/AuthContext";

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
      <body className="min-h-screen font-sans">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster
            position="top-right"
            closeButton
            toastOptions={{
              classNames: {
                toast: "rounded-xl! border-2! bg-card! p-4! shadow-xl!",
                title: "text-sm! font-bold! text-card-foreground!",
                description: "text-xs! text-muted-foreground!",
                success: "border-success!",
                error: "border-destructive!",
                info: "border-secondary!",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}