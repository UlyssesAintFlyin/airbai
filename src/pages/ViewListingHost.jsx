import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Dashcard } from "../components/Dashcard";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme, useMediaQuery } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "fullName", headerName: "Full name", flex: 1, minWidth: 160 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 120 },
  { field: "address", headerName: "Address", flex: 1, width: 110 },
  { field: "checkIn", headerName: "Check-in", flex: 1, width: 110 },
  { field: "checkOut", headerName: "Check-out", flex: 1, width: 110 },
  { field: "payment", headerName: "Payment", flex: 1, width: 110 },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    renderCell: (params) => {
      const onClick = (e) => {
        e.stopPropagation();

        alert(`Clicked row with ID: ${params.row.id}`);
      };

      return (
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#df7b4c",
            "&:hover": { backgroundColor: "#ea8b58" },
          }}
          onClick={onClick}
        >
          View
        </Button>
      );
    },
  },
];

const SEARCH_FIELDS = ["fullName", "email", "address"];

const rows = [
  {
    id: 1,
    fullName: "Manalad, Ivan M.",
    email: "ivanmanalad@gmail.com",
    address: "0611 Mariano Street",
    checkIn: "October 14, 2026",
    checkOut: "October 15, 2026",
    payment: "1,200.00",
  },
];

export const ViewListingHost = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const mobileColumns = columns.filter(
    (col) => !["address", "checkIn", "checkOut"].includes(col.field),
  );
  const [searchText, setSearchText] = useState("");

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      SEARCH_FIELDS.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [searchText]);

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
            Viewing room name
          </Typography>
        </Box>
        <Box
          component="img"
          src="/resources/room1.png"
          alt="Listing"
          sx={{
            width: "90%",
            objectFit: "cover",
            height: { xs: 200, sm: 500 },
            mb: 2,
            margin: "0 auto",
          }}
        />
        <Box
          sx={{
            width: "90%",
            objectFit: "cover",
            pt: 1,
            pb: 2,
            margin: "0 auto",
            borderBottom: "1px solid #5C5C5C",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mt: 2,
              lineHeight: 1,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            Listing Title
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              lineHeight: 1.5,
              fontSize: { xs: "12px", sm: "15px" },
            }}
          >
            Listing description goes here. This is a placeholder for the actual
            listing details.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              lineHeight: 1.5,
              fontSize: { xs: "12px", sm: "15px" },
              fontWeight: "bold",
            }}
          >
            5.0 - <u>6 Reviews</u>.
          </Typography>
        </Box>
        <Box
          sx={{
            width: "90%",
            height: { xs: "680px", sm: "200px" },
            pt: 4,
            pb: 2,
            margin: "0 auto",
            borderBottom: "1px solid #5C5C5C",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Dashcard
                title="Total Booking"
                value="There are over 60 bookings"
                bgColor="#542B24"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Dashcard
                title="Total Tax"
                value="A total of ₱100,000 had been incured"
                bgColor="#542B24"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Dashcard
                title="Total Income"
                value="This Listing income is ₱100,000"
                bgColor="#542B24"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Dashcard
                title="Total Revenue"
                value="This listing made ₱100,000"
                bgColor="#542B24"
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            width: "90%",
            height: { xs: "680px", sm: "630px" },
            pt: 4,
            pb: 2,
            margin: "0 auto",
          }}
        >
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

          <Box sx={{ height: "500px", width: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={filteredRows}
              columns={isMobile ? mobileColumns : columns}
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
