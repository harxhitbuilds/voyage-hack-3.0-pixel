import type { Metadata } from "next";
import localFont from "next/font/local";

import ThemeProvider from "@/providers/theme-provider";

import "./globals.css";

const zentry = localFont({
  src: "../public/fonts/zentry-regular.woff2",
  variable: "--font-zentry",
  weight: "100 900",
});

const circularWeb = localFont({
  src: "../public/fonts/circularweb-book.woff2",
  variable: "--font-circular-web",
  weight: "100 900",
});

const general = localFont({
  src: "../public/fonts/general.woff2",
  variable: "--font-general",
  weight: "100 900",
});

const robertmedium = localFont({
  src: "../public/fonts/robert-medium.woff2",
  variable: "--font-robert-medium",
  weight: "100 900",
});

const roberregular = localFont({
  src: "../public/fonts/robert-regular.woff2",
  variable: "--font-robert-regular",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nimbus - The Ultimate Travel Companion",
  description:
    "Explore the world with Nimbus, your ultimate travel companion. Discover new destinations, plan your trips, and share your adventures with friends. Join the Nimbus community and start your journey today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${zentry.variable} ${circularWeb.variable} ${general.variable} ${robertmedium.variable} ${roberregular.variable} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
