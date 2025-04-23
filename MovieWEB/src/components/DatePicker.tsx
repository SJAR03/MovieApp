import React, { useState } from "react";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { addDays, format } from "date-fns";

interface DatePickerProps {
  onDateChange: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    addDays(new Date(), 1)
  ); // Default to tomorrow

  const handleChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
    if (newDate) {
      onDateChange(format(newDate, "yyyy-MM-dd"));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        label="Seleccionar Fecha"
        value={selectedDate}
        onChange={handleChange}
        slots={{ textField: TextField }}
        minDate={new Date()}
        maxDate={addDays(new Date(), 7)}
        enableAccessibleFieldDOMStructure={false}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
