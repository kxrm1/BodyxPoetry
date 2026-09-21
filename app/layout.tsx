import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const editorialSerif = localFont({
  src: [
    {
      path: "../public/fonts/es-serif-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/es-serif-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/es-serif-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-editorial-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata = {
  title: "Body × Poetry's Wellness Club",
  description: "Where body meets breath. Where movement becomes meditation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${editorialSerif.variable} ${dmSans.variable}`}
    >
      <body className="antialiased overflow-x-clip min-h-[100dvh]">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
