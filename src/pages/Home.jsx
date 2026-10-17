import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { RoomCard } from "../components/RoomCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useOutletContext } from "react-router-dom";

export const Home = () => {
  const { searchQuery } = useOutletContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const q = query(
          collection(db, "listings"),
          where("status", "==", "approved")
        );

        const snapshot = await getDocs(q);

        const roomData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRooms(roomData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return rooms;

    return rooms.filter((room) => {
      const loc = room.location 
      const haystack = [
        room.name,
        room.listingDescription,
        loc?.address,
        loc?.locInfo,
        ...(room.attributes ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [rooms, searchQuery]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: 4,
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
        Available Listings.
      </Typography>

      {!loading && filteredRooms.length === 0 && (
        <Typography color="text.secondary">
          {searchQuery
            ? `No listings match "${searchQuery}".`
            : "No listings available yet."}
        </Typography>
      )}


      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(auto-fill, minmax(180px, 1fr))",
          },
          mb: 5,
        }}
      >
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            id={room.id}
            title={room.name}
            image={room.imageUrl}
            description={`₱${room.roomRate}/night`}
            to={`/listing/${room.id}`}
          />
        ))}
      </Box>
    </Box>
  );
};
