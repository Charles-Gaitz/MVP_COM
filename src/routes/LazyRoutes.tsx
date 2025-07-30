// Lazy-loaded route components for better performance
import { lazyLoad } from '../components/LoadingComponents';

// Lazy load main pages for route-level code splitting
export const ExplorePage = lazyLoad(() => import('../pages/ExplorePage'));
export const CommunityDetailPage = lazyLoad(() => import('../pages/CommunityDetailPage'));
export const ReportsPage = lazyLoad(() => import('../pages/ReportsPage'));
export const FavoritesPage = lazyLoad(() => import('../pages/FavoritesPage'));
export const AboutPage = lazyLoad(() => import('../pages/AboutPage_new'));
