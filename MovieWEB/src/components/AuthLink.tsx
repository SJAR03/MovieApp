import React from "react";
import { Link, LinkProps, styled, Theme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface AuthLinkProps extends LinkProps {
  to: string;
}

const StyledLink = styled(Link)<LinkProps & { to: string }>(
  ({ theme }: { theme: Theme }) => ({
    marginTop: theme.spacing(2),
  })
);

const AuthLink: React.FC<AuthLinkProps> = ({ to, children, ...rest }) => {
  return (
    <StyledLink component={RouterLink} to={to} variant="body2" {...rest}>
      {children}
    </StyledLink>
  );
};

export default AuthLink;
