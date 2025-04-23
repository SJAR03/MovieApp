import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

interface BookingSuccessModalProps {
  open: boolean;
  onClose: () => void;
  bookingDetails: {
    seatIds: number[];
    reservationDate: string;
    theaterId: number;
    movieTitle?: string; // Opcional, pero útil
    theaterName?: string; // Opcional, pero útil
  } | null;
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
  textAlign: "center",
};

const ReservationSuccessModal: React.FC<BookingSuccessModalProps> = ({
  open,
  onClose,
  bookingDetails,
}) => {
  const qrCodeData = bookingDetails
    ? `Asientos: ${bookingDetails.seatIds.join(", ")}\nFecha: ${
        bookingDetails.reservationDate
      }\nSala: ${bookingDetails.theaterId}${
        bookingDetails.movieTitle
          ? `\nPelícula: ${bookingDetails.movieTitle}`
          : ""
      }${
        bookingDetails.theaterName
          ? `\nSala de cine: ${bookingDetails.theaterName}`
          : ""
      }`
    : "";

  const downloadQRCode = () => {
    const qrCodeSVG = document.getElementById("qr-code-canvas");
    if (qrCodeSVG) {
      const svgData = new XMLSerializer().serializeToString(qrCodeSVG);
      const canvas = document.createElement("canvas");
      const svgSize = qrCodeSVG.getBoundingClientRect();
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = dataURL;
          downloadLink.download = "reserva_qr.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        img.onerror = () => {
          console.error("Error loading SVG image");
        };
        img.src =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
      }
    }
  };

  return (
    <Modal
      open={open}
      aria-labelledby="booking-success-modal-title"
      aria-describedby="booking-success-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="booking-success-modal-title"
          variant="h6"
          component="h2"
          mb={2}
        >
          ¡Reserva Exitosa!
        </Typography>
        {bookingDetails && (
          <Box mb={2}>
            <QRCodeSVG
              id="qr-code-canvas"
              value={qrCodeData}
              size={256}
              level="H"
            />
          </Box>
        )}
        <Typography id="booking-success-modal-description" sx={{ mb: 2 }}>
          Guarda este código QR para acceder a la sala. Puedes descargarlo como
          imagen.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={downloadQRCode}
          sx={{ mb: 2 }}
        >
          Descargar QR
        </Button>
        <Button onClick={onClose}>Aceptar</Button>
      </Box>
    </Modal>
  );
};

export default ReservationSuccessModal;
