'use client';

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect } from "react"; // Ajouté
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isUserPage = pathname?.startsWith('/user');

  // Effet pour appliquer le mode sombre stocké au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased ${
          isUserPage ? 'dashboard-clean-bg' : 'main-app-bg'
        }`}
      >
        {children}
      </body>
    </html>
  );
}