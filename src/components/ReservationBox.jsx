import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { DayPicker } from "react-day-picker";
import { differenceInCalendarDays, format } from "date-fns";
import "react-day-picker/style.css";

const GuestRow = ({ label, sub, value, min = 0, onChange, disableAdd }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1.5,
      borderBottom: "1px solid #eee",
    }}
  >
    <Box>
      <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>{label}</Typography>
      <Typography sx={{ fontSize: 12, color: "#6b6b6b" }}>{sub}</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <IconButton
        size="small"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        sx={{ border: "1px solid #bbb" }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography sx={{ width: 16, textAlign: "center", fontSize: 14 }}>
        {value}
      </Typography>
      <IconButton
        size="small"
        disabled={disableAdd}
        onClick={() => onChange(value + 1)}
        sx={{ border: "1px solid #bbb" }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  </Box>
);

export const ReservationBox = ({
  pricePerNight = 2700,
  maxGuests = 4,
  onReserve,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [range, setRange] = useState(undefined); // { from, to }
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const [dateAnchor, setDateAnchor] = useState(null);
  const [guestAnchor, setGuestAnchor] = useState(null);

  const nights =
    range?.from && range?.to
      ? differenceInCalendarDays(range.to, range.from)
      : 0;
  const total = nights * pricePerNight;
  const guestCount = guests.adults + guests.children;
  const guestsFull = guestCount >= maxGuests;

  const fmt = (d) => (d ? format(d, "MM/dd/yy") : "Add date");
  const setGuest = (key) => (val) => setGuests((g) => ({ ...g, [key]: val }));

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 4,
        backgroundColor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Price */}
      <Box sx={{ display: "flex", mt:1}}>
        <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
        {nights > 0
          ? `₱${total.toLocaleString()}`
          : `₱${pricePerNight.toLocaleString()}`}
        <Typography
          component="span"
          sx={{ fontSize: 11, ml: 1, color: "#6b6b6b" }}
        >
          {nights > 0 ? `For ${nights} Nights` : "per night"}
        </Typography>
      </Typography>
      </Box>

      {/* Check-in / Check-out */}
      <Box
        sx={{
          mt: 3,
          border: "1px solid #5C5C5C",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Box
          onClick={(e) => setDateAnchor(e.currentTarget.parentElement)}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            cursor: "pointer",
          }}
        >
          <Box sx={{ p: 1, borderRight: "1px solid #5C5C5C" }}>
            <Typography sx={{ fontSize: 9, fontWeight: "bold" }}>
              CHECK-IN
            </Typography>
            <Typography sx={{ fontSize: 13 }}>{fmt(range?.from)}</Typography>
          </Box>
          <Box sx={{ p: 1 }}>
            <Typography sx={{ fontSize: 9, fontWeight: "bold" }}>
              CHECK-OUT
            </Typography>
            <Typography sx={{ fontSize: 13 }}>{fmt(range?.to)}</Typography>
          </Box>
        </Box>

        {/* Guests */}
        <Box
          onClick={(e) => setGuestAnchor(e.currentTarget)}
          sx={{
            p: 1,
            borderTop: "1px solid #5C5C5C",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 9, fontWeight: "bold" }}>
              GUESTS
            </Typography>
            <Typography sx={{ fontSize: 13 }}>
              {guestCount} guest{guestCount > 1 ? "s" : ""}
              {guests.infants > 0 &&
                `, ${guests.infants} infant${guests.infants > 1 ? "s" : ""}`}
              {guests.pets > 0 &&
                `, ${guests.pets} pet${guests.pets > 1 ? "s" : ""}`}
            </Typography>
          </Box>
          <KeyboardArrowDownIcon />
        </Box>
      </Box>

      <Button
        fullWidth
        disabled={nights < 1}
        onClick={() =>
          onReserve?.({
            checkIn: range.from,
            checkOut: range.to,
            guests,
            nights,
            total,
          })
        }
        sx={{
          mt: "auto",
          backgroundColor: "#E0824F",
          color: "#fff",
          textTransform: "none",
          borderRadius: 1,
          "&:hover": {
            backgroundColor: "#d9743f",
          },
          "&.Mui-disabled": {
            backgroundColor: "#e8c4ae",
            color: "#fff",
          },
        }}
      >
        Reserve
      </Button>

      {/* Calendar popover */}
      <Popover
        open={Boolean(dateAnchor)}
        anchorEl={dateAnchor}
        onClose={() => setDateAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { p: 3, borderRadius: 3, mt: 1 } } }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: "bold" }}>
          {nights > 0
            ? `${nights} night${nights > 1 ? "s" : ""}`
            : "Select dates"}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#6b6b6b", mb: 1 }}>
          {range?.from && range?.to
            ? `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`
            : "Pick a check-in and check-out date"}
        </Typography>

        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={isMobile ? 1 : 2}
          disabled={{ before: new Date() }}
          style={{
            "--rdp-accent-color": "#101010",
            "--rdp-accent-background-color": "#efefef",
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            mt: 1,
          }}
        >
          <Button
            onClick={() => setRange(undefined)}
            sx={{
              textTransform: "none",
              color: "#101010",
              textDecoration: "underline",
            }}
          >
            Clear Dates
          </Button>
          <Button
            onClick={() => setDateAnchor(null)}
            sx={{
              textTransform: "none",
              backgroundColor: "#000",
              color: "#fff",
              px: 3,
              "&:hover": { backgroundColor: "#222" },
            }}
          >
            Close
          </Button>
        </Box>
      </Popover>

      {/* Guests popover */}
      <Popover
        open={Boolean(guestAnchor)}
        anchorEl={guestAnchor}
        onClose={() => setGuestAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              width: guestAnchor?.offsetWidth,
              p: 2,
              mt: 0.5,
              borderRadius: 2,
            },
          },
        }}
      >
        <GuestRow
          label="Adults"
          sub="Age 13+"
          min={1}
          value={guests.adults}
          onChange={setGuest("adults")}
          disableAdd={guestsFull}
        />
        <GuestRow
          label="Children"
          sub="Ages 2-12"
          value={guests.children}
          onChange={setGuest("children")}
          disableAdd={guestsFull}
        />
        <GuestRow
          label="Infants"
          sub="Under 2"
          value={guests.infants}
          onChange={setGuest("infants")}
          disableAdd={guests.infants >= 5}
        />
        <GuestRow
          label="Pets"
          sub="Service animals count too"
          value={guests.pets}
          onChange={setGuest("pets")}
          disableAdd={guests.pets >= 5}
        />
      </Popover>
    </Box>
  );
};
