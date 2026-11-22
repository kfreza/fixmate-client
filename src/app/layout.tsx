import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Cs_ThemeProvider from "@/app/helper/ThemeProvider";
import "./globals.css";

const cs_bodyFont = Inter({
  variable: "--font-cs-body",
  subsets: ["latin"],
});

const cs_headingFont = Space_Grotesk({
  variable: "--font-cs-heading",
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
    // next-themes sets the class on <html> before hydration
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cs_bodyFont.variable} ${cs_headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Cs_ThemeProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </Cs_ThemeProvider>
      </body>
    </html>
  );
};

export default Cs_RootLayout;
