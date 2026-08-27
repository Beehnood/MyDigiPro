import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./Http-service";
import { BlogService } from "./BlogService";

vi.mock("./Http-service", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("BlogService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("récupère tous les blogs", async () => {
    const blogs = [{ id: 1, title: "Mon blog" }];
    vi.mocked(api.get).mockResolvedValue({ data: blogs });

    await expect(BlogService.getAll()).resolves.toEqual(blogs);
    expect(api.get).toHaveBeenCalledWith("/blogs");
  });

  it("récupère un blog par son identifiant", async () => {
    const blog = { id: 4, title: "Cinéma" };
    vi.mocked(api.get).mockResolvedValue({ data: blog });

    await expect(BlogService.getById(4)).resolves.toEqual(blog);
    expect(api.get).toHaveBeenCalledWith("/blogs/4");
  });

  it("crée un blog avec les données du formulaire", async () => {
    const formData = new FormData();
    formData.append("title", "Nouveau blog");
    vi.mocked(api.post).mockResolvedValue({ data: { id: 2 } });

    await expect(BlogService.create(formData)).resolves.toEqual({ id: 2 });
    expect(api.post).toHaveBeenCalledWith("/blogs", formData);
  });

  it("propage une erreur quand la création échoue", async () => {
    const error = new Error("Échec de création");
    vi.mocked(api.post).mockRejectedValue(error);
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(BlogService.create(new FormData())).rejects.toBe(error);
  });

  it("supprime un blog par son identifiant", async () => {
    vi.mocked(api.delete).mockResolvedValue({ data: { success: true } });

    await expect(BlogService.deleteById(7)).resolves.toEqual({ success: true });
    expect(api.delete).toHaveBeenCalledWith("/blogs/7");
  });
});
