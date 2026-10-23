import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { getErrorMessage } from "../api/errors.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Contatos() {
  const [contatos, setContatos] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleApiError = useCallback((err, fallback) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      logout();
      navigate("/login", { replace: true, state: { notice: "Sua sessão expirou. Entre novamente." } });
      return null;
    }
    return getErrorMessage(err, fallback);
  }, [logout, navigate]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api.get("/contatos", { signal: controller.signal })
      .then((response) => {
        if (!Array.isArray(response.data)) throw new Error("Formato inesperado da resposta.");
        setContatos(response.data);
        setError("");
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(handleApiError(err, "Não foi possível carregar seus contatos."));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [handleApiError]);

  async function criarContato(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError("");
    try {
      await api.post("/contatos", { nome: nome.trim(), email: email.trim() });
      setNome("");
      setEmail("");
      const response = await api.get("/contatos");
      if (!Array.isArray(response.data)) throw new Error("Formato inesperado da resposta.");
      setContatos(response.data);
      setError("");
    } catch (err) {
      setFormError(handleApiError(err, "Não foi possível adicionar o contato. Atualize a lista para conferir o resultado."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="contacts-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">MINHA AGENDA</span>
          <h1>Seus contatos</h1>
          <p className="muted">Guarde e consulte os contatos da sua conta em um só lugar.</p>
        </div>
        <span className="count-badge">{contatos.length} {contatos.length === 1 ? "contato" : "contatos"}</span>
      </div>

      <div className="contacts-layout">
        <div className="card new-contact">
          <div className="section-title">
            <span className="section-icon" aria-hidden="true">+</span>
            <div><h2>Novo contato</h2><p className="muted">Adicione alguém à sua agenda.</p></div>
          </div>
          {formError && <p className="notice error" role="alert">{formError}</p>}
          <form className="form-stack" onSubmit={criarContato}>
            <label htmlFor="contact-name">Nome</label>
            <input id="contact-name" type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={saving} />
            <label htmlFor="contact-email">E-mail</label>
            <input id="contact-email" type="email" placeholder="nome@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={saving} />
            <button className="button button-primary full-width" type="submit" disabled={saving}>{saving ? "Salvando..." : "Adicionar contato"}</button>
          </form>
        </div>

        <div className="card contact-list">
          <div className="list-title">
            <div><h2>Lista de contatos</h2><p className="muted">Pessoas cadastradas na sua agenda</p></div>
            <button className="button button-outline button-small" type="button" onClick={() => window.location.reload()} disabled={loading}>Atualizar</button>
          </div>
          {loading ? (
            <p className="empty-state" role="status">Carregando contatos...</p>
          ) : error ? (
            <p className="notice error" role="alert">{error}</p>
          ) : contatos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">◎</span>
              <h3>Sua agenda está vazia</h3>
              <p>Cadastre seu primeiro contato usando o formulário ao lado.</p>
            </div>
          ) : (
            <ul className="contacts-items">
              {contatos.map((contato) => (
                <li className="contact-row" key={contato._id}>
                  <span className="avatar" aria-hidden="true">{(contato.nome || "?").charAt(0).toUpperCase()}</span>
                  <div className="contact-details">
                    <strong>{contato.nome}</strong>
                    <a href={"mailto:" + contato.email}>{contato.email}</a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
