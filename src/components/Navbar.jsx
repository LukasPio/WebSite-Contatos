import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="site-header">
      <nav className="navigation container" aria-label="Navegação principal">
        <Link className="brand" to={token ? "/contatos" : "/login"}>
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>Contatos<span className="brand-dot">.</span></span>
        </Link>
        <div className="nav-actions">
          {token ? (
            <>
              <NavLink className="nav-link" to="/contatos">Minha agenda</NavLink>
              <button className="button button-outline button-small" type="button" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink className="nav-link" to="/login">Entrar</NavLink>
              <NavLink className="button button-primary button-small" to="/registrar">Criar conta</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
