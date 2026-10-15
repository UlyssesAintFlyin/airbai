import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "fullName", headerName: "Full name", flex: 1, minWidth: 160 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 160 },
  { field: "role", headerName: "Role", width: 110 },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => {
      const onClick = (e) => {
        e.stopPropagation(); // Prevents the row from becoming selected on button click

        alert(`Clicked row with ID: ${params.row.id}`);
      };

      return (
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: "#df7b4c", "&:hover": { backgroundColor: "#ea8b58" } }}
          onClick={onClick}
        >
          Manage
        </Button>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    fullName: "Manalad, Ivan M.",
    email: "ivanmanalad@gmail.com",
    role: "admin",
  },
];

// Fields the search box looks through
const SEARCH_FIELDS = ["id", "fullName", "email", "role"];

export const UsersListAdmin = () => {
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      SEARCH_FIELDS.some((field) =>
        String(row[field] ?? "").toLowerCase().includes(query)
      )
    );
  }, [searchText]);

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
          gap: "12px",
          alignItems: "center",
          mb: "14px",
          pb: 2,
          borderBottom: "1px solid #5C5C5C",
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
          to="/admin/listings"
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
          Listings
        </Button>
        <Button
          id="tab-listings"
          disableElevation
          component={Link}
          to="/admin/users"
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
          users
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          mb: 3,
          alignItems: "stretch",
          width: "100%",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Box className="table" sx={{ width: "90%" }}>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by name, email, role, or ID"
              size="small"
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
                maxWidth: 420,
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

          <Box sx={{ height: "500px" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              // loading={loading}  // handy once rows come from Firebase
              disableRowSelectionOnClick
              pageSizeOptions={[10, 20, 35]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              sx={{
                bgcolor: "#ffffff",
                borderColor: "#62534b",
                borderRadius: "12px",
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: "#fef8f5",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 700,
                },
                "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaders": {
                  borderColor: "#e8dbd4",
                },
                "& .MuiDataGrid-row:hover": {
                  bgcolor: "#fef8f5",
                },
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                  outline: "none",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};