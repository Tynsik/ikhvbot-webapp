import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [news, setNews] = useState([]);
  const [places, setPlaces] = useState([]);
  const [form, setForm] = useState({ id: null, type: 'news', title: '', description: '', source: '', image: '', name: '', category: '', lat: '', lng: '' });

  useEffect(() => {
    axios.get('https://ikhvbot-server.onrender.com/api/news').then(res => setNews(res.data));
    axios.get('https://ikhvbot-server.onrender.com/api/places').then(res => setPlaces(res.data));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: token };
    const url = form.type === 'news' ? '/api/news' : '/api/places';
    const data = form.type === 'news'
      ? { title: form.title, description: form.description, source: form.source, image: form.image }
      : { name: form.name, category: form.category, description: form.description, location: { lat: Number(form.lat), lng: Number(form.lng) }, image: form.image };

    try {
      if (form.id) {
        await axios.put(`https://ikhvbot-server.onrender.com${url}/${form.id}`, data, { headers });
        alert('Контент обновлён');
      } else {
        await axios.post(`https://ikhvbot-server.onrender.com${url}`, data, { headers });
        alert('Контент добавлен');
      }
      setForm({ id: null, type: 'news', title: '', description: '', source: '', image: '', name: '', category: '', lat: '', lng: '' });
      refreshData();
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.error || 'Неизвестная ошибка'));
    }
  };

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

  const handleEdit = (item, type) => {
    if (type === 'news') {
      setForm({
        id: item._id,
        type: 'news',
        title: item.title,
        description: item.description,
        source: item.source,
        image: item.image,
        name: '', category: '', lat: '', lng: ''
      });
    } else {
      setForm({
        id: item._id,
        type: 'places',
        title: '',
        description: item.description,
        source: '',
        image: item.image,
        name: item.name,
        category: item.category,
        lat: item.location.lat.toString(),
        lng: item.location.lng.toString()
      });
    }
  };

  const refreshData = () => {
    axios.get('https://ikhvbot-server.onrender.com/api/news').then(res => setNews(res.data));
    axios.get('https://ikhvbot-server.onrender.com/api/places').then(res => setPlaces(res.data));
  };

  const handleReset = () => {
    setForm({ id: null, type: 'news', title: '', description: '', source: '', image: '', name: '', category: '', lat: '', lng: '' });
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
      <h2>{form.id ? 'Редактировать контент' : 'Добавить контент'}</h2>
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
        <button type="submit">{form.id ? 'Сохранить изменения' : 'Добавить'}</button>
        {form.id && <button type="button" onClick={handleReset}>Отменить редактирование</button>}
      </form>

      <h2>Текущие новости</h2>
      {news.map(item => (
        <div key={item._id} className="content-item">
          <p>{item.title} - {item.description}</p>
          <div>
            <button onClick={() => handleEdit(item, 'news')}>Редактировать</button>
            <button onClick={() => handleDelete('news', item._id)}>Удалить</button>
          </div>
        </div>
      ))}

      <h2>Текущие места</h2>
      {places.map(item => (
        <div key={item._id} className="content-item">
          <p>{item.name} - {item.description}</p>
          <div>
            <button onClick={() => handleEdit(item, 'places')}>Редактировать</button>
            <button onClick={() => handleDelete('places', item._id)}>Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;