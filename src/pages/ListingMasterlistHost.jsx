import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdminRoomCard } from "../components/AdminRoomCard";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Link, useNavigate } from "react-router-dom";

const rooms = [
  {
    id: 1,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    status: "Pending",
  },
  {
    id: 2,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    status: "Turned-down",
  },
  {
    id: 3,
    title: "Room in Cebu",
    image: "/resources/room1.png",
    status: "Approved",
  },
];

const filters = ["All Listings", "Approved", "Turned-down", "Pending"];

export const ListingMasterlistHost = () => {
  const [value, setValue] = useState(filters[0]);
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleView = (e) => {
    if (!selectedRoom) {
      setOpen(true);
      return;
    }
    navigate(`/listingMasterlist/${selectedRoom.id}`);
  };

  const handleEdit = (e) => {
    if (!selectedRoom) {
      setOpen(true);
      return;
    }
    navigate(`/listingMasterlist/EditListing/${selectedRoom.id}`);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          width: "90%",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            pb: 3,
            alignItems: "center",
            mt: 2,
            width: "100%",
            borderBottom: "1px solid #5C5C5C",
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
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
              Your Listings
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", sm: 420 },
              pt: { xs: 2, sm: 0 },
            }}
          >
            <Autocomplete
              options={filters}
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              sx={{
                minWidth: { xs: "100%", sm: 420 },
                bgcolor: "#ffffff",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#e8dbd4" },
                  "&:hover fieldset": { borderColor: "#df7b4c" },
                  "&.Mui-focused fieldset": { borderColor: "#df7b4c" },
                },
              }}
              renderInput={(params) => <TextField {...params} label="Filter" />}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            mt: 3,
            mb: 3,
            alignItems: "stretch",
            width: "100%",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#df7b4c" }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="Clear search"
                        onClick={() => setSearchText("")}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                minWidth: { xs: "100%", sm: 420 },
                bgcolor: "#ffffff",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#e8dbd4" },
                  "&:hover fieldset": { borderColor: "#df7b4c" },
                  "&.Mui-focused fieldset": { borderColor: "#df7b4c" },
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", sm: "600px" },
              height: "56px",
              gap: 3,
              mt: { xs: 3, sm: 0 },
            }}
          >
            <Button
              component={Link}
              to="/listingMasterlist/addListing"
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#297828" }}
            >
              Insert
            </Button>
            <Button
              fullWidth
              onClick={handleEdit}
              variant="contained"
              sx={{ bgcolor: "#2f2878" }}
            >
              Edit
            </Button>
            <Button
              fullWidth
              onClick={handleView}
              variant="contained"
              sx={{ bgcolor: "#786f28" }}
            >
              View
            </Button>
          </Box>
        </Box>

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
            <AdminRoomCard
              key={room.id}
              {...room}
              selected={selectedRoom?.id === room.id}
              onClick={() => {
                setSelectedRoom((prev) => (prev?.id === room.id ? null : room));
              }}
            />
          ))}
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          Please select a listing first.
        </Alert>
      </Snackbar>
    </Box>
  );
};
