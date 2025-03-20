import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Places() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('https://ikhvbot-server.onrender.com/api/places')
      .then(response => setPlaces(response.data))
      .catch(error => console.error('Ошибка:', error));
  }, []);
  return (
    <div className="places-list">
      <h1>Места Хабаровска</h1>
      {places.map(place => (
        <div key={place._id} className="place-item">
          <h2>{place.name}</h2>
          <p>{place.description}</p>
          <img src={place.image} alt={place.name} />
        </div>
      ))}
    </div>
  );
}
export default Places;
