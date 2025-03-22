import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Places() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('https://ikhvbot-server.onrender.com/api/places')
      .then(response => setPlaces(response.data))
      .catch(error => console.error('Ошибка:', error));
  }, []);

  // Функция для форматирования текста с переносами строк
  const formatDescription = (text) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="description-line">{line}</p>
    ));
  };

  return (
    <div className="places-list">
      <h1>Места Хабаровска</h1>
      {places.map(place => (
        <div key={place._id} className="place-item">
          <h2>{place.name}</h2>
          <div className="description">{formatDescription(place.description)}</div>
          <img src={place.image} alt={place.name} />
        </div>
      ))}
    </div>
  );
}

export default Places;