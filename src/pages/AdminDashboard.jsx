import React, { useState } from "react";
import {
  Box,
  Container,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from 'react-router-dom';

const FONT = "'Plus Jakarta Sans', sans-serif";

const initialDashboardData = {
  revenue: {
    amount: 45000,
    currency: "P",
    month: "january",
  },
  userCount: 304,
  totalListings: 600,
  totalBookings: 200,
};

const containerSx = {
  pt: "36px",
  pb: "64px",
};

const cardsWrapperSx = {
  pt: 4,
  pb: 4,
  display: "flex",
  flexDirection: "column",
  gap: "28px",
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, // 900px breakpoint
  gap: "28px",
};

const statCardSx = (isBanner) => ({
  background: "linear-gradient(135deg, #46231c 0%, #381b15 50%, #5a312a 100%)",
  borderRadius: "12px",
  color: "#ffffff",
  boxShadow:
    "0 8px 20px -2px rgba(35, 15, 10, 0.28), 0 3px 6px -2px rgba(0, 0, 0, 0.15)",
  transition: "transform 0.22s ease, box-shadow 0.22s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: isBanner ? "center" : "flex-start",
  minHeight: isBanner ? 140 : 190,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      "0 12px 24px -2px rgba(35, 15, 10, 0.35), 0 4px 8px -2px rgba(0, 0, 0, 0.2)",
  },
});

const statCardContentSx = (isBanner) => ({
  p: isBanner ? "32px" : "28px",
  // MUI adds extra bottom padding on the last child; this keeps it even
  "&:last-child": { pb: isBanner ? "32px" : "28px" },
});

const statCardTitleSx = (isBanner) => ({
  fontFamily: FONT,
  fontWeight: 700,
  color: "#ffffff",
  letterSpacing: "0.2px",
  mb: "12px",
  fontSize: isBanner ? 26 : 22,
});

const statCardSubtitleSx = (isBanner) => ({
  fontFamily: FONT,
  fontWeight: 400,
  color: "#f5ebe6",
  opacity: 0.95,
  lineHeight: 1.5,
  whiteSpace: "pre-line",
  fontSize: isBanner ? 18 : 16,
});

export function StatCard({ title, children, isBanner = false }) {
  return (
    <Card elevation={0} sx={statCardSx(isBanner)}>
      <CardContent sx={statCardContentSx(isBanner)}>
        <Typography variant="h5" component="h2" sx={statCardTitleSx(isBanner)}>
          {title}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}

// Small helper so the subtitle style isn't repeated on every card
function StatSubtitle({ isBanner = false, children }) {
  return (
    <Typography variant="body1" sx={statCardSubtitleSx(isBanner)}>
      {children}
    </Typography>
  );
}

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardData] = useState(initialDashboardData);

  return (
    <Box
      sx={{
        display: "flex",
        pt: 4,
        width: "90%",
        flexDirection: "column",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          mb: "14px",
          pb: 2,
          borderBottom: "1px solid #5C5C5C",
        }}
      >
        <Button
          id="tab-dashboard"
          disableElevation
          component={ Link } 
          to="/admin" 
          sx={{
            bgcolor: "#df7b4c",
            color: "#ffffff",
            border: "none",
            boxShadow: "0 2px 4px rgba(223, 123, 76, 0.25)",
            "&:hover": {
              bgcolor: "#d06e3f",
              boxShadow: "0 4px 8px rgba(223, 123, 76, 0.35)",
            },
          }}
        >
          Dashboard
        </Button>

        <Button
          id="tab-listings"
          disableElevation
          component={ Link } 
          to="/admin/listings" 
          sx={{
            bgcolor: "#ffffff",
            color: "#df7b4c",
            border: "1px solid #e8dbd4",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            "&:hover": {
              bgcolor: "#fef8f5",
              borderColor: "#df7b4c",
            },
          }}
        >
          Listings
        </Button>
        <Button
          id="tab-listings"
          disableElevation
          component={ Link } 
          to="/admin/users" 
          sx={{
            bgcolor: "#ffffff",
            color: "#df7b4c",
            border: "1px solid #e8dbd4",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
            "&:hover": {
              bgcolor: "#fef8f5",
              borderColor: "#df7b4c",
            },
          }}
        >
          users
        </Button>
      </Box>

      {/* Cards */}
      <Box sx={cardsWrapperSx}>
        {/* Total Revenue */}
        <StatCard title="Total Revenue" isBanner>
          <StatSubtitle isBanner>
            {dashboardData.revenue.currency}{" "}
            {dashboardData.revenue.amount.toLocaleString()} for this month of{" "}
            {dashboardData.revenue.month}
          </StatSubtitle>
        </StatCard>

        {/* 3 grid cards */}
        <Box sx={gridSx}>
          <StatCard title="User Count">
            <StatSubtitle>
              Airbai has a total of
              <br />
              {dashboardData.userCount} Users
            </StatSubtitle>
          </StatCard>

          <StatCard title="Total Listing">
            <StatSubtitle>
              There are over {dashboardData.totalListings} listings
            </StatSubtitle>
          </StatCard>

          <StatCard title="Total Booking">
            <StatSubtitle>
              There are over {dashboardData.totalBookings} bookings
            </StatSubtitle>
          </StatCard>
        </Box>
      </Box>
    </Box>
  );
};
