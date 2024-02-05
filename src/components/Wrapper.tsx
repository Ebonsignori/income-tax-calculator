"use client";

import type { ReactNode } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import mixpanel from "mixpanel-browser";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Container, Tooltip, useTheme } from "@mui/material";
import {
  SUPPORT,
  INCOME_TAX_CALCULATOR_SHORT_TITLE,
  TAX_TABLES,
  INCOME_TAX_CALCULATOR,
  TAX_TABLES_SHORT_TITLE,
} from "@/constants/pages";
import {
  AttachMoney,
  InfoOutlined,
  TableChartOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import Footer from "./Footer";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "@/context/color-mode";
import {
  EVENTS,
  isTrackingEnabled,
  sendAnalyticsEvent,
  setPageName,
  setTrackingEnabled,
} from "@/utils/analytics";
import type { NavPage } from "@/types";

const drawerWidth = 240;

export default function Wrapper({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    let token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "";
    if (isDev) {
      token = process.env.NEXT_PUBLIC_MIXPANEL_DEV_TOKEN || "";
    }
    mixpanel.init(token, {
      debug: isDev,
      track_pageview: false,
      persistence: "localStorage",
    });
    setPageName(title);
    if (!isTrackingEnabled() && typeof window !== "undefined") {
      setTrackingEnabled();
    }
  }, [title]);

  const [open, setOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      if (open) {
        sendAnalyticsEvent(EVENTS.NAV_CLICK);
      }

      setOpen(open);
    },
    [setOpen],
  );

  const pages: NavPage[] = useMemo(
    () => [
      {
        name: INCOME_TAX_CALCULATOR_SHORT_TITLE,
        route: "/",
        icon: <AttachMoney />,
        selected: title === INCOME_TAX_CALCULATOR.name,
      },
      {
        name: TAX_TABLES_SHORT_TITLE,
        route: TAX_TABLES.route,
        icon: <TableChartOutlined />,
        selected: title === TAX_TABLES.name,
      },
      { ...SUPPORT, icon: <InfoOutlined />, selected: title === SUPPORT.name },
    ],
    [title],
  );

  return (
    <>
      <Box sx={{ display: "flex" }} component="nav">
        <AppBar
          position="fixed"
          color="primary"
          enableColorOnDark
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={open ? toggleDrawer(false) : toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="h1">
              {title}
            </Typography>
            <Tooltip
              placement="left"
              title={`Switch to ${
                theme.palette.mode === "light" ? "dark" : "light"
              } mode`}
            >
              <IconButton
                edge="end"
                onClick={colorMode.toggleColorMode}
                color="inherit"
              >
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          anchor="left"
          open={open}
          variant="temporary"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Toolbar />
          <List>
            {pages.map(({ name, icon, route, selected }) => {
              return (
                <ListItem
                  key={name}
                  disablePadding
                  component={Link}
                  onClick={() => {
                    if (!selected) {
                      sendAnalyticsEvent(EVENTS.NAV_CHANGE, name);
                    }
                  }}
                  href={selected ? "" : route}
                  sx={{
                    textDecoration: "none",
                    color: theme.palette.text.primary,
                  }}
                >
                  <ListItemButton selected={selected}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText
                      primary={name}
                      sx={{
                        "& span": { fontWeight: selected ? "bold" : "normal" },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      </Box>
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          p: 4,
        }}
      >
        <Toolbar />
        {children}
      </Container>
      <Footer pages={pages} />
    </>
  );
}
