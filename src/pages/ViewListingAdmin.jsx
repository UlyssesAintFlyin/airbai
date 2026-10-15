import React, { useState } from "react";
import { Box, Grid, IconButton, Avatar, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Dashcard } from "../components/Dashcard";

export const ViewListingAdmin = () => {
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
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            width: "90%",
            pt: 2,
            pb: 2,
            margin: "0 auto",
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
                fontSize: "16px",
              }}
            >
              Situated in Cebu
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: "90%",
            height:{xs: "700px", sm:"200px"},
            pt: 4,
            pb: 2,
            margin: "0 auto",
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
      </Box>
    </Box>
  );
};
