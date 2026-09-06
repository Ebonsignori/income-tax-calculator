import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { Box, Divider } from "@mui/material";
import type { NavPage } from "@/types";
import Link from "next/link";
import { SupportButton } from "./SupportButton";

type FooterProps = {
  pages: NavPage[];
};

export default function Footer({ pages }: FooterProps) {
  const visiblePages = pages.filter(({ selected }) => !selected);

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
      <Divider sx={{ width: "100%", mb: { xs: 2, sm: 3 } }} />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mb: 2,
          textAlign: "center",
          fontStyle: "italic",
          maxWidth: "600px",
          px: 2,
        }}
      >
        <strong>Disclaimer:</strong> This data is for informational purposes
        only. Tax calculations are not verified and should not be used for
        legal, tax filing, or financial advice. If data appears incorrect,
        please <SupportButton asLink />.
      </Typography>
      <Divider sx={{ width: "100%", mb: { xs: 2, sm: 2 } }} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: {
            xs: 1.5,
            sm: 1,
          },
          textAlign: "center",
          px: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {visiblePages.map(({ name, route }) => (
          <Box key={route} component="span" sx={{ whiteSpace: "nowrap" }}>
            <MuiLink
              color="inherit"
              component={Link}
              href={route}
              prefetch={false}
            >
              {name}
            </MuiLink>
            <Box component="span" sx={{ mx: 1.5 }}>
              •
            </Box>
          </Box>
        ))}
        <Box component="span" sx={{ whiteSpace: "nowrap" }}>
          <MuiLink
            color="inherit"
            href={process.env.NEXT_PUBLIC_REPO}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Source
          </MuiLink>
        </Box>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {"Copyright © "}
        <MuiLink color="inherit" component={Link} href="https://evan.bio/">
          Evan Bonsignori
        </MuiLink>{" "}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
