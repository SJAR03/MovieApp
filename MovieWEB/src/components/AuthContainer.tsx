import React from "react";
import { Box, styled, Theme, Typography } from "@mui/material";

const StyledContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center", // Center vertically
  minHeight: "100vh", // Take full viewport height
  width: "100%",
  background: theme.palette.background.default, // Default background
  padding: theme.spacing(3),
}));

const StyledCard = styled(Box)(({ theme }: { theme: Theme }) => ({
  width: "100%",
  maxWidth: "400px", // Adjust as needed
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
}));

interface AuthContainerProps {
  children: React.ReactNode;
  title?: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children, title }) => {
  return (
    <StyledContainer>
      <StyledCard>
        {title && (
          <Typography component="h1" variant="h5" mb={2}>
            {title}
          </Typography>
        )}
        {children}
      </StyledCard>
    </StyledContainer>
  );
};

export default AuthContainer;
