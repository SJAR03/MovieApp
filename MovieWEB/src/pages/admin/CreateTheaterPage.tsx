import React, { useState, useEffect } from "react";
import AppNavbar from "../../components/AppNavBar";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material";
import {
  fetchMovieListAdmin,
  createNewTheater,
} from "../../services/AdminService";
import { Movie } from "../../interfaces/movie";

interface CreateTheaterForm {
  name: string;
  movieId: number | string;
  rows: number | string;
  cols: number | string;
}

const CreateTheaterPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formValues, setFormValues] = useState<CreateTheaterForm>({
    name: "",
    movieId: "",
    rows: "",
    cols: "",
  });
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    loadMovieList();
  }, []);

  const loadMovieList = async () => {
    setLoadingMovies(true);
    setError(null);
    try {
      const movieList = await fetchMovieListAdmin();
      setMovies(movieList);
    } catch (err: any) {
      setError(err.message || "Error al cargar la lista de películas");
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingCreate(true);
    setCreationSuccess(null);
    setError(null);

    try {
      await createNewTheater({
        name: formValues.name,
        movieId: parseInt(formValues.movieId as string),
        capacity: {
          rows: parseInt(formValues.rows as string),
          cols: parseInt(formValues.cols as string),
        },
      });
      setCreationSuccess(true);
      setTimeout(() => {
        navigate("/admin/manage-theaters");
      }, 1500); // Redirigir después de 1.5 segundos
    } catch (err: any) {
      setError(err.message || "Error al crear la sala de cine");
    } finally {
      setLoadingCreate(false);
    }
  };

  if (loadingMovies) {
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
          <Button onClick={loadMovieList}>Reintentar cargar películas</Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
        <Card sx={{ maxWidth: 400, width: "100%" }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Crear nueva sala de cine
            </Typography>

            {creationSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Sala de cine creada exitosamente. Redirigiendo...
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <TextField
                label="Nombre de la sala"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel id="movie-select-label">Película</InputLabel>
                <Select
                  labelId="movie-select-label"
                  id="movieId"
                  name="movieId"
                  value={formValues.movieId}
                  label="Película"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="">
                    <em>Seleccionar Película</em>
                  </MenuItem>
                  {movies.map((movie) => (
                    <MenuItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Filas"
                name="rows"
                value={formValues.rows}
                onChange={handleInputChange}
                type="number"
                required
                fullWidth
              />
              <TextField
                label="Columnas"
                name="cols"
                value={formValues.cols}
                onChange={handleInputChange}
                type="number"
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loadingCreate}
                sx={{ mt: 2 }}
              >
                {loadingCreate ? <CircularProgress size={24} /> : "Crear sala"}
              </Button>
              {error && (
                <Typography color="error" mt={2}>
                  {error}
                </Typography>
              )}
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default CreateTheaterPage;
