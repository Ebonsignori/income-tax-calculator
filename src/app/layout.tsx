"use client";

import type { ReactNode } from "react";
import { useState, useMemo, useEffect } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/theme";
import { ColorModeContext } from "@/context/color-mode";
import type { Viewport } from "next";

export default function RootLayout(props: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light";
          window.localStorage.setItem("color-mode", newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    const localMode = window.localStorage.getItem("color-mode");
    if (localMode) {
      setMode(localMode as "light" | "dark");
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setMode("dark");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      const newColorScheme = event.matches ? "dark" : "light";
      setMode(newColorScheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Preconnect to Mixpanel domains for faster analytics loading */}
        <link rel="preconnect" href="https://api.mixpanel.com" />
        <link rel="preconnect" href="https://cdn.mxpnl.com" />
        <link rel="dns-prefetch" href="https://api.mixpanel.com" />
        <link rel="dns-prefetch" href="https://cdn.mxpnl.com" />
      </head>
      <body suppressHydrationWarning>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {props.children}
            </ThemeProvider>
          </ColorModeContext.Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // TODO: We set this in the head, because it's not setting here per possible Next.js bug
  themeColor: "#ffffff",
};
