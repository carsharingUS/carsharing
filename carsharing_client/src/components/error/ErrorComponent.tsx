import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorComponent.css';

const ErrorComponent: React.FC<{ error: string }> = ({ error }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="error-container">
      <div className="error-content">
        <h1>Algo ha ido mal</h1>
        <br />
        <p>Estamos trabajando en solucionar el problema. Intentelo de nuevo mas tarde.</p>
        <button type="submit" className="back-home-button" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;
