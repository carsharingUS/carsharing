import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SearchComponent.css';

const SearchComponent = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const handleSearch = () => {
        console.log(`Buscando viajes de ${origin} a ${destination}`);
    };

    return (

        <div className="search-section">
            <div className="background-video">
                {/* Reemplaza 'video.mp4' con la ruta de tu video o gif */}
                <video autoPlay loop muted className="background-video-content">
                    <source src="http://localhost:8000/media/HomeCar4.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                </video>
            </div>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="search-container"
            >
                <h2 className="search-title">Encuentra tu próximo viaje</h2>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="search-form"
                >
                    <motion.label
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="search-label"
                    >
                        Desde:
                    </motion.label>
                    <motion.input
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        type="text"
                        placeholder="Origen"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="search-input"
                    />
                    <motion.label
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="search-label"
                    >
                        Hasta:
                    </motion.label>
                    <motion.input
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        type="text"
                        placeholder="Destino"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="search-input"
                    />

                    {/* Nuevo campo para la fecha */}
                    <motion.label
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                        className="search-label"
                    >
                        Fecha del Viaje:
                    </motion.label>
                    <motion.input
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="search-input"
                    />
                    {/* Fin del nuevo campo de fecha */}

                    <motion.button
                        onClick={handleSearch}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="search-button"
                    >
                        Buscar
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SearchComponent;
