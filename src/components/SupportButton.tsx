"use client";

import { EVENTS, sendAnalyticsEvent } from "@/utils/analytics";
import { Button } from "@mui/material";
import MuiLink from "@mui/material/Link";
import Link from "next/link";

type SupportButtonProps = {
  asLink?: boolean;
};

export function SupportButton({ asLink }: SupportButtonProps) {
  const href =
    process.env.NEXT_PUBLIC_NEW_REPO_ISSUE_LINK ||
    "https://github.com/Ebonsignori/income-tax-calculator/issues/new";
  const onClick = () =>
    sendAnalyticsEvent(EVENTS.LINK_CLICK, href, {
      link_text: "open an issue on GitHub",
      is_external: true,
    });
  if (asLink) {
    return (
      <MuiLink color="inherit" component={Link} href={href} onClick={onClick}>
        open an issue on GitHub
      </MuiLink>
    );
  }
  return (
    <Button
      sx={{
        mt: 1,
      }}
      variant="contained"
      component={Link}
      onClick={onClick}
      href={href}
    >
      Report issue on GitHub
    </Button>
  );
}
