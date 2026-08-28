import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "./Navbar";

let mockedToken: string | null = null;
const mockedLogout = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ token: mockedToken, logout: mockedLogout }),
}));
vi.mock("./Randomaizer", () => ({ default: () => <span>Randomizer</span> }));
vi.mock("./Login", () => ({ default: () => <button>Connexion</button> }));
vi.mock("./Register", () => ({ Register: () => <button>Inscription</button> }));

describe("Navbar", () => {
  beforeEach(() => {
    mockedToken = null;
    vi.clearAllMocks();
  });

  it("affiche les actions publiques sans token", () => {
    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByAltText("CineSpin")).toBeInTheDocument();
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByText("Inscription")).toBeInTheDocument();
  });

  it("affiche les liens privés et déconnecte l'utilisateur", () => {
    mockedToken = "token";
    render(<Navbar />, { wrapper: MemoryRouter });
    expect(screen.getByText("Accueil")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /signout/i })[0]);
    expect(mockedLogout).toHaveBeenCalledOnce();
  });

  it("ouvre puis referme le menu mobile", () => {
    mockedToken = "token";
    render(<Navbar />, { wrapper: MemoryRouter });
    const menu = screen.getByRole("button", { name: "Ouvrir le menu" });
    fireEvent.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByRole("link", { name: "Profil" }));
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });
});
