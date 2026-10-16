import { Box, Typography } from "@mui/material";
import { format } from "date-fns";
import { computeBreakdown } from "../utils/pricing";

const Row = ({ label, value, bold }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      fontWeight: bold ? "bold" : "normal",
      mb: 0.5,
    }}
  >
    <span>{label}</span>
    <span>{value}</span>
  </Box>
);

const peso = (n) => `₱${n.toLocaleString()}`;

export const BookingSummary = ({ listing, booking }) => {
  const { nights, checkIn, checkOut, guests } = booking;
  const b = computeBreakdown({
    roomRate: listing.roomRate,
    fees: listing.fees,
    nights,
    guests,
  });

  const guestParts = [
    `${guests.adults + guests.children} guest${guests.adults + guests.children > 1 ? "s" : ""}`,
    guests.infants > 0 && `${guests.infants} infant${guests.infants > 1 ? "s" : ""}`,
    guests.pets > 0 && `${guests.pets} pet${guests.pets > 1 ? "s" : ""}`,
  ].filter(Boolean);

  return (
    <Box sx={{ p: 2, borderRadius: 2, boxShadow: 4, backgroundColor: "#fff" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box
          component="img"
          src={listing.imageUrl}
          alt={listing.name}
          sx={{ width: 100, height: 100, borderRadius: 2, objectFit: "cover" }}
        />
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
            {listing.name}
          </Typography>
          <Typography sx={{ fontSize: 11 }}>
            {listing.reviewCount > 0
              ? `★ ${listing.avgRating} (${listing.reviewCount})`
              : "New"}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ borderTop: "1px solid #aaa", py: 1 }}>
        <Typography sx={{ fontSize: 11, fontWeight: "bold" }}>Dates</Typography>
        <Typography sx={{ fontSize: 11 }}>
          {format(checkIn, "MMM d, yyyy")} - {format(checkOut, "MMM d, yyyy")}
        </Typography>
        <Typography sx={{ fontSize: 11, fontWeight: "bold", mt: 1 }}>
          Guests
        </Typography>
        <Typography sx={{ fontSize: 11 }}>{guestParts.join(", ")}</Typography>
      </Box>

      <Box sx={{ borderTop: "1px solid #aaa", py: 1 }}>
        <Typography sx={{ fontSize: 11, fontWeight: "bold", mb: 0.5 }}>
          Price details
        </Typography>
        <Row
          label={`${nights} night${nights > 1 ? "s" : ""} x ${peso(listing.roomRate)}`}
          value={peso(b.roomTotal)}
        />
        <Row label="+ Cleaning fee" value={peso(b.cleaningFee)} />
        <Row label="+ Service fee" value={peso(b.serviceFee)} />
        {b.petFee > 0 && <Row label="+ Pet fee" value={peso(b.petFee)} />}
        {b.childDiscount > 0 && (
          <Row label="- Child discount" value={`-${peso(b.childDiscount)}`} />
        )}
        <Row label={`+ Tax (${listing.fees?.tax ?? 0}%)`} value={peso(b.tax)} />
      </Box>

      <Box sx={{ borderTop: "1px solid #aaa", pt: 1 }}>
        <Row label="Total" value={peso(b.total)} bold />
      </Box>
    </Box>
  );
};