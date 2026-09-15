import { render, screen, fireEvent } from "@testing-library/react";
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
    mockedNavigate.mockReset();
  });

  it("affiche le bouton Randomizer", () => {
    render(<Randomizer />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le randomizer/i }));

    expect(screen.getByText(/lancer le tirage/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Emplacement film/)).toHaveLength(3);
  });

  it("ajoute un film par tirage en conservant les précédents et permet de choisir", async () => {
    mockedApiGet
      .mockResolvedValueOnce({ data: { id: 123, title: "Inception", poster_path: "/inception.jpg" } })
      .mockResolvedValueOnce({ data: { id: 456, title: "Interstellar", poster_path: "https://image.tmdb.org/t/p/w200/interstellar.jpg" } })
      .mockResolvedValueOnce({ data: { id: 789, title: "Tenet", poster_path: null } });

    render(<Randomizer />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le randomizer/i }));

    fireEvent.click(screen.getByRole("button", { name: /lancer le tirage/i }));

    expect(await screen.findByText("Inception")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Choisir / })).toHaveLength(1);
    expect(screen.getAllByLabelText(/Emplacement film/)).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: /lancer le tirage/i }));
    expect(await screen.findByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Emplacement film/)).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: /lancer le tirage/i }));
    expect(await screen.findByText("Tenet")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Choisir / })).toHaveLength(3);
    const completedButton = screen.getByRole("button", { name: /les 3 films sont proposés/i });
    expect(completedButton).toBeDisabled();
    fireEvent.click(completedButton);
    expect(screen.queryByLabelText("Emplacement film 1")).not.toBeInTheDocument();
    expect(screen.getByAltText("Inception")).toHaveAttribute("src", "https://image.tmdb.org/t/p/w200/inception.jpg");
    expect(screen.getByAltText("Interstellar")).toHaveAttribute("src", "https://image.tmdb.org/t/p/w200/interstellar.jpg");
    expect(screen.getByText("Affiche indisponible")).toBeInTheDocument();
    expect(mockedApiGet).toHaveBeenCalledTimes(3);
    fireEvent.click(screen.getByRole("button", { name: "Choisir Interstellar" }));
    expect(mockedNavigate).toHaveBeenCalledWith("/film/456");
    expect(screen.queryByText(/lancer le tirage/i)).not.toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'échec", async () => {
    mockedApiGet.mockResolvedValueOnce({ data: { id: 123, title: "Inception", poster_path: null } });
    mockedApiGet.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { error: "Limite atteinte ou points insuffisants." } },
    });

    render(<Randomizer />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le randomizer/i }));

    fireEvent.click(screen.getByText(/lancer le tirage/i));
    await screen.findByText("Inception");
    fireEvent.click(screen.getByText(/lancer le tirage/i));

    expect(
      await screen.findByText(/limite atteinte ou points insuffisants/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Emplacement film/)).toHaveLength(2);
  });
});
