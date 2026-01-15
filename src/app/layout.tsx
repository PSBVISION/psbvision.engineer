import type { Metadata } from "next";
import {  Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";

const hkGrotesk = Hanken_Grotesk({
  weight: ['400'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-hk-grotesk',
  display: 'swap',
})


const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  style: 'normal',
  subsets: ['latin'],
  variable: '--font-instrument-serif'
})

export const metadata: Metadata = {
  title: "PSBVISION",
  description: "Punit Singh Bisht - Full-Stack Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="hydrated">
      <body
        className={`${hkGrotesk.className} ${instrumentSerif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
