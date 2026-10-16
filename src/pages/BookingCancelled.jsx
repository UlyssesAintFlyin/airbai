import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export const BookingCancelled = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ m: 4, textAlign: "center" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        Payment cancelled
      </Typography>
      <Typography sx={{ mb: 3 }}>
        You weren't charged and no booking was made.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={() => navigate(-2)}>
          Try again
        </Button>
        <Button component={Link} to="/" variant="outlined">
          Back to home
        </Button>
      </Box>
    </Box>
  );
};