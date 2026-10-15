import { Box, Typography } from "@mui/material";

const Row = ({ label, value, bold }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: bold ? "bold" : "normal", mb: 0.5 }}>
    <span>{label}</span>
    <span>{value}</span>
  </Box>
);

const peso = (n) => `₱${n.toLocaleString()}`;

export const BookingSummary = ({ listing, booking }) => {
  const { nights, checkIn, checkOut, guests } = booking;
  const fees = { cleaning: 500, service: 300, taxes: 200 };
  const base = nights * listing.pricePerNight;
  const total = base + fees.cleaning + fees.service + fees.taxes;

  return (
    <Box sx={{ p: 2, borderRadius: 2, boxShadow: 4, backgroundColor: "#fff" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box
          component="img"
          src={listing.image}
          alt={listing.title}
          sx={{ width: 100, height: 100, borderRadius: 2, objectFit: "cover" }}
        />
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>{listing.title}</Typography>
          <Typography sx={{ fontSize: 11 }}>★ 5.0 (6)</Typography>
        </Box>
      </Box>

      <Box sx={{ borderTop: "1px solid #aaa", py: 1 }}>
        <Typography sx={{ fontSize: 11, fontWeight: "bold" }}>Dates</Typography>
        <Typography sx={{ fontSize: 11 }}>
          {checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}
        </Typography>
        <Typography sx={{ fontSize: 11, fontWeight: "bold", mt: 1 }}>Guest</Typography>
        <Typography sx={{ fontSize: 11 }}>{guests.adults + guests.children} Guest</Typography>
      </Box>

      <Box sx={{ borderTop: "1px solid #aaa", py: 1 }}>
        <Typography sx={{ fontSize: 11, fontWeight: "bold", mb: 0.5 }}>Price details</Typography>
        <Row label={`${nights} nights x ${peso(listing.pricePerNight)}`} value={peso(base)} />
        <Row label="+ Cleaning fee" value={peso(fees.cleaning)} />
        <Row label="+ Service fee" value={peso(fees.service)} />
        <Row label="+ Taxes" value={peso(fees.taxes)} />
      </Box>

      <Box sx={{ borderTop: "1px solid #aaa", pt: 1 }}>
        <Row label="Total" value={peso(total)} bold />
      </Box>
    </Box>
  );
};