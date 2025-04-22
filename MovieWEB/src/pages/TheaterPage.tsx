//import React from "react";
import { useParams } from "react-router-dom";

function TheaterPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalles de la Sala: {id}</h1>
      {/* The seating arrangement and date picker will be displayed here. */}
    </div>
  );
}

export default TheaterPage;
