import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import ClientDetailPage from "./pages/ClientDetailPage.jsx";

import "./App.css";

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="app-logo">
          <strong>Vambe · Insights</strong>
        </Link>

        <nav className="app-nav">
          <Link to="/" className="app-nav-link">Inicio</Link>
          <Link to="/dashboard" className="app-nav-link">Panel</Link>
          <Link to="/clientes" className="app-nav-link">Clientes</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/clientes/:id" element={<ClientDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
