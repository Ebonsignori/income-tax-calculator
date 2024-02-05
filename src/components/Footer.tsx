import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Box, Grid, useTheme } from "@mui/material";
import { NavPage } from "@/types";
import Link from "next/link";
import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";

type FooterProps = {
  pages: NavPage[];
  innerRef: React.RefObject<HTMLDivElement>;
};

export default function Footer({ pages, innerRef }: FooterProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
      }}
      ref={innerRef}
      component="footer"
      display="flex"
      flexDirection={{
        xs: "column",
        sm: "row",
      }}
      alignItems="center"
      position="fixed"
      bottom={0}
      width="100%"
      padding={{
        xs: 1.5,
        sm: 3,
      }}
    >
      {pages.map(({ name, route, selected }) => {
        if (selected) {
          return null;
        }
        return (
          <Typography
            key={route}
            variant="body2"
            color={theme.palette.common.white}
            sx={{
              mr: {
                xs: 0,
                sm: 2,
              },
              ml: {
                xs: 0,
                sm: 2,
              },
              mb: {
                xs: 0.5,
                sm: 0,
              },
            }}
          >
            <MuiLink
              color="inherit"
              component={Link}
              href={route}
              onClick={() => sendAnalyticsEvent(EVENTS.FOOTER_NAV_CLICK, name)}
            >
              {name}
            </MuiLink>
          </Typography>
        );
      })}
      <Typography
        variant="body2"
        color={theme.palette.common.white}
        sx={{
          ml: {
            xs: 0,
            sm: "auto",
          },
          mr: {
            xs: 0,
            sm: 4,
          },
          mt: {
            xs: 0.5,
            sm: 0,
          },
        }}
      >
        {"Copyright © "}
        <MuiLink
          color="inherit"
          href="https://evan.bio/"
          onClick={() => sendAnalyticsEvent(EVENTS.AUTHOR_FOOTER_CLICK)}
        >
          Evan Bonsignori
        </MuiLink>{" "}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
}
