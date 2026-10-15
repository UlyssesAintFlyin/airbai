import React from "react";
import { Box, Typography } from "@mui/material";
import { RoomCard } from "../components/RoomCard";

const rooms = [
  {
    id: 1,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 night * 5.0 (1)",
  },
  {
    id: 2,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 nights * 5.0 (1)",
  },
  {
    id: 3,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 nights * 5.0 (1)",
  },
  {
    id: 4,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 nights * 5.0 (1)",
  },
  {
    id: 5,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 nights * 5.0 (1)",
  },
  {
    id: 6,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 nights * 5.0 (1)",
  },
  {
    id: 7,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 nights * 5.0 (1)",
  },
  {
    id: 8,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 nights * 5.0 (1)",
  },
  {
    id: 9,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 nights * 5.0 (1)",
  },
];

export const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 4,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
        Available Rooms.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          mb: 5,
        }}
      >
        {rooms.map((room) => (
          <RoomCard {...room} to={`/listing/${room.id}`} />
        ))}
      </Box>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
        Available Condos.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          mb: 5,
        }}
      >
        {rooms.map((room) => (
          <RoomCard {...room} to={`/listing/${room.id}`} />
        ))}
      </Box>
    </Box>
  );
};
