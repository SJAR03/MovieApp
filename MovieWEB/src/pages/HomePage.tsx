import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Pagination,
} from "@mui/material";
import { fetchTheaterList } from "../services/TheaterService";
import { Theater, TheaterListResponse } from "../interfaces/theater";
import TheaterCard from "../components/TheaterCard";
import AppNavbar from "../components/AppNavBar";

function HomePage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [pagination, setPagination] = useState<
    TheaterListResponse["pagination"]
  >({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTheaters = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTheaterList(page);
      setTheaters(response.data);
      setPagination(response.pagination);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error al cargar las salas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters(1);
  }, []);

  const handlePageChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    fetchTheaters(value);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <AppNavbar />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {theaters.map((theater) => (
            <Grid
              key={theater.theaterId}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <TheaterCard {...theater} />
            </Grid>
          ))}
        </Grid>
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
      </Box>
    </>
  );
}

export default HomePage;
