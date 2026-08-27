import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Logout from "./Logout";

const mockedLogout = vi.fn();
const mockedNavigate = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ logout: mockedLogout }),
}));

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom") as object),
  useNavigate: () => mockedNavigate,
}));

describe("Logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("déconnecte l'utilisateur et le redirige vers la page de connexion", async () => {
    render(<Logout />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mockedLogout).toHaveBeenCalledOnce();
      expect(mockedNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
