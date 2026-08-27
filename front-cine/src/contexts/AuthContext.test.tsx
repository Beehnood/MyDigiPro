import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom") as object),
  useNavigate: () => mockedNavigate,
}));

const Consumer = () => {
  const { token, user, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="token">{token ?? "aucun"}</span>
      <span data-testid="user">{user?.username ?? "aucun"}</span>
      <button onClick={() => login("new-token")}>Connexion</button>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
};

const renderProvider = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    </MemoryRouter>,
  );

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("enregistre le token lors de la connexion", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ username: "Alice", email: "a@a.fr", interests: null }),
    } as Response);
    renderProvider();

    await act(async () => screen.getByRole("button", { name: "Connexion" }).click());

    expect(localStorage.getItem("token")).toBe("new-token");
    expect(screen.getByTestId("token")).toHaveTextContent("new-token");
    await waitFor(() => expect(screen.getByTestId("user")).toHaveTextContent("Alice"));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/me$/),
      { headers: { Authorization: "Bearer new-token" } },
    );
  });

  it("supprime la session et redirige lors de la déconnexion", async () => {
    localStorage.setItem("token", "saved-token");
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ username: "Alice", email: "a@a.fr", interests: null }),
    } as Response);
    renderProvider();

    await waitFor(() => expect(screen.getByTestId("user")).toHaveTextContent("Alice"));
    await act(async () => screen.getByRole("button", { name: "Déconnexion" }).click());

    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByTestId("token")).toHaveTextContent("aucun");
    expect(screen.getByTestId("user")).toHaveTextContent("aucun");
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });

  it("déconnecte l'utilisateur si la récupération du profil échoue", async () => {
    localStorage.setItem("token", "expired-token");
    vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);
    renderProvider();

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("/login"));
    expect(localStorage.getItem("token")).toBeNull();
  });
});
