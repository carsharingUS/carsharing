import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MapView = () => {
  const [mapHtml, setMapHtml] = useState("");
  const navigate = useNavigate();

  // Si no hay HTML del mapa, redirige de nuevo a la página de detalles del viaje
  useEffect(() => {
    if (!mapHtml) {
      navigate("/");
    }
  }, [mapHtml, navigate]);

  // Aquí simulo la obtención del HTML del mapa (reemplaza esto con tu lógica real)
  useEffect(() => {
    const fetchMapHtml = async () => {
      // Aquí podrías hacer una solicitud al servidor para obtener el HTML del mapa
      // En este ejemplo, simplemente simulamos una respuesta del servidor
      const response = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Mapa</title></head><body><h1>Este es el mapa</h1></body></html>`;
      setMapHtml(response);
    };

    fetchMapHtml();
  }, []);

  return (
    <div>
      <h1>Mapa</h1>
      {/* Renderiza el HTML del mapa utilizando dangerouslySetInnerHTML */}
      <div dangerouslySetInnerHTML={{ __html: mapHtml }} />
    </div>
  );
};

export default MapView;
