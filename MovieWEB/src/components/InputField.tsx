import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

type InputFieldProps = TextFieldProps;

const InputField: React.FC<InputFieldProps> = (props) => {
  return <TextField variant="outlined" margin="normal" fullWidth {...props} />;
};

export default InputField;
