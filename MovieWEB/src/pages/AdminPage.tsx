//import React from "react";
import AppNavbar from "../components/AppNavBar";
import { Box, Typography } from "@mui/material";

function AdminPage() {
  return (
    <>
      <AppNavbar />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Administración
        </Typography>
        {/* Admin panel */}
      </Box>
    </>
  );
}

export default AdminPage;
