import { useEffect, useState } from "react";
import { doc, getDoc, getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const timeAgo = (ts) => {
  if (!ts) return "";
  const seconds = (Date.now() - ts.toDate().getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units = [
    ["year", 31536000], ["month", 2592000], ["week", 604800],
    ["day", 86400], ["hour", 3600], ["minute", 60],
  ];
  for (const [unit, secs] of units) {
    if (seconds >= secs) return rtf.format(-Math.floor(seconds / secs), unit);
  }
  return "just now";
};

export const useListing = (listingId) => {
  const [state, setState] = useState({
    listing: null, host: null, reviews: [], loading: true, error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const listingSnap = await getDoc(doc(db, "listings", listingId));
        if (!listingSnap.exists()) throw new Error("Listing not found");
        const listing = { id: listingSnap.id, ...listingSnap.data() };

        const [hostSnap, reviewsSnap] = await Promise.all([
          getDoc(doc(db, "users", listing.hostID)),
          getDocs(
            query(collection(db, "reviews"), where("listingID", "==", listingId))
          )
        ]);

        // Look up each reviewer once
        const rawReviews = reviewsSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        const userIds = [...new Set(rawReviews.map((r) => r.usersID))];
        const userSnaps = await Promise.all(
          userIds.map((id) => getDoc(doc(db, "users", id)))
        );
        const usersById = Object.fromEntries(
          userSnaps.filter((s) => s.exists()).map((s) => [s.id, s.data()])
        );

        const reviews = rawReviews.map((r) => {
          const u = usersById[r.usersID];
          return {
            id: r.id,
            name: u?.name ? `${u.name.fName} ${u.name.lName}` : "Guest",
            date: timeAgo(r.createdAt),
            rating: Number(r.rating ?? r.Rating) || 0,   
            review: r.comment,
          };
        });

        if (!cancelled) {
          setState({
            listing,
            host: hostSnap.exists() ? hostSnap.data() : null,
            reviews,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }));
      }
    };

    load();
    return () => { cancelled = true; };
  }, [listingId]);

  return state;
};