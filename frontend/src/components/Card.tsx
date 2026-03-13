import React from "react";
import { Paper } from "@mui/material";

interface CardProps {
  children?: React.ReactNode;
  sx?: object;
}

const Card: React.FC<CardProps> = ({ children, sx = {} }) => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: "background.paper",
      ":hover": { boxShadow: 3 },
      transition: "box-shadow .2s, transform .2s",
      ...sx,
    }}
  >
    {children}
  </Paper>
);

export default Card;
