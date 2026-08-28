import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BlogService } from "../../service/BlogService";
import BlogList from "./BlogList";

vi.mock("../../service/BlogService", () => ({
  BlogService: { getAll: vi.fn() },
}));

describe("BlogList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("charge et affiche les articles du plus récent au plus ancien", async () => {
    vi.mocked(BlogService.getAll).mockResolvedValue([
      { id: 1, title: "Ancien", content: "Texte", image: "old.jpg", createdAt: "2025-01-01", updatedAt: "2025-01-02" },
      { id: 2, title: "Récent", content: "Vidéo", video: "new.mp4", createdAt: "2026-01-01", updatedAt: "2026-01-02" },
    ]);
    render(<MemoryRouter><BlogList /></MemoryRouter>);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
    const headings = await screen.findAllByRole("heading", { level: 2 });
    expect(headings.map((heading) => heading.textContent)).toEqual(["Récent", "Ancien"]);
    expect(screen.getByAltText("Ancien")).toHaveAttribute("src", expect.stringContaining("old.jpg"));
    expect(screen.getByText("Télécharger")).toHaveAttribute("href", expect.stringContaining("new.mp4"));
  });

  it("retire le chargement même si l'API échoue", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(BlogService.getAll).mockRejectedValue(new Error("Erreur API"));
    render(<MemoryRouter><BlogList /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: /derniers articles/i })).toBeInTheDocument();
    expect(screen.queryByText("Chargement...")).not.toBeInTheDocument();
  });
});
