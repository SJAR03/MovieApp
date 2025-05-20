// src/pages/admin/ManageMoviesPage.tsx
import React, { useState, useEffect } from "react";
import AppNavbar from "../../components/AppNavBar";
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  ListItemSecondaryAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  fetchMovieListAdmin,
  createNewMovie,
  updateMovie,
} from "../../services/AdminService";
import { Movie } from "../../interfaces/movie";

interface MovieForm {
  id?: number; // 'id' es opcional para la creación
  title: string;
  posterImage: string;
  description: string;
}

const initialMovieForm: MovieForm = {
  title: "",
  posterImage: "",
  description: "",
};

const ManageMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [movieForm, setMovieForm] = useState<MovieForm>(initialMovieForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const movieList = await fetchMovieListAdmin();
      setMovies(movieList);
    } catch (err: any) {
      setError(err.message || "Error al cargar la lista de películas");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setMovieForm(initialMovieForm);
    setIsEditMode(false);
    setModalOpen(true);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setMovieForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditMovie = (movie: Movie) => {
    setMovieForm(movie); // La 'movie' que pasamos ya tiene el ID
    setIsEditMode(true);
    setModalOpen(true);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      if (isEditMode) {
        // En modo edición, movieForm.id siempre será un número porque lo cargamos desde 'movie: Movie'
        // por lo tanto, podemos asegurarnos de que es un número con el operador '!'
        // o, mejor aún, crear un payload que cumpla con UpdateMoviePayload
        const payload: Movie = {
          id: movieForm.id!, // <-- Aseguramos que 'id' no sea undefined
          title: movieForm.title,
          posterImage: movieForm.posterImage,
          description: movieForm.description,
        };
        const response = await updateMovie(payload);
        setSubmitSuccess(response.message);
      } else {
        // Para crear, el 'id' no es necesario en el payload
        const createPayload: Omit<MovieForm, "id"> = {
          title: movieForm.title,
          posterImage: movieForm.posterImage,
          description: movieForm.description,
        };
        const response = await createNewMovie(createPayload);
        setSubmitSuccess(response.message);
      }
      setSubmitLoading(false);
      loadMovies(); // Recargar la lista de películas
      setTimeout(handleCloseModal, 1500); // Cerrar el modal después de un breve éxito
    } catch (err: any) {
      setSubmitError(err.message || "Error al guardar la película");
      setSubmitLoading(false);
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
          <Button onClick={loadMovies}>Reintentar cargar películas</Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Gestionar Películas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{ mb: 2 }}
        >
          Agregar Nueva Película
        </Button>
        <List>
          {movies.map((movie) => (
            <ListItem key={movie.id} divider>
              <ListItemAvatar>
                <Avatar
                  src={movie.posterImage}
                  alt={movie.title}
                  sx={{ width: 80, height: 120, mr: 2 }}
                  variant="rounded"
                />
              </ListItemAvatar>
              <ListItemText
                primary={movie.title}
                secondary={movie.description}
              />
              {/* Importante: ListItemSecondaryAction debe estar importado */}
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditMovie(movie)}
                >
                  <EditIcon />
                </IconButton>
                {/* Aquí iría un botón de eliminar si lo implementamos más adelante */}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              {isEditMode ? "Editar Película" : "Agregar Nueva Película"}
            </Typography>
            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {submitSuccess}
              </Alert>
            )}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Título"
              name="title"
              value={movieForm.title}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="URL del Póster"
              name="posterImage"
              value={movieForm.posterImage}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              required
            />
            {movieForm.posterImage && (
              <Box
                sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center" }}
              >
                {/* Añadir manejo de errores para la imagen */}
                <img
                  src={movieForm.posterImage}
                  alt="Vista previa del póster"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/150?text=Imagen+no+disponible";
                  }} // Fallback de imagen
                />
              </Box>
            )}
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              value={movieForm.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              required
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button onClick={handleCloseModal} disabled={submitLoading}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? (
                  "Guardar Cambios"
                ) : (
                  "Agregar"
                )}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default ManageMoviesPage;
