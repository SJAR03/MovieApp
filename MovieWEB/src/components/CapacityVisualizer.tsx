import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

interface CapacityVisualizerProps {
  rows: number;
  cols: number;
}

const CapacityVisualizer: React.FC<CapacityVisualizerProps> = ({
  rows,
  cols,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawGrid(rows, cols);
  }, [rows, cols]);

  const drawGrid = (numRows: number, numCols: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellWidth = Math.min(30, canvas.width / numCols);
    const cellHeight = Math.min(20, canvas.height / numRows);
    const seatMargin = 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        ctx.fillStyle = "#4caf50"; // Color del asiento
        ctx.fillRect(
          j * cellWidth + seatMargin,
          i * cellHeight + seatMargin,
          cellWidth - 2 * seatMargin,
          cellHeight - 2 * seatMargin
        );
      }
    }
  };

  const canvasWidth = Math.min(30 * cols, 300);
  const canvasHeight = Math.min(20 * rows, 200);

  return (
    <Box
      sx={{
        width: "100%",
        mt: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Vista previa de la capacidad:
      </Typography>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px solid #ccc", display: "block" }}
      />
    </Box>
  );
};

export default CapacityVisualizer;
