import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { ListingMapAdmin } from "../components/ListingMapAdmin";

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
  const [listingData, setListingData] = useState({
    roomName: "",
    description: "",
    latitude: 14.594323669692164,
    longitude: 120.9803499922559,
    locationName: "",
    locationInformation: "",
    roomRate: "",
    serviceFee: "",
    cleaningFee: "",
    tax: "",
    petFee: "",
    kidsFee: "",
  });

  const [location, setLocation] = useState({
    lat: 14.594323669692164,
    lng: 120.9803499922559,
  });

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

          <Box sx={{width:"100px"}}>
            <Button fullWidth variant="contained" sx={{ bgcolor: "#782f28" }}>
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
            <TextField label="Room Name" fullWidth sx={textfieldSx} />

            <TextField label="Room Attributes" fullWidth sx={textfieldSx} />

            <Button
              variant="contained"
              sx={{
                width: "fit-content",
                bgcolor: "#df7b4c",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#c96d41",
                },
              }}
            >
              Add Attribute
            </Button>
          </Box>

          <TextField
            label="Description"
            multiline
            rows={8}
            fullWidth
            sx={textfieldSx}
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
                height: 250,
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
                visibility: "hidden",
              }}
            >
              Upload
            </Typography>

            <Box
              component="label"
              sx={{
                height: 250,
                borderRadius: 2,
                bgcolor: "#bdbdbd",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <input hidden accept="image/*" type="file" />

              <AddPhotoAlternateIcon
                sx={{
                  fontSize: 70,
                  color: "#fff",
                }}
              />

              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Add Image
              </Typography>
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
            <TextField label="Location Name" fullWidth sx={textfieldSx} />

            <TextField
              label="Latitude"
              value={location.lat}
              fullWidth
              sx={textfieldSx}
            />

            <TextField
              label="Longitude"
              value={location.lng}
              fullWidth
              sx={textfieldSx}
            />
          </Box>

          <TextField
            label="Location Information"
            multiline
            rows={6}
            fullWidth
            sx={textfieldSx}
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
              />

              <TextField label="Service Fee" fullWidth sx={textfieldSx} />

              <TextField label="Cleaning Fee" fullWidth sx={textfieldSx} />
            </Box>

            {/* RIGHT */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField label="Tax" fullWidth sx={textfieldSx} />

              <TextField
                label="Additional Fee for Pets"
                fullWidth
                sx={textfieldSx}
              />

              <TextField
                label="Additional Fee for Kids"
                fullWidth
                sx={textfieldSx}
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
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
