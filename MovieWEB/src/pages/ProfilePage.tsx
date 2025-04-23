//import React from "react";
import AppNavbar from "../components/AppNavBar";
import { Box, Typography } from "@mui/material";

function ProfilePage() {
  return (
    <>
      <AppNavbar />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Mi Perfil
        </Typography>
        {/* Here will be displayed the user info */}
      </Box>
    </>
  );
}

export default ProfilePage;
