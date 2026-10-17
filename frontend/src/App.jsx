import { lazy, Suspense } from 'react';
import PortfolioPage from './pages/PortfolioPage.jsx';

const AdminPage = lazy(() => import('./admin/AdminPage.jsx'));

export default function App() {
  if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
    return <Suspense fallback={null}><AdminPage /></Suspense>;
  }
  return <PortfolioPage />;
}