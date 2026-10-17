import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { ListingMapAdmin } from "../components/ListingMapAdmin";
import { useAuth } from "../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import { addDoc, collection, Timestamp, GeoPoint } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

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

export const AddListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const [location, setLocation] = useState({
    lat: 14.594323669692164,
    lng: 120.9803499922559,
  });

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

      await addDoc(collection(db, "listings"), {
        name: listingData.roomName,

        listingDescription: listingData.description,

        attributes: attributes,

        location: {
          address: listingData.locationAddress,
          locInfo: listingData.locationInformation,
          geoLoc: new GeoPoint(location.lat, location.lng),
        },

        status: "pending",

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

        hostID: user.id,

        imageUrl: listingData.imageURL,

        createdAt: Timestamp.now(),
        message: "",
      });

      navigate("/listingMasterlist", {
        state: {
          success: "Listing submitted successfully.",
        },
      });
    } catch (err) {
      console.error(err);

      showError("Failed to create listing.");
    }
  };

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
            Add Listing
          </Typography>
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
            rows={6}
            fullWidth
            sx={textfieldSx}
            value={listingData.locationInformation}
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
                value={listingData.cleaningFee}
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
                label="Tax (Percentage)"
                type="number"
                slotProps={{ htmlInput: { min: 1, max: 100 } }}
                fullWidth
                sx={textfieldSx}
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
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
                fullWidth
                sx={textfieldSx}
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
                type="number"
                slotProps={{ htmlInput: { min: 1 } }}
                fullWidth
                sx={textfieldSx}
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
            onClick={handleSubmit}
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
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddListing;
