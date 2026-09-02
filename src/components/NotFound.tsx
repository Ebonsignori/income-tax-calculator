"use client";

import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export function NotFoundPage() {
  const href = "/";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "50vh",
      }}
    >
      <Typography component="h1" variant="h1">
        404
      </Typography>
      <Typography component="h2" variant="h6">
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        sx={{
          mt: 2,
        }}
        variant="contained"
        component={Link}
        href={href}
      >
        Return Home
      </Button>
    </Box>
  );
}
