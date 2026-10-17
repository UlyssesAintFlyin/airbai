import React, { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { Link } from "react-router-dom";
import { AdminRoomCard } from "../components/AdminRoomCard";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

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

export const ListingMasterlistAdmin = () => {
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState(filters[0]);

  const buttonSx = {
    bgcolor: "#9a491d",
    "&:hover": { bgcolor: "#d9743f" },
    flex: 1,
  };
  return (
    <Box
      sx={{
        display: "flex",
        pt: 4,
        width: "90%",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "14px",
          pb: 2,
          borderBottom: "1px solid #5C5C5C",
        }}
      >
        <Box
          sx={{
            gap: "12px",
            display: "flex",
            width: { xs: "100%", sm: "300px" },
          }}
        >
          <Button
            id="tab-dashboard"
            disableElevation
            component={Link}
            to="/admin"
            sx={{
              bgcolor: "#ffffff",
              color: "#df7b4c",
              border: "1px solid #e8dbd4",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
              "&:hover": {
                bgcolor: "#fef8f5",
                borderColor: "#df7b4c",
              },
            }}
          >
            Dashboard
          </Button>

          <Button
            id="tab-listings"
            disableElevation
            component={Link}
            to="/admin/users"
            sx={{
              bgcolor: "#ffffff",
              color: "#df7b4c",
              border: "1px solid #e8dbd4",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
              "&:hover": {
                bgcolor: "#fef8f5",
                borderColor: "#df7b4c",
              },
            }}
          >
            users
          </Button>
          
          <Button
            id="tab-listings"
            disableElevation
            component={Link}
            to="/admin/listings"
            sx={{
              bgcolor: "#df7b4c",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 2px 4px rgba(223, 123, 76, 0.25)",
              "&:hover": {
                bgcolor: "#d06e3f",
                boxShadow: "0 4px 8px rgba(223, 123, 76, 0.35)",
              },
            }}
          >
            Listings
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            width: "420px",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
          }}
        >
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
      </Box>

      <Box
        sx={{
          display: "flex",
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
          <Button fullWidth variant="contained" sx={buttonSx}>
            View Listing
          </Button>
          <Button fullWidth variant="contained" sx={buttonSx}>
            Approve Listing
          </Button>
          <Button fullWidth variant="contained" sx={buttonSx}>
            Turn-down
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
          mt: { xs: 2, sm: 0 },
        }}
      >
        {rooms.map((room) => (
          <AdminRoomCard
            key={room.id}
            {...room}
            onClick={() => {
              setSelectedRoom(room);
              setOpen(true);
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
