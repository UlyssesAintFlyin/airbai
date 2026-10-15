import React, { useState } from "react";
import { Box, Typography, IconButton, Button, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { StepPanel } from "../components/StepPanel";
import { BookingSummary } from "../components/BookingSummary";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OrangeButton = (props) => (
  <Button
    size="small"
    {...props}
    sx={{
      backgroundColor: "#E0824F",
      color: "#fff",
      textTransform: "none",
      px: 2,
      "&:hover": { backgroundColor: "#d9743f" },
      "&.Mui-disabled": { backgroundColor: "#e8c4ae", color: "#fff" },
    }}
  />
);

export const PaymentListing = () => {
  const { openLogin } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [activeStep, setActiveStep] = useState(user ? 2 : 1);
  const [gcash, setGcash] = useState("");

  if (!state)
    return <Typography sx={{ m: 4 }}>No booking in progress.</Typography>;
  const { listing, booking } = state;

  const done = (n) => activeStep > n;
  const next = () => setActiveStep((s) => s + 1);

  const handleConfirm = async () => {
    // later: write to Firestore "bookings" here, then navigate to a success page
    console.log({ listing, booking, gcash });
  };

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
          Complete your Payment
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column-reverse", md: "row" },
          alignItems: { md: "flex-start" },
        }}
      >
        {/* LEFT: steps */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <StepPanel
            number={1}
            title="Login or sign up"
            active={activeStep === 1}
            done={done(1)}
            onEdit={() => setActiveStep(1)}
            action={<OrangeButton onClick={user ? () => setActiveStep(2) : openLogin}>Continue</OrangeButton>}
          />

          <StepPanel
            number={2}
            title="Add payment method"
            active={activeStep === 2}
            done={done(2)}
            onEdit={() => setActiveStep(2)}
          >
            <Typography sx={{ fontWeight: "bold", color: "#0a5cff", mb: 1 }}>
              GCash
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Gcash number..."
              value={gcash}
              onChange={(e) => setGcash(e.target.value)}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <OrangeButton disabled={gcash.length < 11} onClick={next}>
                Continue
              </OrangeButton>
            </Box>
          </StepPanel>

          <StepPanel
            number={3}
            title="Review your reservation"
            active={activeStep === 3}
            done={false}
            action={
              <OrangeButton onClick={handleConfirm}>Confirm</OrangeButton>
            }
          />
        </Box>

        {/* RIGHT: summary */}
        <Box sx={{ width: { xs: "100%", md: 320 } }}>
          <BookingSummary listing={listing} booking={booking} />
        </Box>
      </Box>
    </Box>
  );
};
