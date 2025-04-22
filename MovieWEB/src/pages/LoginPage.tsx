import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";
import { LoginCredentials } from "../interfaces/auth";
import { Button, Box, Typography } from "@mui/material";
import AuthContainer from "../components/AuthContainer";
import AuthForm from "../components/AuthForm";
import InputField from "../components/InputField";
import AuthLink from "../components/AuthLink";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const credentials: LoginCredentials = {
      username: username,
      password: password,
    };

    try {
      const response = await login(credentials);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <AuthContainer title="Iniciar Sesión">
      {error && (
        <Typography variant="body2" color="error" align="center" mb={2}>
          {error}
        </Typography>
      )}
      <AuthForm onSubmit={handleSubmit}>
        <InputField
          label="Usuario"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <InputField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <StyledButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Iniciar Sesión
        </StyledButton>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <AuthLink to="/register">
            {"¿No tienes cuenta? Crear cuenta"}
          </AuthLink>
        </Box>
      </AuthForm>
    </AuthContainer>
  );
}

export default LoginPage;
