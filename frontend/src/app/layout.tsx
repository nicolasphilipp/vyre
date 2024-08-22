import type { Metadata } from "next";
import "./globals.css";
import { Kanit } from 'next/font/google';
import { Providers } from "./providers";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vyre",
  description: "Cardano Light Wallet",
};

const font = Kanit({
  weight: "400",
  variable: '--font',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${font.variable}`}>
      <body>
        <Providers>
          <main className="dark">
            {children} 
          </main>
        </Providers> 
      </body>
    </html>
  );
}
