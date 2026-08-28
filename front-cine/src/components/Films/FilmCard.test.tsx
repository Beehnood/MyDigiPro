import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FilmCard from "./FilmCard";

describe("FilmCard", () => {
  it("construit l'URL de l'affiche et utilise le placeholder en cas d'erreur", () => {
    render(<FilmCard film={{ id: 1, title: "Film", poster_path: "/film.jpg" }} baseUrl="https://img/" placeholderUrl="fallback.jpg" />);
    const image = screen.getByAltText("Film") as HTMLImageElement;
    expect(image.src).toContain("https://img//film.jpg");
    fireEvent.error(image);
    expect(image.src).toContain("fallback.jpg");
  });

  it("affiche un message lorsqu'aucune image n'existe", () => {
    render(<FilmCard film={{ id: 2, title: "Sans affiche" }} baseUrl="" placeholderUrl="" />);
    expect(screen.getByText("Pas d'image")).toBeInTheDocument();
  });
});
