import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PrivateRoute from "./PrivateRoute";

let mockedToken: string | null = null;

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ token: mockedToken }),
}));

const renderRoute = () =>
  render(
    <MemoryRouter initialEntries={["/private"]}>
      <Routes>
        <Route path="/login" element={<p>Page de connexion</p>} />
        <Route
          path="/private"
          element={
            <PrivateRoute>
              <p>Contenu privé</p>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

describe("PrivateRoute", () => {
  beforeEach(() => {
    mockedToken = null;
  });

  it("affiche le contenu privé quand un token existe", () => {
    mockedToken = "valid-token";
    renderRoute();

    expect(screen.getByText("Contenu privé")).toBeInTheDocument();
  });

  it("redirige vers la connexion quand aucun token n'existe", () => {
    renderRoute();

    expect(screen.getByText("Page de connexion")).toBeInTheDocument();
    expect(screen.queryByText("Contenu privé")).not.toBeInTheDocument();
  });
});
