import type { NextConfig } from "next";

// El navegador solo le habla a este mismo origen (Vercel); Next.js reenvía
// /api/* al backend real (Railway) del lado del servidor. Así la cookie de
// sesión queda same-site para el navegador en vez de ser de tercero, que es
// lo que Safari/Chrome bloquean por defecto entre dominios distintos.
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
