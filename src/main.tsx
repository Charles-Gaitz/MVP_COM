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
import NotFoundPage from './pages/NotFoundPage.tsx';
import { UserProvider } from './contexts/UserContext.tsx';
import { ComparisonProvider } from './contexts/ComparisonContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { ScrollToTop } from './components/ScrollToTop.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <ComparisonProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/community/:id" element={<CommunityDetailPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/compare" element={<ReportsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </ComparisonProvider>
      </UserProvider>
    </ErrorBoundary>
  </React.StrictMode>
);