// pages/BookingSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { db } from "../firebase";

export const BookingSuccess = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("pending");
  const sessionId = params.get("session_id");

  useEffect(() => {
  if (!sessionId) return;
  return onSnapshot(doc(db, "bookings", sessionId), (snap) => {
    if (snap.exists()) setStatus(snap.data().status);
  });
}, [sessionId]);

  return (
    <Box sx={{ m: 4, textAlign: "center" }}>
      {status === "paid" ? (
        <>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Booking confirmed!
          </Typography>
          <Button component={Link} to="/" variant="contained">Back to home</Button>
        </>
      ) : (
        <>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Confirming your payment...</Typography>
        </>
      )}
    </Box>
  );
};