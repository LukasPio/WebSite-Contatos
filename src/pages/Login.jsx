import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { getErrorMessage } from "../api/errors.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogin(event) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/usuarios/login", { email: email.trim(), senha });
      login(response.data?.token);
      const requestedPath = location.state?.from?.pathname;
      navigate(requestedPath?.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/contatos", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Falha no login. Verifique o e-mail e a senha."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-intro">
        <span className="eyebrow">SUA AGENDA, EM UM SÓ LUGAR</span>
        <h1>Seus contatos, organizados.</h1>
        <p>Uma agenda pessoal simples para guardar as pessoas importantes e acessar seus dados com sua conta.</p>
        <div className="feature-list">
          <span><span aria-hidden="true">✓</span> Acesso autenticado</span>
          <span><span aria-hidden="true">✓</span> Contatos vinculados à sua conta</span>
          <span><span aria-hidden="true">✓</span> Tudo sincronizado com a API</span>
        </div>
      </div>

      <div className="card auth-card">
        <span className="eyebrow">BEM-VINDO DE VOLTA</span>
        <h2>Entre na sua conta</h2>
        <p className="muted">Informe suas credenciais para acessar sua agenda.</p>
        {location.state?.notice && <p className="notice success" role="status">{location.state.notice}</p>}
        {error && <p className="notice error" role="alert">{error}</p>}
        <form onSubmit={handleLogin} className="form-stack">
          <label htmlFor="login-email">E-mail</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          <label htmlFor="login-password">Senha</label>
          <input id="login-password" type="password" autoComplete="current-password" placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required disabled={loading} />
          <button className="button button-primary full-width" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        </form>
        <p className="form-footer">Ainda não tem conta? <Link to="/registrar">Cadastre-se</Link></p>
      </div>
    </section>
  );
}
