// src/pages/admin/EditTheaterDetailsPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "../../components/AppNavBar";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  fetchTheaterListAdmin, // Para obtener los detalles iniciales del teatro
  fetchMovieListAdmin,
  updateTheaterDetails,
  //TheaterItem,
} from "../../services/AdminService";
import { Movie } from "../../interfaces/movie";
import { SelectChangeEvent } from "@mui/material/Select";

const EditTheaterDetailsPage: React.FC = () => {
  const { theaterId } = useParams<{ theaterId: string }>(); // Obtener el ID de la URL
  const navigate = useNavigate();

  const [theaterName, setTheaterName] = useState<string>("");
  const [selectedMovieId, setSelectedMovieId] = useState<string>(""); // ID de la película seleccionada (como string para Select)
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMoviePoster, setCurrentMoviePoster] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);

  // Estado para guardar la información original del teatro para comparación
  const [originalTheaterName, setOriginalTheaterName] = useState<string>("");
  const [originalMovieId, setOriginalMovieId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Cargar la lista completa de películas
        const movieList = await fetchMovieListAdmin();
        setMovies(movieList);

        // 2. Cargar los detalles del teatro específico
        // Dado que no hay un endpoint GET /theater/{id}, usamos la lista y filtramos
        const theatersResponse = await fetchTheaterListAdmin(1); // Podrías necesitar cargar más páginas si el teatro no está en la primera
        const theaterToEdit = theatersResponse.data.find(
          (t) => t.theaterId === parseInt(theaterId || "")
        );

        if (theaterToEdit) {
          setTheaterName(theaterToEdit.theaterName);
          setOriginalTheaterName(theaterToEdit.theaterName); // Guardar original

          // Encontrar la película actual del teatro en la lista de películas por su título
          const currentMovie = movieList.find(
            (movie) => movie.title === theaterToEdit.movieTitle
          );

          if (currentMovie) {
            setSelectedMovieId(currentMovie.id.toString());
            setCurrentMoviePoster(currentMovie.posterImage);
            setOriginalMovieId(currentMovie.id); // Guardar original
          } else {
            // Si la película actual no se encuentra en la lista (caso improbable)
            setSelectedMovieId("");
            setCurrentMoviePoster(null);
            setOriginalMovieId(null);
          }
        } else {
          setError("Sala de cine no encontrada.");
        }
      } catch (err: any) {
        setError(
          err.message || "Error al cargar los datos de la sala o películas."
        );
      } finally {
        setLoading(false);
      }
    };

    if (theaterId) {
      loadData();
    } else {
      setError("ID de sala no proporcionado.");
      setLoading(false);
    }
  }, [theaterId]); // Dependencia del ID de la sala

  const handleMovieChange = (event: SelectChangeEvent) => {
    const movieIdString = event.target.value;
    setSelectedMovieId(movieIdString);
    const selectedMovie = movies.find(
      (movie) => movie.id.toString() === movieIdString
    );
    setCurrentMoviePoster(selectedMovie?.posterImage || null);
  };

  const handleSave = async () => {
    if (!theaterId) {
      setError("ID de sala no disponible para guardar.");
      return;
    }

    const parsedTheaterId = parseInt(theaterId);
    const parsedMovieId = parseInt(selectedMovieId);

    // Validar si hay cambios reales para evitar llamadas innecesarias
    const nameChanged = theaterName !== originalTheaterName;
    const movieIdChanged = parsedMovieId !== originalMovieId;

    if (!nameChanged && !movieIdChanged) {
      setUpdateSuccess(false); // Indicar que no se hizo ninguna actualización
      setError("No hay cambios en el nombre o la película para guardar.");
      return;
    }

    if (isNaN(parsedMovieId) || !theaterName) {
      setError("Por favor, complete todos los campos requeridos.");
      return;
    }

    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      await updateTheaterDetails(parsedTheaterId, {
        name: theaterName,
        movieId: parsedMovieId,
      });
      setUpdateSuccess(true);
      // Actualizar los valores originales después de un guardado exitoso
      setOriginalTheaterName(theaterName);
      setOriginalMovieId(parsedMovieId);

      setTimeout(() => {
        navigate("/admin/theaters"); // Volver a la lista de salas después de un éxito
      }, 1500);
    } catch (err: any) {
      setUpdateError(
        err.response?.data?.message ||
          "Error al actualizar los detalles de la sala."
      );
      setUpdateSuccess(false);
    } finally {
      setUpdating(false);
    }
  };

  const setUpdateError = (msg: string | null) => setError(msg); // Usamos el mismo estado de error general

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

  if (error && !updateSuccess) {
    // Mostrar error general si no hay un éxito reciente
    return (
      <>
        <AppNavbar />
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button onClick={() => navigate("/admin/theaters")}>
            Volver a Salas
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Box sx={{ padding: 2, maxWidth: 600, mx: "auto", mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Editar Detalles de Sala: {originalTheaterName || "Cargando..."}
        </Typography>

        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Detalles de la sala actualizados exitosamente. Redirigiendo...
          </Alert>
        )}
        {error &&
          updateSuccess === false && ( // Mostrar error de actualización
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

        <TextField
          fullWidth
          label="Nombre de la Sala"
          value={theaterName}
          onChange={(e) => setTheaterName(e.target.value)}
          sx={{ mb: 3 }}
          required
          disabled={updating}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="movie-select-label">Película Asignada</InputLabel>
          <Select
            labelId="movie-select-label"
            value={selectedMovieId}
            label="Película Asignada"
            onChange={handleMovieChange}
            disabled={updating}
          >
            {movies.map((movie) => (
              <MenuItem key={movie.id} value={movie.id.toString()}>
                {movie.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {currentMoviePoster && (
          <Box sx={{ mt: 2, mb: 3, display: "flex", justifyContent: "center" }}>
            <img
              src={currentMoviePoster}
              alt="Póster de la película seleccionada"
              style={{
                maxWidth: "100%",
                maxHeight: 250,
                objectFit: "contain",
                borderRadius: "8px",
              }}
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/150?text=Imagen+no+disponible";
              }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/theaters")}
            disabled={updating}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={updating}
          >
            {updating ? <CircularProgress size={24} /> : "Guardar Cambios"}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EditTheaterDetailsPage;
