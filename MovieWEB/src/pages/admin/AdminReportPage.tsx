import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import AppNavbar from "../../components/AppNavBar";
import { fetchAdminReport, AdminReportData } from "../../services/ReportsService";

const AdminReportPage: React.FC = () => {
  const [report, setReport] = useState<AdminReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No autorizado.");
      setLoading(false);
      return;
    }

    fetchAdminReport(token)
      .then(setReport)
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el reporte.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AppNavbar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reporte de actividad (Próximos 8 Días)
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : report ? (
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            gap={2}
            mt={3}
          >
            <Paper sx={{ flex: "1 1 250px", p: 3, minWidth: 250 }}>
              <Typography variant="h6">Butacas Reservadas</Typography>
              <Typography variant="h4" color="primary">
                {report.reservedSeats}
              </Typography>
            </Paper>

            <Paper sx={{ flex: "1 1 250px", p: 3, minWidth: 250 }}>
              <Typography variant="h6">Ingresos Totales</Typography>
              <Typography variant="h4" color="success.main">
                ${report.totalIncome.toFixed(2)}
              </Typography>
            </Paper>

            <Paper sx={{ flex: "1 1 250px", p: 3, minWidth: 250 }}>
              <Typography variant="h6">Ingresos Perdidos</Typography>
              <Typography variant="h4" color="error">
                ${report.potentialLostIncome.toFixed(2)}
              </Typography>
            </Paper>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default AdminReportPage;
