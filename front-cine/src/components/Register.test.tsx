import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../service/Http-service";
import { Register } from "./Register";

const mockedNavigate = vi.fn();

vi.mock("../service/Http-service", () => ({ api: { get: vi.fn() } }));
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom") as object),
  useNavigate: () => mockedNavigate,
}));

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comédie" },
  { id: 3, name: "Drame" },
];

const fillForm = (password: string) => {
  fireEvent.change(screen.getByLabelText("Nom d'utilisateur"), { target: { value: "Alice" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@test.fr" } });
  fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: password } });
};

const submitForm = () =>
  fireEvent.submit(screen.getByRole("button", { name: "S'inscrire" }).closest("form")!);

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue({ data: genres });
    vi.stubGlobal("fetch", vi.fn());
  });

  it("ouvre et ferme la modale d'inscription", async () => {
    render(<Register />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: "Inscription" }));
    expect(await screen.findByRole("heading", { name: "Inscription" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(screen.queryByRole("heading", { name: "Inscription" })).not.toBeInTheDocument();
  });

  it("affiche les erreurs de mot de passe et de genres", async () => {
    render(<Register isPage />, { wrapper: MemoryRouter });
    fillForm("court");
    submitForm();
    expect(await screen.findByText(/au moins 8 caractères/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "abcdefgh1" } });
    submitForm();
    expect(await screen.findByText(/une lettre majuscule/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "ABCDEFGH1" } });
    submitForm();
    expect(await screen.findByText(/une lettre minuscule/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "Abcdefgh" } });
    submitForm();
    expect(await screen.findByText(/au moins un chiffre/)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "Abcdefg1" } });
    submitForm();
    expect(await screen.findByText(/choisir 3 genres/)).toBeInTheDocument();
  });

  it("envoie un formulaire valide et redirige vers la connexion", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
    render(<Register isPage />, { wrapper: MemoryRouter });
    fillForm("Password1");

    const selects = await screen.findAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "Action" } });
    fireEvent.change(selects[1], { target: { value: "Comédie" } });
    fireEvent.change(selects[2], { target: { value: "Drame" } });
    fireEvent.click(screen.getByRole("button", { name: "S'inscrire" }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/register$/),
      expect.objectContaining({ method: "POST" }),
    ));
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });

  it("utilise les genres de secours si leur chargement échoue", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("API indisponible"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(<Register isPage />, { wrapper: MemoryRouter });

    expect(await screen.findAllByRole("option", { name: "Science-Fiction" })).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
});
