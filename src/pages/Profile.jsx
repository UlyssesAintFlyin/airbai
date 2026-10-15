import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    description: "P 1,756 for 1 night * 5.0 (1)",
  },
  {
    id: 3,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    description: "P 1,756 for 1 night * 5.0 (1)",
  },
];

export const Profile = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "30%" },
          height: { xs: "480px", sm: "100vh" },
          borderRight: { xs: "none", sm: "1px solid #5C5C5C" },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 2,
            width: "90%",
            alignItems: "center",
            mt: 2,
          }}
        >
          <IconButton
            onClick={() => window.history.back()}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "white",
              boxShadow: 1,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              ml: 2,
              lineHeight: 1,
              fontSize: { xs: "1rem", sm: "1.5rem" },
            }}
          >
            My Profile
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            boxShadow: "0px 4px 10px 5px rgba(0, 0, 0, 0.14)",
            borderRadius: 4,
            p: 2,
            mt: { xs: 0, sm: 2 },
          }}
        >
          <Avatar
            sx={{
              mt: { xs: 0, sm: 2 },
              width: { xs: 50, sm: 120 },
              height: { xs: 50, sm: 120 },
              bgcolor: "#E0824F",
              fontSize: { xs: "1.5rem", sm: "4rem" },
            }}
          >
            JD
          </Avatar>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mt: { xs: 0, sm: 2 } }}
          >
            John Doe
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
          >
            Guest User
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "90%",
              gap: 3,
              flexDirection: "column",
              mt: { xs: 1, sm: 3 },
            }}
          >
            <TextField variant="outlined" label="Email Address" fullWidth />
            <TextField
              variant="outlined"
              label="Location Address"
              disabled
              fullWidth
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "90%",
              gap: { xs: 2, sm: 3 },
              flexDirection: "column",
              mt: { xs: 3, sm: 5 },
              mb: { xs: 1, sm: 3 },
            }}
          >
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#e07e48", "&:hover": { bgcolor: "#ed8e5b" } }}
            >
              Edit location
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#cb6933", "&:hover": { bgcolor: "#ed8e5b" } }}
            >
              Edit Name
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#ab4e1c", "&:hover": { bgcolor: "#c86632" } }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "70%" },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 2,
            width: "90%",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 2,
              width: "90%",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                lineHeight: 1,
                fontSize: { xs: "1rem", sm: "1.5rem" },
              }}
            >
              My Reservations
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", width: "90%", justifyContent: "center" }}>
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gap: 5,
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(auto-fill, minmax(180px, 1fr))",
              },
              mb: 5,
            }}
          >
            {rooms.map((room) => (
              <RoomCard
                {...room}
                onClick={() => {
                  setSelectedRoom(room);
                  setOpen(true);
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
