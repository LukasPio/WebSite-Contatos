import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../context/AuthContext.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

function renderRoutes() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/contatos"]}>
        <Routes>
          <Route path="/login" element={<p>Tela de login</p>} />
          <Route element={<PrivateRoute />}>
            <Route path="/contatos" element={<p>Agenda protegida</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("PrivateRoute", () => {
  it("redireciona visitantes sem JWT para o login", () => {
    renderRoutes();
    expect(screen.getByText("Tela de login")).toBeInTheDocument();
    expect(screen.queryByText("Agenda protegida")).not.toBeInTheDocument();
  });

  it("autoriza usuário com JWT salvo", () => {
    localStorage.setItem("token", "jwt-de-teste");
    renderRoutes();
    expect(screen.getByText("Agenda protegida")).toBeInTheDocument();
  });
});
