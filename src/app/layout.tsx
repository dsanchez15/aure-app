import type { Metadata } from "next";
import { Commissioner, Fragment_Mono, Mona_Sans } from "next/font/google";
import "./globals.css";
import ThemeHandler from "@/components/ThemeHandler";
import ThemeLoader from "@/components/ThemeLoader";
import { LanguageProvider } from "@/components/LanguageProvider";

const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
  display: "swap",
});

const commissioner = Commissioner({
  subsets: ["latin"],
  variable: "--font-commissioner",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aure — Enfoque diario",
  description: "Tareas, hábitos, objetivos y progreso en un solo sistema de enfoque.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-visual-theme="focus"
      suppressHydrationWarning
      className={`${monaSans.variable} ${commissioner.variable} ${fragmentMono.variable}`}
    >
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeLoader>
          <ThemeHandler />
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeLoader>
      </body>
    </html>
  );
}
