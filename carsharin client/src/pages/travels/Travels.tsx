import React, { useEffect, useState } from 'react';
import { getAllTravels } from '../../api/TravelService';

interface Travel {
    id: number;
    origin: string;
    destination: string;
    start_date: string;
  }

const Travels = () => {
  const [travels, setTravels] = useState<Travel[]>([]);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const allTravels: Travel[] = await getAllTravels();
        setTravels(allTravels);
      } catch (error) {
        console.error('Error fetching travels:', error);
        // Puedes manejar el error de la manera que prefieras (mostrar un mensaje de error, etc.)
      }
    };

    fetchTravels();
  }, []);

  return (
    <div>
      <h1>Lista de Viajes</h1>
      <ul>
        {travels.map((travel) => (
          <li key={travel.id}>
            <p>Origen: {travel.origin}</p>
            <p>Destino: {travel.destination}</p>
            <p>Fecha de inicio: {travel.start_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Travels;