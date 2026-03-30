import type { Metadata } from "next";
import { Barlow_Condensed, Space_Mono } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "MAXXED — AI Avatar Generator",
  description:
    "Upload a selfie and get a branded 3D avatar in the Maxxed Casino style",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${spaceMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
