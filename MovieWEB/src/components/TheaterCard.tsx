import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Theater } from "../interfaces/theater";

const TheaterCard: React.FC<Theater> = ({
  theaterId,
  movieTitle,
  movieImage,
  theaterName,
  availableSeats,
}) => {
  return (
    <Card>
      <CardActionArea component={Link} to={`/theaters/${theaterId}`}>
        <CardMedia
          component="img"
          height="140"
          image={movieImage}
          alt={movieTitle}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {movieTitle}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sala: {theaterName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Asientos disponibles: {availableSeats}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default TheaterCard;
