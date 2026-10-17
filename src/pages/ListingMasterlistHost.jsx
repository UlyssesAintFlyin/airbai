import React, { useState, useEffect } from "react";
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
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AdminRoomCard } from "../components/AdminRoomCard";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";

const filters = ["All Listings", "approved", "turned-down", "pending"];

export const ListingMasterlistHost = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [value, setValue] = useState(filters[0]);
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [notificationDialog, setNotificationDialog] = useState(false);

  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleNotificationView = async (notif) => {
    try {
      await updateDoc(doc(db, "notifications", notif.id), {
        read: true,
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
      );

      setSelectedNotification(notif);
      setNotificationDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, "notifications"),
          where("hostID", "==", user.id),
        );

        const snapshot = await getDocs(q);

        const notifData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotifications(notifData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleNotificationOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (!user?.id) return;

      try {
        const q = query(
          collection(db, "listings"),
          where("hostID", "==", user.id),
        );

        const snapshot = await getDocs(q);

        const roomData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRooms(roomData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  useEffect(() => {
    if (location.state?.success) {
      setSnackbar({
        open: true,
        severity: "success",
        message: location.state.success,
      });

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [location, navigate]);

  const filteredRooms = rooms.filter((room) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      String(room.name || "")
        .toLowerCase()
        .includes(search) ||
      String(room.location?.address || "")
        .toLowerCase()
        .includes(search) ||
      String(room.status || "")
        .toLowerCase()
        .includes(search);

    const matchesFilter = value === "All Listings" || room.status === value;

    return matchesSearch && matchesFilter;
  });

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

  const handleSuccessSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
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
              width: { xs: "100%", sm: 450 },
              pt: { xs: 2, sm: 0 },
              justifyContent: "space-between",
            }}
          >
            <Autocomplete
              options={filters}
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              sx={{
                minWidth: { xs: "90%", sm: 400 },
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

            <IconButton
              sx={{ minWidth: "20px", minHeight: "20px" }}
              onClick={handleNotificationOpen}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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

        {loading ? (
          <Typography>Loading listings...</Typography>
        ) : (
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
            {filteredRooms.map((room) => (
              <AdminRoomCard
                key={room.id}
                id={room.id}
                title={room.name}
                image={room.imageUrl}
                status={room.status}
                selected={selectedRoom?.id === room.id}
                onClick={() =>
                  setSelectedRoom(selectedRoom?.id === room.id ? null : room)
                }
              />
            ))}
          </Box>
        )}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSuccessSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleNotificationClose}
      >
        {notifications.length === 0 ? (
          <MenuItem>No notifications</MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem
              sx={{
                bgcolor: !notif.read ? "#fff3e0" : "inherit",
                color: !notif.read ? "#0e0e0e" : "#878686",
              }}
              key={notif.id}
              onClick={() => handleNotificationView(notif)}
            >
              <ListItemText
                primary={
                  notif.message.length > 50
                    ? `${notif.message.slice(0, 30)}...`
                    : notif.message
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>
      <Dialog
        open={notificationDialog}
        onClose={() => setNotificationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Message from Airbai Admin</DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
            }}
          >
            {selectedNotification?.message}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              mt: 2,
              display: "block",
              color: "text.secondary",
            }}
          >
            {selectedNotification?.createdAt?.toDate()?.toLocaleString()}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setNotificationDialog(false)}>Close</Button>

          <Button
            variant="contained"
            onClick={() => {
              setNotificationDialog(false);

              navigate(`/listingMasterlist/${selectedNotification.listingID}`);
            }}
          >
            View Listing
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
