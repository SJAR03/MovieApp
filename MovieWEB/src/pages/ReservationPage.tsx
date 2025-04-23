import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import {
  fetchTheaterDetails,
  fetchTheaterSeats,
} from "../services/TheaterService";
import { TheaterDetails, Seat } from "../interfaces/theater";
import DatePicker from "../components/DatePicker";
import SeatGrid from "../components/SeatGrid";
import { addDays, format } from "date-fns";
import PaymentModal from "../components/PaymentModal"; // Modal for payment

function ReservationPage() {
  const { id } = useParams<{ id: string }>();
  const [theater, setTheater] = useState<TheaterDetails | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [selectedSeats, setSelectedSeats] = useState<
    { id?: number; row: number; col: number }[]
  >([]); // Incluimos 'id' opcional
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [, setPaymentSuccess] = useState<boolean | null>(null); // Estado para la simulación de pago
  const [reservationError,] = useState<string | null>(null); // Estado para errores de reserva

  useEffect(() => {
    if (id) {
      setLoadingDetails(true);
      fetchTheaterDetails(id)
        .then((data) => {
          setTheater(data);
          setLoadingDetails(false);
        })
        .catch((error) => {
          setError(error);
          setLoadingDetails(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id && selectedDate) {
      setLoadingSeats(true);
      fetchTheaterSeats(id, selectedDate)
        .then((data) => {
          // Asegúrate de que la respuesta de fetchTheaterSeats incluye el 'id' del asiento
          setSeats(data);
          setLoadingSeats(false);
        })
        .catch((error) => {
          setError(error);
          setLoadingSeats(false);
        });
    }
  }, [id, selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSeats([]); // Clear selections on date change
  };

  const handleSeatSelect = (seat: { id: number; row: number; col: number }) => {
    const isSelected = selectedSeats.some(
      (s) => s.row === seat.row && s.col === seat.col
    );
    if (isSelected) {
      setSelectedSeats(
        selectedSeats.filter((s) => !(s.row === seat.row && s.col === seat.col))
      );
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentSuccess(null); // Reset el estado de pago
  };

  const handlePay = () => {
    // Simulación del pago
    setPaymentSuccess(null); // Resetear el estado
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.5; // Simulación aleatoria de éxito/fallo
      setPaymentSuccess(isSuccessful);
      if (isSuccessful) {
        // Aquí iría la llamada real al backend para reservar
        console.log("Reserva exitosa (simulada)", {
          theaterId: id,
          reservationDate: selectedDate,
          seatIds: selectedSeats.map((s) => s.id),
        });
        // Redirigir a la página de historial de reservas (esto lo haremos después del modal de éxito)
        // handleClosePaymentModal();
      } else {
        // Mostrar un mensaje de error en el modal
        console.log("Pago fallido (simulado)");
      }
    }, 2000); // Simula un tiempo de procesamiento de 2 segundos
  };

  if (loadingDetails || loadingSeats) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !theater) {
    return (
      <Typography color="error">
        {error || "Error al cargar la información de la sala de cine"}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {theater.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {theater.movie.title}
      </Typography>
      <DatePicker onDateChange={handleDateChange} />
      <Box mt={3}>
        {theater.capacity && (
          <SeatGrid
            rows={theater.capacity.rows}
            cols={theater.capacity.cols}
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          />
        )}
      </Box>
      {selectedSeats.length > 0 && (
        <Box mt={3}>
          <Typography>
            Asientos seleccionados:{" "}
            {selectedSeats
              .map((seat) => `(${seat.row}, ${seat.col})`)
              .join(", ")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleOpenPaymentModal}
          >
            Reservar Asientos
          </Button>
        </Box>
      )}

      <PaymentModal
        open={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        theater={theater}
        selectedDate={selectedDate}
        selectedSeats={selectedSeats}
        onPay={handlePay}
        errorMessage={reservationError} // Puedes mostrar el error aquí si lo deseas
      />
    </Box>
  );
}

export default ReservationPage;
