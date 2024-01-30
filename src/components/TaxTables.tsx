import { Container, Typography } from "@mui/material";

export default function TaxTables() {
  return (
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
  );
}

export async function generateStaticParams() {
  return [];
}
