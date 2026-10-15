import React, { useState } from "react";
import { Button, Box, Typography, IconButton, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ReservationBox } from "../components/ReservationBox";
import { ReviewCard } from "../components/ReviewCard";
import { ReviewDialog } from "../components/ReviewDialog";
import { ListingMap } from "../components/ListingMap";


const reviews = [
  {
    id: 1,
    name: "Jonathan Cruz",
    date: "1 week ago",
    rating: 5,
    review: "Amazing stay, the place was so nice... very recommendable...",
  },
  {
    id: 2,
    name: "Maria Santos",
    date: "2 weeks ago",
    rating: 5,
    review:
      "Super close to IT Park, spotless and the view from the 15th floor is great.",
  },
  {
    id: 3,
    name: "Alex Reyes",
    date: "3 weeks ago",
    rating: 4,
    review: "Great location and host was very responsive. Check-in was easy.",
  },
  {
    id: 4,
    name: "Kim Lee",
    date: "1 month ago",
    rating: 5,
    review: "Perfect for a business trip. Fast wifi and comfortable bed.",
  },
  {
    id: 5,
    name: "Paolo Garcia",
    date: "1 month ago",
    rating: 5,
    review: "Would definitely stay again!",
  },
  {
    id: 6,
    name: "Anna Lim",
    date: "2 months ago",
    rating: 5,
    review: "Clean, cozy, and exactly like the photos.",
  },
];

export const SpecificListing = () => {
  const [reviewsOpen, setReviewsOpen] = useState(false);
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
          Viewing Listing Details
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
              src="/resources/room1.png"
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
                pricePerNight={2700}
                maxGuests={4}
                onReserve={(booking) => console.log(booking)}
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
              Listing description goes here. This is a placeholder for the
              actual listing details.
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
              5.0 -{" "}
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
              IM
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
                Ivan M.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.5,
                  fontSize:  "16px",
                }}
              >
                Situated in Cebu
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
                  Located at the 15th floor of The Median Condominium. Just a
                  few minutes walk to Cebu IT Park and Waterfront Hotel. Whether
                  you're here for business or leisure, solo or with a partner,
                  this condo is your perfect base in the city.
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
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
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
                Cebu City, Cebu, Philippines
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                A historic trade port with quick access to scuba diving, the
                city also stays lively after dark with karaoke nights in local
                bars.
              </Typography>
            </Box>

            <Box className="map-container"
              sx={{
                width: "100%",
                objectFit: "cover",
                height: { xs: 300, sm: 500 },
                mb: { xs: 2, sm: 0 },
                backgroundColor: "#442b2b",
                mt: 2,
              }}
            >
              <ListingMap lat={10.327} lng={123.906} />
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
