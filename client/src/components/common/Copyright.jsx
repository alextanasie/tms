import React from "react";
import { Typography, Link, Box } from "@material-ui/core";

export const Copyright = () => {
  return (
    <Box mt={5}>
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://alextanasie.com/">
          alextanasie.com
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
};
