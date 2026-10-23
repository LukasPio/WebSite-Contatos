import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { getErrorMessage } from "../api/errors.js";

export default function Registrar() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await api.post("/usuarios/registrar", { nome: nome.trim(), email: email.trim(), senha });
      navigate("/login", { replace: true, state: { notice: "Conta criada com sucesso! Faça login para continuar." } });
    } catch (err) {
      setError(getErrorMessage(err, "Não foi possível criar a conta. Verifique os dados ou tente outro e-mail."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-intro">
        <span className="eyebrow">COMECE AGORA</span>
        <h1>Uma agenda para chamar de sua.</h1>
        <p>Crie sua conta e mantenha seus contatos separados e protegidos por autenticação.</p>
        <div className="feature-list">
          <span><span aria-hidden="true">✓</span> Cadastro simples</span>
          <span><span aria-hidden="true">✓</span> Login com JWT</span>
          <span><span aria-hidden="true">✓</span> Lista pessoal de contatos</span>
        </div>
      </div>

      <div className="card auth-card">
        <span className="eyebrow">CRIAR CONTA</span>
        <h2>Faça seu cadastro</h2>
        <p className="muted">Preencha os dados abaixo para começar.</p>
        {error && <p className="notice error" role="alert">{error}</p>}
        <form onSubmit={handleRegister} className="form-stack">
          <label htmlFor="register-name">Nome</label>
          <input id="register-name" type="text" autoComplete="name" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required minLength={2} disabled={loading} />
          <label htmlFor="register-email">E-mail</label>
          <input id="register-email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          <label htmlFor="register-password">Senha</label>
          <input id="register-password" type="password" autoComplete="new-password" placeholder="Escolha uma senha" value={senha} onChange={(e) => setSenha(e.target.value)} required disabled={loading} />
          <button className="button button-primary full-width" type="submit" disabled={loading}>{loading ? "Criando conta..." : "Criar conta"}</button>
        </form>
        <p className="form-footer">Já tem conta? <Link to="/login">Entrar</Link></p>
      </div>
    </section>
  );
}
