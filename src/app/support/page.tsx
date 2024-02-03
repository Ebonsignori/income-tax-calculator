import * as React from "react";
import Wrapper from "@/components/Wrapper";
import { SUPPORT } from "@/constants/pages";
import {
  Button,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { ArrowRightOutlined } from "@mui/icons-material";
import { defaultMetadata, getPageSpecificMetadata } from "@/utils/get-metadata";

function SupportItem({ text, sx }: { text: string; sx?: object }) {
  return (
    <Typography
      variant="body1"
      fontSize="large"
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        mt: 1,
        textAlign: "center",
        ...sx,
      }}
    >
      <ArrowRightOutlined
        fontSize="small"
        sx={{
          mr: 1,
        }}
      />{" "}
      {text}
    </Typography>
  );
}

export default function Support() {
  return (
    <Wrapper title={SUPPORT.name}>
      <Typography variant="h2" textAlign="center">
        Need Help?
      </Typography>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <SupportItem text="Something broken?" sx={{ mt: 4 }} />
        <SupportItem text="Have a questions?" />
        <SupportItem text="Want a new feature?" />
        <Typography
          variant="body1"
          fontSize="large"
          fontWeight="bold"
          sx={{
            mt: 4,
          }}
        >
          Please,
        </Typography>
        <Button
          sx={{
            mt: 1,
          }}
          variant="contained"
          component={Link}
          href={
            process.env.NEXT_PUBLIC_NEW_REPO_ISSUE_LINK ||
            "https://github.com/Ebonsignori/income-calculator/issues/new"
          }
        >
          Report issue on GitHub
        </Button>
      </Container>
    </Wrapper>
  );
}

export async function generateMetadata() {
  return {
    title: "Support - Income Tax Calculator",
    ...defaultMetadata,
    ...getPageSpecificMetadata(SUPPORT.name),
  };
}
