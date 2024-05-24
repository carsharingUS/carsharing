// Card.tsx
import React, { useState, useEffect } from 'react';
import './Card.css';

const Card = ({ title, content, imageSrc }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const card = document.querySelector('.cardHome');

      if (card) {
        const cardTop = card.getBoundingClientRect().top;
        setIsVisible(cardTop < windowHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar visibilidad inicial

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    
    <div className={`cardHome ${isVisible ? 'visible' : ''}`}>
      <img src={imageSrc} alt="Card Image" className="cardHome-image"/>
      <div className="cardHome-content">
        <h2 className="cardHome-title">{title}</h2>
        <p>{content}</p>
      </div>
    </div>
    
  );
};

export default Card;
