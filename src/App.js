import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import News from './pages/News';
import Places from './pages/Places';
import './App.css';

function App() {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#007bff');
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>iKHVbot</h1>
          <nav className="nav">
            <Link to="/">Главная</Link>
            <Link to="/news">Новости</Link>
            <Link to="/places">Места</Link>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/places" element={<Places />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2025 iKHVbot</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
