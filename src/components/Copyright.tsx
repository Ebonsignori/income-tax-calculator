import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

export default function Copyright({ sx }) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={sx}>
      {"Copyright © "}
      <MuiLink color="inherit" href="https://evan.bio/">
        Evan Bonsignori
      </MuiLink>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}
