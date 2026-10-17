import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Header = ({ onSearch, onOpenLogin, showSnackbar }) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [query, setQuery] = useState("");
  const handleClear = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleAccountClick = (e) => {
    if (user) setMenuAnchor(e.currentTarget);
    else onOpenLogin();
  };

  const handleLogout = async () => {
    try {
      await logout();

      showSnackbar?.("Logged out successfully!", "info");

      navigate("/");
    } catch (error) {
      console.error(error);

      showSnackbar?.("Failed to log out.", "error");
    }
  };
  ``;

  const navigate = useNavigate();

  const location = useLocation();
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#E9E9E9",
        transition: "background-color 0.5s ease, color 0.5s ease",
        boxShadow: "none",
        borderBottom: "2px solid #5252525c",
        height: 80,
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 1, sm: 2 },
          minWidth: 0,
          justifyContent: "space-between",
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: "inline-flex",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src="/resources/airbai.png"
            alt="Logo"
            sx={{
              maxWidth: 130,
              height: { xs: 40, md: "auto" },
              transition:
                "opacity 0.5s ease, max-width 0.5s ease, height 0.5s ease",
              cursor: "pointer",
            }}
          />
        </Box>
        {location.pathname === "/" && (
          <>
            <Box
              sx={{
                flexGrow: 1,
                mx: 2,
                maxWidth: 500,
                display: { xs: "none", md: "block" },
              }}
            >
              <TextField
                fullWidth
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {query && (
                          <IconButton
                            onClick={handleClear}
                            size="small"
                            sx={{ mr: 0.5 }}
                          >
                            <ClearIcon />
                          </IconButton>
                        )}
                        <IconButton
                          sx={{
                            backgroundColor: "#E0824F",
                            color: "#fff",
                            width: 40,
                            height: 40,
                            "&:hover": { backgroundColor: "#d9743f" },
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "50px",
                    backgroundColor: "#F3F3F3",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                  "& input": {
                    paddingLeft: "20px",
                    fontSize: "16px",
                  },
                }}
              />
            </Box>
          </>
        )}

        {location.pathname === "/" && (
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              color: "#ffffff",
              backgroundColor: "#E0824F",
            }}
            onClick={() => setSearchDialogOpen(true)}
          >
            <SearchIcon />
          </IconButton>
        )}
        <Box>
          {user?.role === "user" && (
            <Button sx={{ fontSize: { xs: "12px", sm: "16px" } }}>
              <u>be-a-host</u>
            </Button>
          )}
          <Button
            startIcon={<AccountCircleIcon />}
            onClick={handleAccountClick}
            sx={{
              ml: 2,
              backgroundColor: "#E0824F",
              color: "#FFFFFF",
              borderRadius: "15px",
              textTransform: "none",
              maxWidth: { xs: 140, sm: 220 },
              "&:hover": { backgroundColor: "#d9743f" },
            }}
          >
            <Box
              component="span"
              title={user?.email}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                maxWidth: { xs: 70, sm: 150 },
              }}
            >
              {user ? user.email : "Sign Up"}
            </Box>
          </Button>
        </Box>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          {/* later: <MenuItem component={Link} to="/bookings">My bookings</MenuItem> */}
          {user?.role === "admin" && (
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                navigate("/admin");
              }}
            >
              Admin Dashboard
            </MenuItem>
          )}
          {(user?.role === "user" ||
            user?.role === "host" ||
            user?.role === "admin") && (
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                navigate("/profile");
              }}
            >
              User Profile
            </MenuItem>
          )}
          {user?.role === "host" && (
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                navigate("/listingMasterlist");
              }}
            >
              Listings
            </MenuItem>
          )}
          <MenuItem
            onClick={async () => {
              setMenuAnchor(null);
              await handleLogout();
            }}
          >
            Log out
          </MenuItem>
        </Menu>
      </Toolbar>
      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Search Listings</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Search..."
            value={query}
            onChange={handleChange}
            sx={{ mt: 1 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    {query && (
                      <IconButton onClick={handleClear}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};
