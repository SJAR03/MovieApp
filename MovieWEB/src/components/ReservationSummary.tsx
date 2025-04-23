import React from "react";
import { Typography, Box } from "@mui/material";
import { TheaterDetails } from "../interfaces/theater";

interface BookingSummaryProps {
  theater: TheaterDetails | null;
  selectedDate: string;
  selectedSeats: { row: number; col: number }[];
}

const ReservationSummary: React.FC<BookingSummaryProps> = ({
  theater,
  selectedDate,
  selectedSeats,
}) => {
  if (!theater) {
    return <Typography>No se ha seleccionado ninguna sala.</Typography>;
  }

  return (
    <Box mb={2}>
      <Typography variant="h6" gutterBottom>
        Resumen de la Reserva
      </Typography>
      <Typography>Película: {theater.movie.title}</Typography>
      <Typography>Sala: {theater.name}</Typography>
      <Typography>Fecha: {selectedDate}</Typography>
      {selectedSeats.length > 0 ? (
        <Typography>
          Asientos:{" "}
          {selectedSeats.map((seat) => `(${seat.row}, ${seat.col})`).join(", ")}
        </Typography>
      ) : (
        <Typography>No se han seleccionado asientos.</Typography>
      )}
      {/* Simulate final price here */}
    </Box>
  );
};

export default ReservationSummary;
