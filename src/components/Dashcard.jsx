import { Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Dashcard = ({
  title,
  value,
  bgColor = "#1b1b1b",
  textColor = "#fff",
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        textAlign: "center",
        borderRadius: 2,
        backgroundColor: bgColor,
        color: textColor,
        minHeight:"140px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 8,
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, mt:2 }}>
        {value}
      </Typography>
    </Paper>
  );
};
