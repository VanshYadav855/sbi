import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import AlertQueuePage from './pages/AlertQueuePage';
import CustomerDetail from './pages/CustomerDetail';
import ScamLog from './pages/ScamLog';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import MirrorMind from './pages/MirrorMind';
import Login from './pages/Login';

function RequireAuth({ children }) {
  const location = useLocation();
  if (localStorage.getItem('sbi_auth') !== 'true') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function Layout() {
  return (
    <div className="app-shell min-h-screen min-w-dashboard">
      <Sidebar />
      <div className="ml-[240px] flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <footer className="px-6 py-3 border-t border-border text-[11px] text-muted text-center font-body">
          SahayakAI · Observe → Understand → Predict → Act → Protect · SBI Internal Tool · GFF 2026
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="alert-queue" element={<AlertQueuePage />} />
        <Route path="customer/:id" element={<CustomerDetail />} />
        <Route path="scam-log" element={<ScamLog />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="mirrormind" element={<MirrorMind />} />
        <Route path="customers" element={<Customers />} />
      </Route>
    </Routes>
  );
}
