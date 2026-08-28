import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Collection } from "./Collection";
import { Home } from "./Home";
import { Login_page } from "./Login_page";
import { Register_page } from "./Register_page";
import { UserProfile } from "./UserProfile";
import { BlogsList_page } from "./Blogs-Pages/Blogs";
import { CreateBlog_page } from "./Blogs-Pages/CreateBlog_page";
import { FilmProduit_page } from "./Films-Pages/FilmProduit_page";
import { Film_page } from "./Films-Pages/Films_page";

vi.mock("../layouts/MainLayout", () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <main data-testid="layout">{children}</main>,
}));
vi.mock("../components/Collections", () => ({ default: () => <span>Collections</span> }));
vi.mock("../components/Films/FilmsNowPlaying", () => ({ FilmsNowPlaying: () => <span>Films actuels</span> }));
vi.mock("../components/Films/FilmsPopular", () => ({ FilmsPopular: () => <span>Films populaires</span> }));
vi.mock("../components/Blogs/BlogSection", () => ({ BlogSection: () => <span>Section blog</span> }));
vi.mock("../components/Login", () => ({ default: ({ isPage }: { isPage?: boolean }) => <span>Login {String(isPage)}</span> }));
vi.mock("../components/Register", () => ({ Register: ({ isPage }: { isPage?: boolean }) => <span>Register {String(isPage)}</span> }));
vi.mock("../components/Profile", () => ({ default: () => <span>Profil</span> }));
vi.mock("../components/Blogs/BlogList", () => ({ default: () => <span>Liste blogs</span> }));
vi.mock("../components/Blogs/CreateBlog", () => ({ CreateBlog: () => <span>Créer blog</span> }));
vi.mock("../components/Films/FilmProduit", () => ({ FilmProduit: () => <span>Produit film</span> }));

describe("Pages", () => {
  it.each([
    [Collection, "Collections"],
    [Home, "Section blog"],
    [Login_page, "Login true"],
    [Register_page, "Register true"],
    [UserProfile, "Profil"],
    [BlogsList_page, "Liste blogs"],
    [CreateBlog_page, "Créer blog"],
    [FilmProduit_page, "Produit film"],
    [Film_page, "Films populaires"],
  ])("rend la page dans le layout principal", (Page, expectedContent) => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    render(<Page />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByText(expectedContent)).toBeInTheDocument();
  });
});
