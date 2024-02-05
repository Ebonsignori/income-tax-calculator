"use client";

import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
import { Button } from "@mui/material";
import Link from "next/link";

export function SupportButton() {
  return (
    <Button
      sx={{
        mt: 1,
      }}
      variant="contained"
      component={Link}
      onClick={() => sendAnalyticsEvent(EVENTS.OPEN_ISSUE_CLICK)}
      href={
        process.env.NEXT_PUBLIC_NEW_REPO_ISSUE_LINK ||
        "https://github.com/Ebonsignori/income-calculator/issues/new"
      }
    >
      Report issue on GitHub
    </Button>
  );
}
