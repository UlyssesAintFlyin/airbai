import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  IconButton,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RoomCard } from "../components/RoomCard";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { updateEmail } from "firebase/auth";
import Rating from "@mui/material/Rating";

export const Profile = () => {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setAddress(user.location?.address || "");
    }
  }, [user]);

  const [nameOpen, setNameOpen] = useState(false);

  const [nameForm, setNameForm] = useState({
    fName: "",
    mName: "",
    lName: "",
  });

  const handleEditName = () => {
    setNameForm({
      fName: user?.name?.fName || "",
      mName: user?.name?.mName || "",
      lName: user?.name?.lName || "",
    });

    setNameOpen(true);
  };

  const handleSaveName = async () => {
    try {
      await updateDoc(doc(db, "users", user.id), {
        name: {
          fName: nameForm.fName,
          mName: nameForm.mName,
          lName: nameForm.lName,
        },
        updatedAt: new Date(),
      });

      setNameOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveChanges = async () => {
    setError("");
    setSuccess("");
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!address.trim()) {
      setError("Location address is required.");
      return;
    }
    try {
      setSaving(true);
      await updateEmail(auth.currentUser, email);
      await updateDoc(doc(db, "users", user.id), {
        email,
        location: {
          address,
        },
        updatedAt: Timestamp.now(),
      });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case "permission-denied":
          setError("You do not have permission to update this profile.");
          break;
        case "unavailable":
          setError("Network is unavailable. Please try again later.");
          break;
        default:
          setError("Something went wrong while saving changes.");
      }
    } finally {
      setSaving(false);
    }
  };

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.id) return;

      try {
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("usersID", "==", user.id),
        );

        const bookingSnapshot = await getDocs(bookingsQuery);

        const combinedReservations = await Promise.all(
          bookingSnapshot.docs.map(async (bookingDoc) => {
            const booking = bookingDoc.data();

            const listingRef = doc(db, "listings", booking.listingID);

            const listingSnap = await getDoc(listingRef);

            if (!listingSnap.exists()) return null;

            const listing = listingSnap.data();

            return {
              bookingId: bookingDoc.id,

              ...booking,

              listingName: listing.name,
              imageUrl: listing.imageUrl,
              roomRate: listing.roomRate,
              address: listing.location?.address,
              description: listing.listingDescription,
            };
          }),
        );

        setReservations(combinedReservations.filter(Boolean));
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservations();
  }, [user]);

  const [reviewOpen, setReviewOpen] = useState(false);

  const [reviewId, setReviewId] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: "",
  });

  const [reviewLoading, setReviewLoading] = useState(false);

  const handleOpenReview = async (room) => {
    try {
      setSelectedRoom(room);

      const reviewId = `${room.listingID}_${user.id}`;

      const reviewRef = doc(db, "reviews", reviewId);

      const reviewSnap = await getDoc(reviewRef);

      if (reviewSnap.exists()) {
        const review = reviewSnap.data();

        setReviewId(reviewId);

        setReviewForm({
          rating: review.Rating || 0,
          comment: review.comment || "",
        });
      } else {
        setReviewId(reviewId);

        setReviewForm({
          rating: 0,
          comment: "",
        });
      }

      setReviewOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveReview = async () => {
    try {
      if (!reviewForm.rating) {
        alert("Please provide a rating.");
        return;
      }

      const reviewId = `${selectedRoom.listingID}_${user.id}`;

      await setDoc(
        doc(db, "reviews", reviewId),
        {
          Rating: reviewForm.rating,
          comment: reviewForm.comment,

          listingID: selectedRoom.listingID,
          usersID: user.id,

          updatedAt: Timestamp.now(),
        },
        { merge: true },
      );

      setReviewOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "30%" },
          height: { xs: "480px", sm: "100vh" },
          borderRight: { xs: "none", sm: "1px solid #5C5C5C" },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 2,
            width: "90%",
            alignItems: "center",
            mt: 2,
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
            My Profile
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "80%",
            boxShadow: "0px 4px 10px 5px rgba(0, 0, 0, 0.14)",
            borderRadius: 4,
            p: 2,
            mt: { xs: 0, sm: 2 },
          }}
        >
          <Avatar
            sx={{
              mt: { xs: 0, sm: 2 },
              width: { xs: 50, sm: 120 },
              height: { xs: 50, sm: 120 },
              bgcolor: "#E0824F",
              fontSize: { xs: "1.5rem", sm: "4rem" },
            }}
          >
            {user?.name?.fName?.charAt(0)}
            {user?.name?.lName?.charAt(0)}
          </Avatar>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", mt: { xs: 0, sm: 2 } }}
          >
            {user?.name?.lName} {user?.name?.fName}, {user?.name?.mName[0]}.
          </Typography>
          <Typography variant="h6" gutterBottom>
            {user?.role}
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "90%",
              gap: 3,
              flexDirection: "column",
              mt: { xs: 1, sm: 3 },
            }}
          >
            <TextField
              variant="outlined"
              label="Email Address"
              value={user?.email || ""}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              label="Location Address"
              value={user?.location?.address || ""}
              fullWidth
              onChange={(e) => setAddress(e.target.value)}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "90%",
              gap: { xs: 2, sm: 3 },
              flexDirection: "column",
              mt: { xs: 3, sm: 5 },
              mb: { xs: 1, sm: 3 },
            }}
          >
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            {success && (
              <Typography color="success.main" sx={{ mt: 1 }}>
                {success}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "#cb6933", "&:hover": { bgcolor: "#ed8e5b" } }}
              onClick={handleEditName}
            >
              Edit Name
            </Button>
            <Button
              fullWidth
              variant="contained"
              disabled={saving}
              onClick={handleSaveChanges}
              sx={{
                bgcolor: "#ab4e1c",
                "&:hover": { bgcolor: "#c86632" },
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", sm: "70%" },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            mb: 2,
            width: "90%",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              mb: 2,
              width: "90%",
              alignItems: "center",
              mt: { xs: 8, sm: 2 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                lineHeight: 1,
                fontSize: { xs: "1rem", sm: "1.5rem" },
              }}
            >
              My Reservations
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", width: "90%", justifyContent: "center" }}>
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gap: 5,
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(auto-fill, minmax(180px, 1fr))",
              },
              mb: 5,
            }}
          >
            {reservations.map((room) => (
              <RoomCard
                key={room.bookingId}
                title={room.listingName}
                image={room.imageUrl}
                description={`${room.address}
                  • ${room.status}
                  • ₱${room.payment}`}
                onClick={() => handleOpenReview(room)}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Dialog
        open={nameOpen}
        onClose={() => setNameOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Name</DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            value={nameForm.fName}
            onChange={(e) =>
              setNameForm((prev) => ({
                ...prev,
                fName: e.target.value,
              }))
            }
          />

          <TextField
            margin="dense"
            label="Middle Name"
            fullWidth
            value={nameForm.mName}
            onChange={(e) =>
              setNameForm((prev) => ({
                ...prev,
                mName: e.target.value,
              }))
            }
          />

          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={nameForm.lName}
            onChange={(e) =>
              setNameForm((prev) => ({
                ...prev,
                lName: e.target.value,
              }))
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setNameOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleSaveName}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Review {selectedRoom?.listingName}</DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Rating
              size="large"
              value={reviewForm.rating}
              onChange={(event, newValue) =>
                setReviewForm((prev) => ({
                  ...prev,
                  rating: newValue,
                }))
              }
            />
          </Box>

          <TextField
            margin="normal"
            label="Comment"
            multiline
            rows={4}
            fullWidth
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            disabled={reviewLoading}
            onClick={handleSaveReview}
          >
            {reviewId ? "Update Review" : "Submit Review"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
