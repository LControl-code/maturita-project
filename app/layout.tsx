import { MainNavbar } from '@/components/layout/MainNavbar';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import "@/app/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Industrial Test Data Analyser",
  description: "Test Data analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SubscriptionProvider debug={true}>
          <MainNavbar />
          {children}
        </SubscriptionProvider>
      </body>
    </html>
  );
}
