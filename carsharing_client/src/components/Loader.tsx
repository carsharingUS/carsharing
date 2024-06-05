import React from 'react';
import './Loader.css'; // Asegúrate de que los estilos estén correctamente importados

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader" />
    </div>
  );
};

export default Loader;
