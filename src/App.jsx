import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Registrar from "./pages/Registrar.jsx";
import Contatos from "./pages/Contatos.jsx";

function GuestRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/contatos" replace /> : children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container page">
        <Routes>
          <Route path="/" element={<Navigate to="/contatos" replace />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/registrar" element={<GuestRoute><Registrar /></GuestRoute>} />
          <Route element={<PrivateRoute />}>
            <Route path="/contatos" element={<Contatos />} />
          </Route>
          <Route path="*" element={<Navigate to="/contatos" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">Projeto React + JWT · Agenda de contatos</footer>
    </BrowserRouter>
  );
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
