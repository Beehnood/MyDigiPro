import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Randomizer from "../components/Randomaizer";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("Randomizer", () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it("affiche le bouton Randomizer", () => {
    render(<Randomizer />, { wrapper: MemoryRouter });
    expect(screen.getByText(/lancer le tirage/i)).toBeInTheDocument();
  });

  it("affiche un film après clic sur le bouton", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: 123,
        title: "Inception",
        poster_path: "/inception.jpg",
      },
    });

    render(<Randomizer />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: /lancer le tirage/i }));

    expect(await screen.findByText("Inception")).toBeInTheDocument();
    expect(screen.getByAltText("Inception")).toBeInTheDocument();
  });

  it("affiche un message d'erreur en cas d'échec", async () => {
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 403 } });

    render(<Randomizer />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/lancer le tirage/i));

    expect(
      await screen.findByText(/limite atteinte ou points insuffisants/i)
    ).toBeInTheDocument();
  });
});
