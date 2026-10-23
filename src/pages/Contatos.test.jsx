import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "../api/api.js";
import { AuthProvider } from "../context/AuthContext.jsx";
import Contatos from "./Contatos.jsx";

vi.mock("../api/api.js", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe("Contatos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "jwt-de-teste");
  });

  it("mostra estado vazio após carregar a agenda", async () => {
    api.get.mockResolvedValue({ data: [] });
    render(<AuthProvider><MemoryRouter><Contatos /></MemoryRouter></AuthProvider>);
    expect(await screen.findByText("Sua agenda está vazia")).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith("/contatos", expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it("cria um contato e atualiza a lista", async () => {
    const contact = { _id: "1", nome: "Ana", email: "ana@exemplo.com" };
    api.get.mockResolvedValueOnce({ data: [] }).mockResolvedValueOnce({ data: [contact] });
    api.post.mockResolvedValue({ data: contact });
    const user = userEvent.setup();
    render(<AuthProvider><MemoryRouter><Contatos /></MemoryRouter></AuthProvider>);
    await screen.findByText("Sua agenda está vazia");
    await user.type(screen.getByLabelText("Nome"), "Ana");
    await user.type(screen.getByLabelText("E-mail"), "ana@exemplo.com");
    await user.click(screen.getByRole("button", { name: "Adicionar contato" }));
    await waitFor(() => expect(screen.getByText("Ana")).toBeInTheDocument());
    expect(api.post).toHaveBeenCalledWith("/contatos", { nome: "Ana", email: "ana@exemplo.com" });
    expect(screen.getByText("ana@exemplo.com")).toBeInTheDocument();
  });
});
