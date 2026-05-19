import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Login from "./Login";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

const mockedNavigate = vi.fn();

// mock du contexte
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom") as object),
  useNavigate: () => mockedNavigate,
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "mock-token" }),
      })
    ) as unknown as typeof fetch;
  });

  it("affiche les champs email et mot de passe", () => {
    render(<Login />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it("envoie le formulaire et stocke le token", async () => {
    render(<Login />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8000/api/login",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      )
    );

    expect(localStorage.getItem("token")).toBe("mock-token");
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
