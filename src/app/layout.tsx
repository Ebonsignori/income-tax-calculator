"use client";

import { useState, useMemo, useEffect } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "@/theme";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Head from "next/head";
import { ColorModeContext } from "@/context/color-mode";

export default function RootLayout(props: { children: React.ReactNode }) {
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
      <Head>
        <title>US Income Tax Calculator</title>
        <meta
          name="description"
          content="Calculate your income and taxes for cities with special taxes, like Portland OR."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <body>
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
