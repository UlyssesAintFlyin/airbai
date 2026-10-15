import React from "react";
import {
  Avatar,
  Box,
  Typography,
  Rating,
} from "@mui/material";

export const ReviewCard = ({
  name = "Jonathan",
  date = "1 week ago",
  rating = 5,
  review = "Amazing stay, the place was so nice... very recommendable...",
  onClick,
  clamp = false, // truncate text in the preview cards
}) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        maxWidth: 300,
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { opacity: 0.8 } : {},
      }}
    >
      {/* User Info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ width: 60, height: 60, bgcolor: "#E0824F", fontWeight: "bold" }}>
          {initials}
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>{name}</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>{date}</Typography>
        </Box>
      </Box>

      <Rating value={rating} readOnly size="small" />

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          lineHeight: 1.4,
          ...(clamp && {
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }),
        }}
      >
        {review}
      </Typography>
    </Box>
  );
};