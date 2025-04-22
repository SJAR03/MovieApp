import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/AuthService";
import { RegisterData } from "../interfaces/auth";
import { Typography, Button, Box, Snackbar, Alert } from "@mui/material";
import AuthContainer from "../components/AuthContainer";
import AuthForm from "../components/AuthForm";
import InputField from "../components/InputField";
import AuthLink from "../components/AuthLink";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const userData: RegisterData = {
      name: name,
      username: username,
      email: email,
      password: password,
    };

    try {
      await register(userData);
      setSuccessMessage(
        "Cuenta creada exitosamente. Serás redirigido al inicio de sesión."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect after 2 seconds
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <AuthContainer title="Crear Cuenta">
      {error && (
        <Typography variant="body2" color="error" align="center" mb={2}>
          {error}
        </Typography>
      )}
      <AuthForm onSubmit={handleSubmit}>
        <InputField
          label="Nombre"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <InputField
          label="Usuario"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <InputField
          label="Correo Electrónico"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <InputField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <StyledButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Crear Cuenta
        </StyledButton>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <AuthLink to="/login">{"¿Ya tienes cuenta? Iniciar Sesión"}</AuthLink>
        </Box>
      </AuthForm>
      {successMessage && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSuccessMessage("")}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      )}
    </AuthContainer>
  );
}

export default RegisterPage;
