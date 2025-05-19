import React, { useState, useEffect } from "react";
import AppNavbar from "../../components/AppNavBar";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Pagination,
  Button,
  Modal,
  TextField,
  FormControl,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  fetchTheaterListAdmin,
  TheaterItem,
  TheaterListResponse,
  updateTheaterCapacity,
} from "../../services/AdminService";
import CapacityVisualizer from "../../components/CapacityVisualizer";
//import { useNavigate } from "react-router-dom";

interface EditCapacityForm {
  rows: string;
  cols: string;
}

const ManageTheatersPage: React.FC = () => {
  const [theaters, setTheaters] = useState<TheaterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    TheaterListResponse["pagination"]
  >({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTheater, setEditingTheater] = useState<TheaterItem | null>(
    null
  );
  const [editCapacityForm, setEditCapacityForm] = useState<EditCapacityForm>({
    rows: "",
    cols: "",
  });
  const [updateCapacityLoading, setUpdateCapacityLoading] = useState(false);
  const [updateCapacityError, setUpdateCapacityError] = useState<string | null>(
    null
  );
  const [updateCapacitySuccess, setUpdateCapacitySuccess] = useState<
    boolean | null
  >(null);

  //const navigate = useNavigate();

  useEffect(() => {
    loadTheaters(1);
  }, []);

  const loadTheaters = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTheaterListAdmin(page);
      setTheaters(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Error al cargar la lista de salas de cine");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadTheaters(value);
  };

  const handleOpenEditModal = (theaterId: number) => {
    const theaterToEdit = theaters.find(
      (theater) => theater.theaterId === theaterId
    );
    if (theaterToEdit) {
      setEditingTheater(theaterToEdit);
      setEditModalOpen(true);
      setEditCapacityForm({
        rows: theaterToEdit.capacity.rows.toString(),
        cols: theaterToEdit.capacity.cols.toString(),
      });
      setUpdateCapacityError(null);
      setUpdateCapacitySuccess(null);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingTheater(null);
  };

  const handleEditCapacityInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setEditCapacityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCapacity = async () => {
    if (editingTheater) {
      setUpdateCapacityLoading(true);
      setUpdateCapacityError(null);
      setUpdateCapacitySuccess(null); // Resetear el estado de éxito al iniciar la petición
      try {
        await updateTheaterCapacity(editingTheater.theaterId, {
          rows: parseInt(editCapacityForm.rows),
          cols: parseInt(editCapacityForm.cols),
        });
        setUpdateCapacitySuccess(true); // Establecer el estado de éxito
        loadTheaters(pagination.page); // Recargar la lista para ver los cambios
        setTimeout(handleCloseEditModal, 3500); // Cerrar el modal después de un breve éxito
      } catch (err: any) {
        setUpdateCapacityError(
          err.message || "Error al actualizar la capacidad"
        );
      } finally {
        setUpdateCapacityLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppNavbar />
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button onClick={() => loadTheaters(pagination.page)}>
            Reintentar cargar salas
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Gestionar salas de cine
        </Typography>
        <List>
          {theaters.map((theater) => (
            <ListItem key={theater.theaterId} divider>
              <ListItemText
                primary={theater.theaterName}
                secondary={`Película: ${theater.movieTitle} - Asientos disponibles: ${theater.availableSeats}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenEditModal(theater.theaterId)}
                >
                  <EditIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        {pagination.totalPages > 1 && (
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}

        <Modal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          aria-labelledby="edit-capacity-modal"
          aria-describedby="edit-capacity-form"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="edit-capacity-modal"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Editar capacidad de la sala {editingTheater?.theaterName}
            </Typography>
            {updateCapacitySuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Capacidad actualizada exitosamente.
              </Alert>
            )}
            {updateCapacityError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {updateCapacityError}
              </Alert>
            )}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Nueva cantidad de filas"
                name="rows"
                value={editCapacityForm.rows}
                onChange={handleEditCapacityInputChange}
                type="number"
                required
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Nueva cantidad de columnas"
                name="cols"
                value={editCapacityForm.cols}
                onChange={handleEditCapacityInputChange}
                type="number"
                required
              />
            </FormControl>

            {editingTheater && (
              <CapacityVisualizer
                rows={
                  parseInt(editCapacityForm.rows) ||
                  editingTheater.capacity.rows
                }
                cols={
                  parseInt(editCapacityForm.cols) ||
                  editingTheater.capacity.cols
                }
              />
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                onClick={handleCloseEditModal}
                disabled={updateCapacityLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCapacity}
                disabled={updateCapacityLoading}
              >
                {updateCapacityLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Guardar"
                )}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ManageTheatersPage;
