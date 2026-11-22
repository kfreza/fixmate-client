"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

const Cs_ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
};

export default Cs_ThemeProvider;
