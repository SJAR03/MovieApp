import React from "react";
import AppNavbar from "../components/AppNavBar";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";

interface AdminMenuItem {
  label: string;
  to: string;
  description: string;
}

const adminMenuItems: AdminMenuItem[] = [
  {
    label: "Crear sala de cine",
    to: "/admin/create-theater",
    description: "Registrar una nueva sala con su capacidad y película.",
  },
  {
    label: "Gestionar salas de cine",
    to: "/admin/manage-theaters",
    description: "Ver y modificar la información de las salas existentes.",
  },
  {
    label: "Crear película",
    to: "/admin/create-movie",
    description: "Añadir una nueva película al sistema.",
  },
  {
    label: "Gestionar películas",
    to: "/admin/manage-movies",
    description: "Editar o eliminar películas existentes.",
  },
  // Puedes añadir más opciones aquí
];

const AdminPage: React.FC = () => {
  return (
    <>
      <AppNavbar />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Panel de Administración
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {adminMenuItems.map((item) => (
            <Card
              key={item.to}
              sx={{ width: "calc(33% - 16px)", minWidth: 250 }}
            >
              <CardActionArea component={Link} to={item.to}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default AdminPage;
