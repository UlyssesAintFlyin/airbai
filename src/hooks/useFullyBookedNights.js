import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { addDays, format, startOfDay } from "date-fns";
import { db } from "../firebase";

export const useFullyBookedNights = (listingId, roomCount) => {
  const [fullNights, setFullNights] = useState(new Set());

  useEffect(() => {
    if (!listingId || !roomCount) return;

    const load = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "bookings"), where("listingID", "==", listingId))
        );

        const counts = {};
        snap.docs.forEach((d) => {
          const { checkIn, checkOut } = d.data().duration ?? {};
          if (!checkIn || !checkOut) return;

          // a stay occupies each night from check-in up to (not including) check-out
          const end = startOfDay(checkOut.toDate());
          for (let day = startOfDay(checkIn.toDate()); day < end; day = addDays(day, 1)) {
            const key = format(day, "yyyy-MM-dd");
            counts[key] = (counts[key] ?? 0) + 1;
          }
        });

        setFullNights(
          new Set(Object.keys(counts).filter((k) => counts[k] >= roomCount))
        );
      } catch (err) {
        console.error("Failed to load bookings:", err);
      }
    };

    load();
  }, [listingId, roomCount]);

  return fullNights;
};