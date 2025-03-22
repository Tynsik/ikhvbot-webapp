import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [news, setNews] = useState([]);
  const [places, setPlaces] = useState([]);
  const [form, setForm] = useState({ type: 'news', title: '', description: '', source: '', image: '', name: '', category: '', lat: '', lng: '' });

  // Загрузка данных
  useEffect(() => {
    axios.get('https://ikhvbot-server.onrender.com/api/news').then(res => setNews(res.data));
    axios.get('https://ikhvbot-server.onrender.com/api/places').then(res => setPlaces(res.data));
  }, []);

  // Авторизация
  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  // Добавление или редактирование
  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: token };
    const url = form.type === 'news' ? '/api/news' : '/api/places';
    const data = form.type === 'news'
      ? { title: form.title, description: form.description, source: form.source, image: form.image }
      : { name: form.name, category: form.category, description: form.description, location: { lat: Number(form.lat), lng: Number(form.lng) }, image: form.image };

    try {
      await axios.post(`https://ikhvbot-server.onrender.com${url}`, data, { headers });
      alert('Контент добавлен');
      setForm({ type: 'news', title: '', description: '', source: '', image: '', name: '', category: '', lat: '', lng: '' });
      refreshData();
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.error || 'Неизвестная ошибка'));
    }
  };

  // Удаление
  const handleDelete = async (type, id) => {
    const headers = { Authorization: token };
    try {
      await axios.delete(`https://ikhvbot-server.onrender.com/api/${type}/${id}`, { headers });
      alert('Контент удалён');
      refreshData();
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.error || 'Неизвестная ошибка'));
    }
  };

  // Обновление данных
  const refreshData = () => {
    axios.get('https://ikhvbot-server.onrender.com/api/news').then(res => setNews(res.data));
    axios.get('https://ikhvbot-server.onrender.com/api/places').then(res => setPlaces(res.data));
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-panel">
        <h1>Вход в админку</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Введите токен"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button type="submit">Войти</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Админка</h1>
      <button onClick={() => { localStorage.removeItem('adminToken'); setIsAuthenticated(false); }}>Выйти</button>
      <h2>Добавить контент</h2>
      <form onSubmit={handleSubmit}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="news">Новость</option>
          <option value="places">Место</option>
        </select>
        {form.type === 'news' ? (
          <>
            <input placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Источник" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
            <input placeholder="URL изображения" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </>
        ) : (
          <>
            <input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Категория" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Широта" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            <input placeholder="Долгота" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
            <input placeholder="URL изображения" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </>
        )}
        <button type="submit">Добавить</button>
      </form>

      <h2>Текущие новости</h2>
      {news.map(item => (
        <div key={item._id} className="content-item">
          <p>{item.title} - {item.description}</p>
          <button onClick={() => handleDelete('news', item._id)}>Удалить</button>
        </div>
      ))}

      <h2>Текущие места</h2>
      {places.map(item => (
        <div key={item._id} className="content-item">
          <p>{item.name} - {item.description}</p>
          <button onClick={() => handleDelete('places', item._id)}>Удалить</button>
        </div>
      ))}
    </div>
  );
}

export default Admin;
