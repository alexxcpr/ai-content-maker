import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/layout/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true });

export const metadata: Metadata = {
  title: "AI Content Maker",
  description: "Generator de conținut multimedia bazat pe AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className="dark">
      <body className="bg-gray-900 text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}