import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MovieIcon from "@mui/icons-material/Movie";

const AppNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)",
        boxShadow: 3,
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <MovieIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "white" }}
          >
            Movie App
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            startIcon={<HomeIcon />}
            component={Link}
            to="/"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Inicio
          </Button>
          <Button
            startIcon={<HistoryIcon />}
            component={Link}
            to="/reservation-history"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Historial
          </Button>
          <Button
            startIcon={<AccountCircleIcon />}
            component={Link}
            to="/profile"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Perfil
          </Button>
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
