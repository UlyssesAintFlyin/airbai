import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Dashcard } from "../components/Dashcard";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useTheme, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import { useListing } from "../hooks/useListing";
import { ReviewDialog } from "../components/ReviewDialog";
import { CircularProgress } from "@mui/material";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const SEARCH_FIELDS = ["fullName", "email", "address"];

export const ViewListingHost = () => {
  const { id } = useParams();
  const { listing, reviews, bookings, loading, error } = useListing(id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: "#df7b4c",
            "&:hover": {
              backgroundColor: "#ea8b58",
            },
          }}
          onClick={() => {
            setSelectedBooking(params.row);
            setViewOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (!bookings?.length) {
      setCustomers([]);
      return;
    }

    const fetchCustomers = async () => {
      try {
        const userDocs = await Promise.all(
          bookings.map((booking) => getDoc(doc(db, "users", booking.usersID))),
        );

        const users = userDocs
          .filter((snap) => snap.exists())
          .map((snap) => ({
            id: snap.id,
            ...snap.data(),
          }));

        setCustomers(users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomers();
  }, [bookings]);

  const mobileColumns = columns.filter(
    (col) => !["address", "checkIn", "checkOut"].includes(col.field),
  );
  const [searchText, setSearchText] = useState("");

  const paidBookings = (bookings || []).filter((b) => b.status === "paid");

  const grossRevenue = paidBookings.reduce(
    (sum, b) => sum + (b.payment || 0),
    0,
  );

  const totalTax = paidBookings.reduce((sum, b) => sum + (b.taxAmount || 0), 0);

  const totalAirbaiFee = paidBookings.reduce(
    (sum, b) => sum + (b.airbaiFeeAmount || 0),
    0,
  );

  const totalIncome = paidBookings.reduce(
    (sum, b) => sum + (b.hostIncome || 0),
    0,
  );

  const netRevenue = grossRevenue - totalAirbaiFee;
  const totalBookings = bookings?.length || 0;

  const formatPeso = (amount) =>
    amount.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });

  const rows = bookings.map((booking) => {
    const customer = customers.find((c) => c.id === booking.usersID);

    return {
      id: booking.id,
      booking,

      fullName: customer
        ? `${customer.name?.fName} ${customer.name?.lName}`
        : "Unknown",

      email: customer?.email || "",

      address: customer?.address || "",

      checkIn: booking.duration?.checkIn?.toDate().toLocaleDateString(),

      checkOut: booking.duration?.checkOut?.toDate().toLocaleDateString(),

      payment: formatPeso(booking.payment),
    };
  });

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
  }, [searchText, rows]);

  const rated = reviews.filter((r) => r.rating > 0);
  const avgRating = rated.length
    ? (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(1)
    : null;

  if (loading)
    return (
      <Box sx={{ m: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography sx={{ m: 4 }}>{error}</Typography>;
  if (!listing) return null;

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
            Viewing {listing.name}
          </Typography>
        </Box>
        <Box
          component="img"
          src={listing.imageUrl}
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
            {listing.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              lineHeight: 1.5,
              fontSize: { xs: "12px", sm: "15px" },
            }}
          >
            {listing.listingDescription}
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
            {avgRating ?? "New"} ·{" "}
            <u
              style={{ cursor: "pointer" }}
              onClick={() => setReviewsOpen(true)}
            >
              {reviews.length} Reviews
            </u>
            .
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
                value={`There are ${totalBookings} bookings`}
                bgColor="#542B24"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Dashcard
                title="Total Tax"
                value={`${formatPeso(totalTax)} had been incured`}
                bgColor="#542B24"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Dashcard
                title="Gross Revenue"
                value={`${formatPeso(netRevenue)} generated cash`}
                bgColor="#542B24"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Dashcard
                title="Total Income"
                value={`This listing made ${formatPeso(totalIncome)}`}
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
              placeholder="Search by name and email "
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
              loading={loading}
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
      <ReviewDialog
        open={reviewsOpen}
        onClose={() => setReviewsOpen(false)}
        reviews={reviews}
      />
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Booking Information</DialogTitle>

        <DialogContent dividers>
          {selectedBooking && (
            <Box>
              <Typography>
                <strong>Customer:</strong> {selectedBooking.fullName}
              </Typography>

              <Typography>
                <strong>Email:</strong> {selectedBooking.email}
              </Typography>

              <Typography>
                <strong>Check In:</strong> {selectedBooking.checkIn}
              </Typography>

              <Typography>
                <strong>Check Out:</strong> {selectedBooking.checkOut}
              </Typography>

              <Typography>
                <strong>Payment:</strong> {selectedBooking.payment}
              </Typography>

              <Typography>
                <strong>Status:</strong> {selectedBooking.booking.status}
              </Typography>

              <Typography>
                <strong>Adults:</strong> {selectedBooking.booking.guest.adults}
              </Typography>

              <Typography>
                <strong>Children:</strong>{" "}
                {selectedBooking.booking.guest.children}
              </Typography>

              <Typography>
                <strong>Infants:</strong> {selectedBooking.booking.guest.infant}
              </Typography>

              <Typography>
                <strong>Pets:</strong> {selectedBooking.booking.guest.pets}
              </Typography>

              <Typography>
                <strong>Tax:</strong>{" "}
                {formatPeso(selectedBooking.booking.taxAmount || 0)}
              </Typography>

              <Typography>
                <strong>AirbAI Fee:</strong>{" "}
                {formatPeso(selectedBooking.booking.airbaiFeeAmount || 0)}
              </Typography>

              <Typography>
                <strong>Host Income:</strong>{" "}
                {formatPeso(selectedBooking.booking.hostIncome || 0)}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
