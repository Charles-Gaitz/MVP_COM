import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import ExplorePage from './pages/ExplorePage.tsx';
import CommunityDetailPage from './pages/CommunityDetailPage.tsx';
import NewsDetailPage from './pages/NewsDetailPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import FavoritesPage from './pages/FavoritesPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import { UserProvider } from './contexts/UserContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </UserProvider>
  </React.StrictMode>,
);