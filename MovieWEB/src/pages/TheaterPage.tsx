import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  } from "@mui/material";
import {
  fetchTheaterDetails,
  fetchTheaterSeats,
} from "../services/TheaterService";
import { createReservation } from "../services/ReservationService";
import { TheaterDetails, Seat } from "../interfaces/theater";
import DatePicker from "../components/DatePicker";
import SeatGrid from "../components/SeatGrid";
import { addDays, format } from "date-fns";
import PaymentModal from "../components/PaymentModal";
import BookingSuccessModal from "../components/ReservationSucessModal";

function TheaterPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theater, setTheater] = useState<TheaterDetails | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [selectedSeats, setSelectedSeats] = useState<
    { id?: number; row: number; col: number }[]
  >([]);
  const [, setLoadingDetails] = useState(true);
  const [, setLoadingSeats] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [, setPaymentSuccess] = useState<boolean | null>(null);
  const [isBookingSuccessModalOpen, setIsBookingSuccessModalOpen] =
    useState(false);
  const [bookingConfirmationDetails, setBookingConfirmationDetails] = useState<{
    reservationId?: number;
    seatIds: number[];
    reservationDate: string;
    theaterId: number;
    movieTitle?: string;
    theaterName?: string;
  } | null>(null);
  const [reservationError, setReservationError] = useState<string | null>(null); // Estado para errores de reserva

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
    if (id && selectedDate && theater) {
      setLoadingSeats(true);
      fetchTheaterSeats(id, selectedDate)
        .then((data) => {
          setSeats(data);
          setLoadingSeats(false);
        })
        .catch((error) => {
          setError(error);
          setLoadingSeats(false);
        });
    }
  }, [id, selectedDate, theater]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSeats([]);
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
    setPaymentSuccess(null);
    setReservationError(null); // Limpiar errores al cerrar el modal de pago
  };

  const handlePay = async () => {
    setPaymentSuccess(null);
    setReservationError(null);
    setTimeout(async () => {
      const isSuccessful = Math.random() > 0.5; // Simulación de pago
      setPaymentSuccess(isSuccessful);
      if (isSuccessful && theater) {
        const seatIds = selectedSeats
          .map((s) => s.id)
          .filter((id) => id !== undefined) as number[];
        try {
          const reservationData = await createReservation({
            theaterId: theater.id,
            reservationDate: selectedDate,
            seatsId: seatIds,
          });
          setBookingConfirmationDetails({
            reservationId: reservationData.reservation.id,
            seatIds: seatIds,
            reservationDate: selectedDate,
            theaterId: theater.id,
            movieTitle: theater.movie.title,
            theaterName: theater.name,
          });
          setIsBookingSuccessModalOpen(true);
          handleClosePaymentModal();
        } catch (error: any) {
          console.error("Error al crear la reserva:", error);
          setReservationError(error || "Error al realizar la reserva");
          setPaymentSuccess(false); // Considerar marcar el pago como fallido si la reserva falla
        }
      } else if (!isSuccessful) {
        console.log("Pago fallido (simulado)");
        // Aquí podrías mostrar un mensaje de error en el modal de pago
      }
    }, 2000);
  };

  const handleCloseBookingSuccessModal = () => {
    setIsBookingSuccessModalOpen(false);
    setBookingConfirmationDetails(null);
    navigate("/");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {theater?.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {theater?.movie.title}
      </Typography>
      <DatePicker onDateChange={handleDateChange} />
      <Box mt={3}>
        {theater?.capacity && (
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

      <BookingSuccessModal
        open={isBookingSuccessModalOpen}
        onClose={handleCloseBookingSuccessModal}
        bookingDetails={bookingConfirmationDetails}
      />
    </Box>
  );
}

export default TheaterPage;
