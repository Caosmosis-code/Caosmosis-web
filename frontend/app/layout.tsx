import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageTransition } from "@/components/EditorialMotion";

const displayFont = Fraunces({ variable: "--font-editorial-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const sansFont = IBM_Plex_Sans({ variable: "--font-editorial-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "Caosmosis — ideas para entender el presente", template: "%s | Caosmosis" },
  description: "Revista independiente de cultura, ciencia y tecnología. Ideas para entender lo que nos pasa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${displayFont.variable} ${sansFont.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-graphite font-body">
        <AuthProvider>
          <a className="skip-link" href="#contenido">Saltar al contenido</a>
          <Navbar />
          <main id="contenido" className="flex-1"><PageTransition>{children}</PageTransition></main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
