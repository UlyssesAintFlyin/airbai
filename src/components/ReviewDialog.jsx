import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReviewCard } from "./ReviewCard";

export const ReviewDialog = ({ open, onClose, reviews }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
    scroll="paper" 
  >
    <DialogTitle
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold" }}
    >
      Reviews ({reviews.length})
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>

    <DialogContent dividers sx={{ maxHeight: "70vh" }}>
      {reviews.map((r, i) => (
        <Box key={r.id ?? i}>
          <Box sx={{ py: 2 }}>
            <ReviewCard {...r} />
          </Box>
          {i < reviews.length - 1 && <Divider />}
        </Box>
      ))}
    </DialogContent>
  </Dialog>
);