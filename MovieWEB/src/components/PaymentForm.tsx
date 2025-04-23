import React from "react";
import { TextField, Box, Typography } from "@mui/material";

interface PaymentFormProps {
  // It is posible to add more props if needed for a more complex simulation
}

const PaymentForm: React.FC<PaymentFormProps> = () => {
  return (
    <Box mb={2}>
      <Typography variant="subtitle1" gutterBottom>
        Información de Pago
      </Typography>
      <TextField
        fullWidth
        label="Número de Tarjeta"
        variant="outlined"
        margin="normal"
      />
      <Box display="flex" gap={2}>
        <TextField
          label="Fecha de Expiración"
          variant="outlined"
          margin="normal"
        />
        <TextField label="CVV" variant="outlined" margin="normal" />
      </Box>
      {/* If I want it is posible add more fields to simulate */}
    </Box>
  );
};

export default PaymentForm;
