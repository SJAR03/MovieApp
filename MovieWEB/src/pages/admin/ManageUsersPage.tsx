// src/pages/admin/ManageUsersPage.tsx
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  fetchActiveUsers,
  disableUser,
  User,
  UserListResponse,
} from "../../services/AdminService";

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDisable, setUserToDisable] = useState<number | null>(null);
  const [disableLoading, setDisableLoading] = useState(false);
  const [disableError, setDisableError] = useState<string | null>(null);
  const [disableSuccess, setDisableSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UserListResponse["pagination"]>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    loadUsers(1);
  }, []);

  const loadUsers = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchActiveUsers(page);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Error al cargar la lista de usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    loadUsers(value);
  };

  const openDialog = (userId: number) => {
    setUserToDisable(userId);
    setDialogOpen(true);
    setDisableError(null);
    setDisableSuccess(null);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setUserToDisable(null);
  };

  const handleDisableUser = async () => {
    if (userToDisable) {
      setDisableLoading(true);
      setDisableError(null);
      setDisableSuccess(null);
      try {
        await disableUser(userToDisable);
        setDisableSuccess("Usuario deshabilitado exitosamente.");
        loadUsers(pagination.page); // Recargar la lista para ver los cambios
        setTimeout(closeDialog, 1500); // Cerrar el diálogo después de un breve éxito
      } catch (err: any) {
        setDisableError(err.message || "Error al deshabilitar el usuario");
      } finally {
        setDisableLoading(false);
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
          <Button onClick={() => loadUsers(pagination.page)}>
            Reintentar cargar usuarios
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
          Gestionar Usuarios
        </Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.id} divider>
              <ListItemText
                primary={user.name}
                secondary={`Username: ${user.username}, Email: ${user.email}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => openDialog(user.id)}
                >
                  <DeleteIcon />
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

        <Dialog
          open={dialogOpen}
          onClose={closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"¿Deshabilitar usuario?"}
          </DialogTitle>
          <DialogContent>
            <Typography id="alert-dialog-description">
              Esta acción deshabilitará al usuario. ¿Está seguro de que desea
              continuar?
            </Typography>
            {disableSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {disableSuccess}
              </Alert>
            )}
            {disableError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {disableError}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={disableLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleDisableUser}
              disabled={disableLoading}
              variant="contained"
              color="error"
            >
              {disableLoading ? <CircularProgress size={24} /> : "Deshabilitar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ManageUsersPage;
