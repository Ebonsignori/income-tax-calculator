import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Copyright from "@/components/Copyright";

export default function About() {
  return (
    <>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          display="flex"
          justifyContent="center"
          sx={{ mt: 4, mb: 4 }}
        >
          Tax Tables
        </Typography>
      </Container>
      <Copyright />
    </>
  );
}
