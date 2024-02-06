import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Box } from "@mui/material";
import type { NavPage } from "@/types";
import Link from "next/link";
import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";

type FooterProps = {
  pages: NavPage[];
};

export default function Footer({ pages }: FooterProps) {
  return (
    <Box
      component="footer"
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      padding={{
        xs: 1.5,
        sm: 3,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: {
            xs: 1.5,
            sm: 1,
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
        {new Date().getFullYear()}
      </Typography>
      {pages.map(({ name, route, selected }) => {
        if (selected) {
          return null;
        }
        return (
          <Typography
            key={route}
            variant="body2"
            color="text.secondary"
            sx={{
              mb: {
                xs: 1,
                sm: 0.5,
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
    </Box>
  );
}
