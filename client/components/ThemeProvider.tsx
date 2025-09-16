import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="cloud-metro-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
