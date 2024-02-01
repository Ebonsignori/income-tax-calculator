"use client";

import { ReactNode, useContext, useMemo, useState } from "react";
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
  ABOUT,
  HELP,
  INCOME_TAX_CALCULATOR_SHORT_TITLE,
  TAX_TABLES,
} from "@/constants/pages";
import {
  AttachMoney,
  InfoOutlined,
  QuestionMark,
  TableChartOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import Copyright from "./Copyright";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "@/context/color-mode";

const drawerWidth = 240;

export default function Wrapper({
  children,
  title,
  shortTitle,
}: {
  children: ReactNode;
  title: string;
  shortTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  const pages = [
    {
      name: INCOME_TAX_CALCULATOR_SHORT_TITLE,
      route: "/",
      icon: <AttachMoney />,
    },
    { ...TAX_TABLES, icon: <TableChartOutlined /> },
    { ...ABOUT, icon: <InfoOutlined /> },
    { ...HELP, icon: <QuestionMark /> },
  ];

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
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1 }}
              component="div"
            >
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
            {pages.map((page) => {
              const selected =
                title === page.name ||
                (typeof shortTitle !== "undefined" && shortTitle === page.name);
              return (
                <ListItem
                  key={page.name}
                  disablePadding
                  component={Link}
                  href={selected ? "" : page.route}
                  sx={{
                    textDecoration: "none",
                    color: theme.palette.text.primary,
                  }}
                >
                  <ListItemButton selected={selected}>
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText
                      primary={page.name}
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
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, p: 4 }}>
        <Toolbar />
        {children}
      </Container>
      <Copyright />
    </>
  );
}
