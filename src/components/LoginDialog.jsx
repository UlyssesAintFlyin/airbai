import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { signUp, logIn, resetPassword } from "../services/auth";

const errorMessage = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    default:
      return "Something went wrong. Try again.";
  }
};

export default function LoginDialog({
  open,
  onClose,
  onSuccess,
  showSnackbar,
}) {
  const { setUser } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isSignup = mode === "signup";

  const handleClose = () => {
    setMode("login");
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
    setInfo("");
    onClose();
  };

  const canSubmit =
    isValidEmail(email) &&
    password.length >= 6 &&
    (!isSignup || password === confirm) &&
    !loading;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const user = isSignup
        ? await signUp(email, password)
        : await logIn(email, password);
      setUser(user);
      showSnackbar(
        isSignup ? "Account created successfully!" : "Logged in successfully!",
        "success",
      );
      onSuccess?.(user);
      handleClose();
    } catch (e) {
      console.error(e.code, e.message);
      setError(errorMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!isValidEmail(email)) {
      setError("Enter your email first.");
      return;
    }
    try {
      await resetPassword(email);
      setError("");
      setInfo("If that email has an account, a reset link is on its way.");
    } catch {
      setError("Could not send reset email. Try again.");
    }
  };

  const buttonSx = { bgcolor: "#E0824F", "&:hover": { bgcolor: "#d9743f" } };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            component="img"
            src="/resources/signInLogo.png"
            sx={{ width: 200 }}
          />

          <Typography variant="h5" fontWeight="bold">
            {isSignup ? "Create an account" : "Log in"}
          </Typography>

          <TextField
            fullWidth
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email.length > 0 && !isValidEmail(email)}
            helperText={
              email.length > 0 && !isValidEmail(email)
                ? "Please enter a valid email address."
                : ""
            }
          />

          <TextField
            fullWidth
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? "new-password" : "current-password"}
            onKeyDown={(e) =>
              e.key === "Enter" && !isSignup && canSubmit && handleSubmit()
            }
          />

          {isSignup && (
            <TextField
              fullWidth
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              error={confirm.length > 0 && confirm !== password}
              helperText={
                confirm.length > 0 && confirm !== password
                  ? "Passwords don't match."
                  : ""
              }
            />
          )}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          {info && (
            <Typography color="success.main" variant="body2">
              {info}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            sx={buttonSx}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {loading ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
          </Button>

          {!isSignup && (
            <Button
              size="small"
              onClick={handleReset}
              sx={{ textTransform: "none" }}
            >
              Forgot password?
            </Button>
          )}

          <Button
            size="small"
            sx={{ textTransform: "none" }}
            onClick={() => {
              setMode(isSignup ? "login" : "signup");
              setError("");
              setInfo("");
            }}
          >
            {isSignup
              ? "Already have an account? Log in"
              : "New here? Create an account"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
