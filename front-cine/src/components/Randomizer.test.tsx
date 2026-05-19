import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Randomizer from "../components/Randomaizer";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { api } from "../service/Http-service";

vi.mock("../service/Http-service", () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockedApiGet = vi.mocked(api.get);

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom") as object),
  useNavigate: () => mockedNavigate,
}));

describe("Randomizer", () => {
  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it("affiche le bouton Randomizer", () => {
    render(<Randomizer />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le randomizer/i }));

    expect(screen.getByText(/lancer le tirage/i)).toBeInTheDocument();
  });

  it("affiche un film après clic sur le bouton", async () => {
    mockedApiGet.mockResolvedValueOnce({
      data: {
        id: 123,
        title: "Inception",
        poster_path: "/inception.jpg",
      },
    });

    render(<Randomizer />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le randomizer/i }));

    fireEvent.click(screen.getByRole("button", { name: /lancer le tirage/i }));

    expect(await screen.findByText("Inception")).toBeInTheDocument();
    expect(screen.getByAltText("Inception")).toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'échec", async () => {
    mockedApiGet.mockRejectedValueOnce({
      response: { data: { error: "Limite atteinte ou points insuffisants." } },
    });

    render(<Randomizer />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le randomizer/i }));

    fireEvent.click(screen.getByText(/lancer le tirage/i));

    expect(
      await screen.findByText(/limite atteinte ou points insuffisants/i)
    ).toBeInTheDocument();
  });
});
