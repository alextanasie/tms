import React from "react";
import { Typography, Link, Box } from "@material-ui/core";

interface Props {}

export const Copyright: React.FC<Props> = () => {
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
