import React from "react";
import { Box } from "@mui/material";
import { Seat } from "../interfaces/theater";

interface SeatGridProps {
  rows: number;
  cols: number;
  seats: Seat[];
  selectedSeats: { id?: number; row: number; col: number }[];
  onSeatSelect: (seat: { id: number; row: number; col: number }) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({
  rows,
  cols,
  seats,
  selectedSeats,
  onSeatSelect,
}) => {
  const getSeat = (row: number, col: number): Seat | undefined => {
    return seats.find((seat) => seat.row === row && seat.col === col);
  };

  const isSeatSelected = (row: number, col: number): boolean => {
    return selectedSeats.some(
      (selectedSeat) => selectedSeat.row === row && selectedSeat.col === col
    );
  };

  return (
    <Box display="grid" gridTemplateColumns={`repeat(${cols}, 1fr)`} gap={1}>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((__, col) => {
          const backendRow = row + 1; // Assuming backend is 1-based
          const backendCol = col + 1;
          const seatInfo = getSeat(backendRow, backendCol);
          const status = seatInfo?.statusId;
          const seatId = seatInfo?.id;
          const isSelected = isSeatSelected(backendRow, backendCol);
          const isAvailable = status === 1 || status === undefined;

          const seatStyle = {
            width: "20px",
            height: "20px",
            borderRadius: "5px",
            backgroundColor: isAvailable
              ? isSelected
                ? "#1976d2"
                : "#4caf50"
              : "#f44336",
            cursor: isAvailable ? "pointer" : "not-allowed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "0.7em",
            color: "#fff",
          };

          const handleClick = () => {
            if (isAvailable && seatId) {
              onSeatSelect({ id: seatId, row: backendRow, col: backendCol });
            }
          };

          return (
            <Box
              key={`${backendRow}-${backendCol}`}
              style={seatStyle}
              onClick={handleClick}
            />
          );
        })
      )}
    </Box>
  );
};

export default SeatGrid;
