import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navigation from "./components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UML Designer - Thiết kế sơ đồ UML chuyên nghiệp",
  description: "Công cụ thiết kế sơ đồ UML trực tuyến với giao diện kéo thả trực quan, hỗ trợ đầy đủ các loại diagram và export code chuyên nghiệp.",
  keywords: "UML, diagram, design, class diagram, use case, sequence, ERD, activity, state machine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
