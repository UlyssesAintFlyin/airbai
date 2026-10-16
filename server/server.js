import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { computeBreakdown } from "./pricing.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.use(cors({ origin: process.env.CLIENT_URL }));

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Signature failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        try {
          const m = session.metadata;
          await db.doc(`bookings/${session.id}`).set({
            createdAt: Timestamp.now(),
            duration: {
              checkIn: Timestamp.fromDate(new Date(m.checkIn)),
              checkOut: Timestamp.fromDate(new Date(m.checkOut)),
            },
            guest: {
              adults: Number(m.adults),
              children: Number(m.children),
              infant: Number(m.infant),
              pets: Number(m.pets),
            },
            listingID: m.listingId,
            payment: Number(m.total),
            usersID: m.userId,
            status: "paid",
            paymentIntentId: session.payment_intent,
          });
        } catch (err) {
          console.error("Failed to save booking:", err);
          return res.status(500).send("Failed to save booking");
        }
      }
    }
    res.json({ received: true });
  }
);

app.use(express.json());

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { listingId, userId, checkIn, checkOut, guests } = req.body;
    if (!listingId || !userId) return res.status(400).json({ error: "Missing data" });

    const listingSnap = await db.doc(`listings/${listingId}`).get();
    if (!listingSnap.exists) return res.status(404).json({ error: "Listing not found" });
    const listing = listingSnap.data();

    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    const nights = Math.ceil((co - ci) / 86400000);
    if (!(nights >= 1)) return res.status(400).json({ error: "Invalid dates" });

    const safeGuests = {
      adults: guests?.adults ?? 0,
      children: guests?.children ?? 0,
      infant: guests?.infant ?? guests?.infants ?? 0,
      pets: guests?.pets ?? 0,
    };

    const { total } = computeBreakdown({
      roomRate: listing.roomRate,
      fees: listing.fees,
      nights,
      guests: safeGuests,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "php",
          product_data: { name: listing.title ?? "Booking" },
          unit_amount: Math.round(total * 100),
        },
        quantity: 1,
      }],
      // metadata values must be strings
      metadata: {
        listingId,
        userId,
        checkIn: ci.toISOString(),
        checkOut: co.toISOString(),
        adults: String(safeGuests.adults),
        children: String(safeGuests.children),
        infant: String(safeGuests.infant),
        pets: String(safeGuests.pets),
        total: String(total),
      },
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking/cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create checkout session" });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server on :${process.env.PORT} from ${fileURLToPath(import.meta.url)}`)
);