"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

declare module "@mui/material/styles" {
  // eslint-disable-next-line no-unused-vars
  interface Theme {
    custom: {
      red: string;
      green: string;
    };
  }
  // eslint-disable-next-line no-unused-vars
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
      red: isDark ? "#FF0000" : "#BC4749",
      green: isDark ? "#00FF00" : "#386641",
    },
  });
}
