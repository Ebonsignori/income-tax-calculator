"use client";

import type { ReactNode } from "react";
import { useCallback, useContext, useMemo, useState } from "react";
import Box from "@mui/material/Box";
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
import { Container, SwipeableDrawer, Tooltip, useTheme } from "@mui/material";
import {
  SUPPORT,
  INCOME_TAX_CALCULATOR_SHORT_TITLE,
  TAX_TABLES,
  INCOME_TAX_CALCULATOR,
  TAX_TABLES_SHORT_TITLE,
  CITY_TAXES,
  CITY_TAXES_SHORT_TITLE,
  DISCLAIMER,
} from "@/constants/pages";
import {
  AttachMoney,
  InfoOutlined,
  TableChartOutlined,
  LocationCity,
  GavelOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import Footer from "./Footer";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "@/context/color-mode";
import type { NavPage } from "@/types";

const drawerWidth = 240;

export default function Wrapper({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  const toggleDrawer = useCallback(
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event?.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
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
      {
        name: CITY_TAXES_SHORT_TITLE,
        route: CITY_TAXES.route,
        icon: <LocationCity />,
        selected: title === CITY_TAXES.name,
      },
      { ...SUPPORT, icon: <InfoOutlined />, selected: title === SUPPORT.name },
      {
        ...DISCLAIMER,
        icon: <GavelOutlined />,
        selected: title === DISCLAIMER.name,
      },
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
              id="open-nav-drawer"
              color="inherit"
              aria-label="open nav drawer"
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
        <SwipeableDrawer
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
          onOpen={toggleDrawer(true)}
          onClose={toggleDrawer(false)}
        >
          <Toolbar />
          <List>
            {pages.map(({ name, icon, route, selected }) => {
              return (
                <ListItem
                  key={name}
                  disablePadding
                  component={Link}
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
        </SwipeableDrawer>
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
