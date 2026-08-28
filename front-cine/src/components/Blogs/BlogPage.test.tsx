import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../service/Http-service";
import { BlogService } from "../../service/BlogService";
import BlogPage from "./BlogPage";

const mockedNavigate = vi.fn();
let mockedUser: { id: number; username: string } | null = { id: 3, username: "Alice" };

vi.mock("../../contexts/AuthContext", () => ({ useAuth: () => ({ user: mockedUser }) }));
vi.mock("../../service/Http-service", () => ({ api: { get: vi.fn() } }));
vi.mock("../../service/BlogService", () => ({ BlogService: { deleteById: vi.fn() } }));
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom") as object),
  useNavigate: () => mockedNavigate,
}));

const blog = {
  id: 12,
  title: "Mon article",
  content: "Contenu du blog",
  image: "cover.jpg",
  video: "movie.mp4",
  user: { id: 3, username: "Alice" },
};

const renderPage = () => render(
  <MemoryRouter initialEntries={["/blog/12"]}>
    <Routes><Route path="/blog/:id" element={<BlogPage />} /></Routes>
  </MemoryRouter>,
);

describe("BlogPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUser = { id: 3, username: "Alice" };
  });

  it("affiche l'article et permet à son auteur de le supprimer", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: blog });
    vi.mocked(BlogService.deleteById).mockResolvedValue({ success: true });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => undefined);
    renderPage();

    expect(await screen.findByRole("heading", { name: /Mon article/ })).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledWith("/blogs/12");
    expect(screen.getByAltText("Mon article")).toBeInTheDocument();
    expect(screen.getByText("Télécharger la vidéo")).toHaveAttribute("href", expect.stringContaining("movie.mp4"));

    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    await waitFor(() => expect(BlogService.deleteById).toHaveBeenCalledWith(12));
    expect(mockedNavigate).toHaveBeenCalledWith("/blogs");
  });

  it("annule la suppression si l'utilisateur refuse la confirmation", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: blog });
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Supprimer" }));
    expect(BlogService.deleteById).not.toHaveBeenCalled();
  });

  it("affiche une erreur quand le chargement échoue", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(api.get).mockRejectedValue(new Error("Erreur API"));
    renderPage();

    expect(await screen.findByText("Échec de la récupération du blog")).toBeInTheDocument();
  });
});
