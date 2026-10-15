import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export const StepPanel = ({ number, title, active, done, action, onEdit, children }) => (
  <Box
    onClick={done ? onEdit : undefined}
    sx={{
      p: 2,
      borderRadius: 2,
      backgroundColor: "#fff",
      border: active ? "1px solid transparent" : "1px solid #d4d4d4",
      boxShadow: active ? 4 : 0,
      cursor: done ? "pointer" : "default",
      transition: "box-shadow 0.3s ease",
    }}
  >
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Typography sx={{ fontSize: 14, fontWeight: active ? "bold" : "normal" }}>
        {number}. {title}
      </Typography>
      {done && <CheckCircleIcon sx={{ fontSize: 18, color: "#E0824F" }} />}
      {active && action}
    </Box>

    {active && children && <Box sx={{ mt: 2 }}>{children}</Box>}
  </Box>
);