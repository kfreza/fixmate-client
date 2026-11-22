import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const cs_geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cs_geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FixMate | Device & Home Appliance Repair",
    template: "%s | FixMate",
  },
  description:
    "Book verified technicians for smartphone, laptop, AC, TV and home appliance repairs. Track every job and pay only after it's fixed.",
};

const Cs_RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="en"
      className={`${cs_geistSans.variable} ${cs_geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
};

export default Cs_RootLayout;
