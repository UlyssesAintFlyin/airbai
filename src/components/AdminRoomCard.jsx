import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const AdminRoomCard = ({
  id,
  title,
  image,
  status,
  onClick,
  selected,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "block",
        width: "100%",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          objectFit: "cover",
          borderRadius: "16px",
          display: "block",
          border: selected ? "4px solid #df7b4c" : "4px solid transparent",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "scale(1.02)" },
        }}
      />

      <Typography
        sx={{
          mt: 0.75,
          fontWeight: "bold",
          fontSize: 13,
          color: "#101010",
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          color: "#6b6b6b",
          lineHeight: 1.3,
        }}
      >
        {status}
      </Typography>
    </Box>
  );
};
