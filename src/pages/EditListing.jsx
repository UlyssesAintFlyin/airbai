import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { ListingMapAdmin } from "../components/ListingMapAdmin";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { useListing } from "../hooks/useListing";
import { Snackbar, Alert } from "@mui/material";
import {
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  writeBatch,
  GeoPoint,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

const textfieldSx = {
  bgcolor: "#fff",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#81756e",
    },
    "&:hover fieldset": {
      borderColor: "#df7b4c",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#df7b4c",
    },
  },
};

export const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listing, reviews, bookings, loading, error } = useListing(id);
  const [listingData, setListingData] = useState({
    roomName: "",
    description: "",
    latitude: 14.594323669692164,
    longitude: 120.9803499922559,
    imageURL: "",
    locationAddress: "",
    locationInformation: "",
    roomRate: "",
    serviceFee: "",
    cleaningFee: "",
    tax: "",
    petFee: "",
    kidsFee: "",
    adultCapacity: "",
    childCapacity: "",
    infantCapacity: "",
    petCapacity: "",
    roomCount: "",
  });

  const [attributes, setAttributes] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "error",
    message: "",
  });

  const showError = (message) => {
    setSnackbar({
      open: true,
      severity: "error",
      message,
    });
  };

  const validateForm = () => {
    if (!listingData.roomName.trim()) {
      showError("Room name is required.");
      return false;
    }

    if (Number(listingData.roomRate) < 0) {
      showError("Room rate cannot be negative.");
      return false;
    }

    if (Number(listingData.tax) < 0) {
      showError("Tax cannot be negative.");
      return false;
    }

    if (Number(listingData.tax) > 100) {
      showError("Tax cannot exceed 100%.");
      return false;
    }

    if (Number(listingData.adultCapacity) < 1) {
      showError("Adult capacity must be at least 1.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      await updateDoc(doc(db, "listings", id), {
        name: listingData.roomName,

        listingDescription: listingData.description,

        imageUrl: listingData.imageURL,

        attributes,

        location: {
          address: listingData.locationAddress,

          locInfo: listingData.locationInformation,

          geoLoc: new GeoPoint(location.lat, location.lng),
        },

        roomRate: Number(listingData.roomRate),

        fees: {
          serviceFee: Number(listingData.serviceFee),

          cleaningFee: Number(listingData.cleaningFee),

          tax: Number(listingData.tax),

          pet: Number(listingData.petFee),

          childDiscount: Number(listingData.kidsFee),
        },

        capacity: {
          adults: Number(listingData.adultCapacity),

          children: Number(listingData.childCapacity),

          infant: Number(listingData.infantCapacity),

          pets: Number(listingData.petCapacity),

          roomCount: Number(listingData.roomCount),
        },
      });

      setTimeout(() => {
        navigate("/listingMasterlist", {
          state: {
            success: "Listing updated successfully.",
          },
        });
      }, 1000);
    } catch (err) {
      console.error(err);

      showError("Failed to edit listing.");
    }
  };

  const handleDelete = async () => {
    try {
      const batch = writeBatch(db);

      batch.delete(doc(db, "listings", id));

      const reviewsSnapshot = await getDocs(
        query(collection(db, "reviews"), where("listingID", "==", id)),
      );

      reviewsSnapshot.forEach((d) => batch.delete(d.ref));

      const bookingsSnapshot = await getDocs(
        query(collection(db, "bookings"), where("listingID", "==", id)),
      );

      bookingsSnapshot.forEach((d) => batch.delete(d.ref));

      const notificationsSnapshot = await getDocs(
        query(collection(db, "notifications"), where("listingID", "==", id)),
      );

      notificationsSnapshot.forEach((d) => batch.delete(d.ref));

      await batch.commit();

      navigate("/listingMasterlist", {
        state: {
          success: "Listing deleted successfully.",
        },
      });
    } catch (err) {
      console.error(err);

      showError("Failed to delete listing.");
    }
  };

  useEffect(() => {
    if (!listing) return;

    setListingData({
      roomName: listing.name || "",
      description: listing.listingDescription || "",
      imageURL: listing.imageUrl || "",
      locationAddress: listing.location.address || "",
      locationInformation: listing.location.locInfo || "",
      latitude: listing.location?.geoLoc?.latitude || 0,
      longitude: listing.location?.geoLoc?.longitude || 0,

      roomRate: listing.roomRate || "",

      serviceFee: listing.fees?.serviceFee || "",
      cleaningFee: listing.fees?.cleaningFee || "",
      tax: listing.fees?.tax || "",
      petFee: listing.fees?.pet || "",
      kidsFee: listing.fees?.childDiscount || "",

      adultCapacity: listing.capacity?.adults || "",
      childCapacity: listing.capacity?.children || "",
      infantCapacity: listing.capacity?.infant || "",
      petCapacity: listing.capacity?.pets || "",
      roomCount: listing.capacity?.roomCount || "",
    });

    setAttributes(listing.attributes || []);

    setLocation({
      lat: listing.location?.geoLoc?.latitude || 0,
      lng: listing.location?.geoLoc?.longitude || 0,
    });
  }, [listing]);

  const [location, setLocation] = useState({
    lat: 14.594323669692164,
    lng: 120.9803499922559,
  });

  const [deleteDialog, setDeleteDialog] = useState(false);

  if (loading)
    return (
      <Box sx={{ m: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography sx={{ m: 4 }}>{error}</Typography>;
  if (!listing) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexDirection: "row",
            }}
          >
            <IconButton
              onClick={() => window.history.back()}
              sx={{
                bgcolor: "#fff",
                boxShadow: 1,
                width: 45,
                height: 45,
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              Edit Listing
            </Typography>
          </Box>

          <Box sx={{ width: "100px" }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#782f28" }}
              onClick={() => setDeleteDialog(true)}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Room Name"
              fullWidth
              sx={textfieldSx}
              value={listingData.roomName}
              onChange={(e) =>
                setListingData((prev) => ({
                  ...prev,
                  roomName: e.target.value,
                }))
              }
            />

            <Autocomplete
              multiple
              freeSolo
              sx={textfieldSx}
              options={[
                "Master Bed",
                "Dedicated Bathroom",
                "WiFi",
                "Air Conditioning",
                "Kitchen",
                "Parking",
              ]}
              value={attributes}
              onChange={(event, newValue) => setAttributes(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Attributes" />
              )}
            />
          </Box>

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            sx={textfieldSx}
            value={listingData.description}
            onChange={(e) =>
              setListingData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                mb: 2,
                fontWeight: 600,
              }}
            >
              Insert Location
            </Typography>

            <Box
              sx={{
                height: 320,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ddd",
              }}
            >
              <ListingMapAdmin
                lat={location.lat}
                lng={location.lng}
                onMapClick={(coords) => setLocation(coords)}
              />
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{
                mb: 2,
                fontWeight: 600,
              }}
            >
              Listing Image
            </Typography>

            <TextField
              label="Image URL"
              value={listingData.imageURL}
              onChange={(e) =>
                setListingData((prev) => ({
                  ...prev,
                  imageURL: e.target.value,
                }))
              }
              fullWidth
              sx={textfieldSx}
            />

            <Box
              component="label"
              sx={{
                mt: 2,
                height: 250,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ddd",
                bgcolor: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {listingData.imageURL ? (
                <Box
                  component="img"
                  src={listingData.imageURL}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography color="text.secondary">Image Preview</Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Location Address"
              value={listingData.locationAddress}
              onChange={(e) =>
                setListingData((prev) => ({
                  ...prev,
                  locationAddress: e.target.value,
                }))
              }
            />

            <TextField
              label="Latitude"
              value={location.lat}
              fullWidth
              sx={textfieldSx}
              onChange={(e) =>
                setListingData((prev) => ({
                  ...prev,
                  latitude: e.target.value,
                }))
              }
            />

            <TextField
              label="Longitude"
              value={location.lng}
              fullWidth
              sx={textfieldSx}
              onChange={(e) =>
                setListingData((prev) => ({
                  ...prev,
                  longitude: e.target.value,
                }))
              }
            />
          </Box>

          <TextField
            label="Location Information"
            multiline
            rows={7}
            fullWidth
            sx={textfieldSx}
            onChange={(e) =>
              setListingData((prev) => ({
                ...prev,
                locationInformation: e.target.value,
              }))
            }
          />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            Insert Rate
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Room Rate (Per Night)"
                fullWidth
                sx={textfieldSx}
                type="number"
                value={listingData.roomRate}
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    roomRate: e.target.value,
                  }))
                }
              />

              <TextField
                label="Service Fee"
                fullWidth
                sx={textfieldSx}
                type="number"
                value={listingData.serviceFee}
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    serviceFee: e.target.value,
                  }))
                }
              />

              <TextField
                label="Cleaning Fee"
                fullWidth
                sx={textfieldSx}
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    cleaningFee: e.target.value,
                  }))
                }
              />
            </Box>

            {/* RIGHT */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Tax"
                fullWidth
                sx={textfieldSx}
                slotProps={{ htmlInput: { min: 1, max: 100 } }}
                value={listingData.tax}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    tax: e.target.value,
                  }))
                }
              />

              <TextField
                label="Additional Fee for Pets"
                fullWidth
                sx={textfieldSx}
                slotProps={{ htmlInput: { min: 1 } }}
                value={listingData.petFee}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    petFee: e.target.value,
                  }))
                }
              />

              <TextField
                label="Discount Fee for Kids"
                fullWidth
                sx={textfieldSx}
                slotProps={{ htmlInput: { min: 1 } }}
                value={listingData.kidsFee}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    kidsFee: e.target.value,
                  }))
                }
              />
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            Define Guest Capacity
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Adults"
                fullWidth
                sx={textfieldSx}
                value={listingData.adultCapacity}
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    adultCapacity: e.target.value,
                  }))
                }
              />

              <TextField
                label="Children"
                fullWidth
                sx={textfieldSx}
                value={listingData.childCapacity}
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    childCapacity: e.target.value,
                  }))
                }
              />

              <TextField
                label="Infant"
                fullWidth
                sx={textfieldSx}
                value={listingData.infantCapacity}
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    infantCapacity: e.target.value,
                  }))
                }
              />
            </Box>

            {/* RIGHT */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Pets"
                type="number"
                slotProps={{ htmlInput: { min: 1, max: 100 } }}
                fullWidth
                sx={textfieldSx}
                value={listingData.petCapacity}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    petCapacity: e.target.value,
                  }))
                }
              />

              <TextField
                label="Number of Rooms"
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
                fullWidth
                sx={textfieldSx}
                value={listingData.roomCount}
                onChange={(e) =>
                  setListingData((prev) => ({
                    ...prev,
                    roomCount: e.target.value,
                  }))
                }
              />
            </Box>
          </Box>
        </Box>

        {/* SUBMIT */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#df7b4c",
              px: 5,
              py: 1.2,
              borderRadius: "8px",
              minWidth: 160,
              "&:hover": {
                bgcolor: "#c96d41",
              },
            }}
            onClick={() => {
              handleSubmit();
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Listing</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this listing? This action cannot be
            undone. All associated reviews, bookings, and notifications will
            also be deleted.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setDeleteDialog(false);
              handleDelete();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
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
    </Box>
  );
};
