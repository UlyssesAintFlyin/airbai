import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import { Button, Box, Typography, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ReservationBox } from "../components/ReservationBox";
import { ReviewCard } from "../components/ReviewCard";
import { ReviewDialog } from "../components/ReviewDialog";
import { ListingMap } from "../components/ListingMap";
import { useListing } from "../hooks/useListing";
import { useParams, useNavigate } from "react-router-dom";
import { useFullyBookedNights } from "../hooks/useFullyBookedNights";

export const SpecificListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listing, host, reviews, loading, error } = useListing(id);
  const fullyBookedNights = useFullyBookedNights(
    id,
    listing?.capacity?.roomCount,
  );
  const [reviewsOpen, setReviewsOpen] = useState(false);

  if (loading)
    return (
      <Box sx={{ m: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography sx={{ m: 4 }}>{error}</Typography>;
  if (!listing) return null;

  const handleReserve = (booking) =>
    navigate(`/payment/${listing.id}`, {
      state: {
        listing: {
          id: listing.id,
          name: listing.name,
          imageUrl: listing.imageUrl,
          roomRate: listing.roomRate,
          fees: listing.fees,
        },
        booking,
      },
    });

  const rated = reviews.filter((r) => r.rating > 0);
  const avgRating = rated.length
    ? (rated.reduce((sum, r) => sum + r.rating, 0) / rated.length).toFixed(1)
    : null;

  const hostInitials = host?.name
    ? `${host.name.fName[0]}${host.name.lName[0]}`
    : "?";
  const { latitude, longitude } = listing.location.geoLoc;
  const hostName = host?.name
    ? `${host.name.fName} ${host.name.lName}`
    : "Unknown host";
  return (
    <Box sx={{ display: "flex", flexDirection: "column", margin: 2 }}>
      <Box
        sx={{
          display: "flex",
          mb: 2,
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
            mt: 0.5,
            lineHeight: 1,
            fontSize: { xs: "1rem", sm: "1.5rem" },
          }}
        >
          Viewing {listing.name}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "90%", height: "auto" }}>
          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
          >
            <Box
              component="img"
              src={listing.imageUrl}
              alt="Listing"
              sx={{
                width: { xs: "100%", sm: "70%" },
                objectFit: "cover",
                height: { xs: 300, sm: 400 },
                mb: { xs: 2, sm: 0 },
              }}
            />
            <Box
              sx={{
                width: { xs: "100%", sm: "30%" },
                height: "auto",
                ml: { xs: 0, sm: 2 },
              }}
            >
              <ReservationBox
                pricePerNight={listing.roomRate}
                capacity={listing.capacity}
                fees={listing.fees}
                fullyBookedNights={fullyBookedNights}
                onReserve={handleReserve}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingBottom: 2,
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
            {listing.attributes?.length > 0 && (
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  lineHeight: 1.5,
                  fontSize: { xs: "12px", sm: "15px" },
                }}
              >
                {listing.attributes?.join(" - ")}
              </Typography>
            )}
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
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              pt: 2,
              pb: 2,
              borderBottom: "1px solid #5C5C5C",
            }}
          >
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: "#E0824F",
                fontSize: "1.5rem",
              }}
            >
              {hostInitials}
            </Avatar>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                ml: 2,
                justifyContent: "center",
                alignItems: "flex-start",
                height: 70,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  lineHeight: 1,
                  fontSize: "20px",
                }}
              >
                {hostName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.5,
                  fontSize: "16px",
                }}
              >
                {host?.location?.address
                  ? `Situated in ${host.location.address}`
                  : "Address not available"}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: 2,
              borderBottom: "1px solid #5C5C5C",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", sm: "30%" },
                height: { xs: "auto", sm: 400 },
                borderRight: { xs: "none", sm: "1px solid #5C5C5C" },
                borderBottom: { xs: "1px solid #5C5C5C", sm: "none" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: { xs: 3, sm: 0 },
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  height: "90%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "14px", sm: "16px" },
                    textAlign: "center",
                  }}
                >
                  {listing.listingDescription}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                width: { xs: "100%", sm: "70%" },
                height: { xs: "auto", sm: 400 },
                padding: { xs: 3, sm: 0 },

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "90%",
                  height: "90%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                    width: "100%",
                  }}
                >
                  {reviews.slice(0, 4).map((r) => (
                    <ReviewCard
                      key={r.id}
                      {...r}
                      clamp
                      onClick={() => setReviewsOpen(true)}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", mb: 7 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mt: 0.5,
                  lineHeight: 1,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                Where you'll be
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: "bold" }}
              >
                {listing.location.address}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {listing.location.locInfo}
              </Typography>
            </Box>

            <Box
              className="map-container"
              sx={{
                width: "100%",
                objectFit: "cover",
                height: { xs: 300, sm: 500 },
                mb: { xs: 2, sm: 0 },
                backgroundColor: "#442b2b",
                mt: 2,
              }}
            >
              <ListingMap lat={latitude} lng={longitude} />
            </Box>
          </Box>
        </Box>
      </Box>
      <ReviewDialog
        open={reviewsOpen}
        onClose={() => setReviewsOpen(false)}
        reviews={reviews}
      />
    </Box>
  );
};
