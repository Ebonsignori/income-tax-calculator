"use client";

import { useState, useMemo, useEffect, ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/theme";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ColorModeContext } from "@/context/color-mode";
import { Viewport } from "next";
import Script from "next/script";

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
      if (mode !== "dark") {
        setMode("dark");
      }
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        const newColorScheme = event.matches ? "dark" : "light";
        setMode(newColorScheme);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="google-adsense-account" content="ca-pub-3786303899750150" />
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {props.children}
            </ThemeProvider>
          </ColorModeContext.Provider>
        </AppRouterCacheProvider>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3786303899750150"
          strategy="lazyOnload"
        />
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
