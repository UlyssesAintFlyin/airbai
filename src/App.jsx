import { useState } from "react";
import LoginDialog from "./components/LoginDialog";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import "./App.css";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ListingMasterlistAdmin } from "./pages/ListingMasterlistAdmin";
import { UsersListAdmin } from "./pages/UsersListAdmin";
import { ViewListingAdmin } from "./pages/ViewListingAdmin";
import { SpecificListing } from "./pages/SpecificListing";
import { PaymentListing } from "./pages/PaymentListing";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./context/AdminRoute";
import HostRoute from "./context/HostRoute";
import { Profile } from "./pages/Profile";
import { ListingMasterlistHost } from "./pages/ListingMasterlistHost";
import { ViewListingHost } from "./pages/ViewListingHost";
import { AddListing } from "./pages/AddListing";
import { EditListing } from "./pages/EditListing";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LayoutWithHeader />}>
              <Route index element={<Home />} />
              <Route path="listing/:id" element={<SpecificListing />} />
              <Route path="payment/:id" element={<PaymentListing />} />
              <Route path="profile" element={<Profile />} />
              <Route
                path="admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/listings"
                element={
                  <AdminRoute>
                    <ListingMasterlistAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <AdminRoute>
                    <UsersListAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="admin/listings/:id"
                element={
                  <AdminRoute>
                    <ViewListingAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="listingMasterlist"
                element={
                  <HostRoute>
                    <ListingMasterlistHost />
                  </HostRoute>
                }
              />
              <Route
                path="listingMasterlist/:id"
                element={
                  <HostRoute>
                    <ViewListingHost />
                  </HostRoute>
                }
              />
              <Route
                path="listingMasterlist/addListing"
                element={
                  <HostRoute>
                    <AddListing />
                  </HostRoute>
                }
              />
              <Route
                path="listingMasterlist/EditListing/:id"
                element={
                  <HostRoute>
                    <EditListing />
                  </HostRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

function LayoutWithHeader() {
  const [openLogin, setOpenLogin] = useState(false);
  const openLoginDialog = () => setOpenLogin(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  return (
    <>
      <Header onOpenLogin={openLoginDialog} showSnackbar={showSnackbar} />

      <main>
        <Outlet
          context={{
            openLogin: openLoginDialog,
            showSnackbar,
          }}
        />
      </main>

      <LoginDialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        showSnackbar={showSnackbar}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
