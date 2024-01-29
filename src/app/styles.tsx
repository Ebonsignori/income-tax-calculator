import { makeStyles } from "@mui/material/styles";

export const useStyles = makeStyles((theme: any) => ({
  centerWhenXS: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
}));
