import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import ReservationSummary from "./ReservationSummary";
import PaymentForm from "./PaymentForm";
import { TheaterDetails } from "../interfaces/theater";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  theater: TheaterDetails | null;
  selectedDate: string;
  selectedSeats: { row: number; col: number }[];
  onPay: () => void; // Function to simulate the payment
  errorMessage: string | null;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  theater,
  selectedDate,
  selectedSeats,
  onPay,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box sx={style}>
        <Typography id="payment-modal-title" variant="h6" component="h2" mb={2}>
          Confirmar Reserva y Pago
        </Typography>
        <ReservationSummary
          theater={theater}
          selectedDate={selectedDate}
          selectedSeats={selectedSeats}
        />
        <PaymentForm />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={onPay}>
            Pagar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
