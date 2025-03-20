import React, { useState, useEffect } from 'react';
import axios from 'axios';

function News() {
  const [news, setNews] = useState([]);
  useEffect(() => {
    axios.get('https://ikhvbot-server.onrender.com/api/news')
      .then(response => setNews(response.data))
      .catch(error => console.error('Ошибка:', error));
  }, []);
  return (
    <div className="news-list">
      <h1>Новости Хабаровска</h1>
      {news.map(item => (
        <div key={item._id} className="news-item">
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <img src={item.image} alt={item.title} />
        </div>
      ))}
    </div>
  );
}
export default News;
