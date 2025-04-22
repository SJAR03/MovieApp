import React from "react";
import { styled, Theme } from "@mui/material";

const StyledForm = styled("form")(({ theme }: { theme: Theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2), // Space between form elements
}));

interface AuthFormProps {
  onSubmit: (event: React.FormEvent) => void;
  children: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, children }) => {
  return (
    <StyledForm onSubmit={onSubmit} noValidate>
      {children}
    </StyledForm>
  );
};

export default AuthForm;
