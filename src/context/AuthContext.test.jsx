import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext.jsx";

function AuthProbe() {
  const { token, login, logout } = useAuth();
  return (
    <div>
      <output data-testid="token">{token ?? "deslogado"}</output>
      <button onClick={() => login("jwt-de-teste")}>Entrar</button>
      <button onClick={logout}>Sair</button>
    </div>
  );
}

describe("AuthProvider", () => {
  it("salva o JWT no estado e localStorage e remove no logout", () => {
    render(<AuthProvider><AuthProbe /></AuthProvider>);
    expect(screen.getByTestId("token")).toHaveTextContent("deslogado");

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    expect(screen.getByTestId("token")).toHaveTextContent("jwt-de-teste");
    expect(localStorage.getItem("token")).toBe("jwt-de-teste");

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));
    expect(screen.getByTestId("token")).toHaveTextContent("deslogado");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("restaura uma sessão salva no localStorage", () => {
    localStorage.setItem("token", "sessao-existente");
    render(<AuthProvider><AuthProbe /></AuthProvider>);
    expect(screen.getByTestId("token")).toHaveTextContent("sessao-existente");
  });
});
