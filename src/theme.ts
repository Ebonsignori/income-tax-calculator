"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      red: string;
      green: string;
    };
  }
  interface ThemeOptions {
    custom: {
      red: string;
      green: string;
    };
  }
}

export const primaryColor = "#3d405b";

export function getTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: "#e07a5f",
      },
    },
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
    custom: {
      // Pure #F00/#0F0 on a near-black surface vibrate and read as an error
      // state. These are the dark-surface counterparts of the light pair.
      red: isDark ? "#e57373" : "#BC4749",
      green: isDark ? "#81c784" : "#386641",
    },
  });
}
