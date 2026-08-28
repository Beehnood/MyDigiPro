import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ExitProvider, useExit } from "./ExitContext";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom") as object),
  useNavigate: () => mockedNavigate,
}));

const Consumer = () => {
  const { goBack } = useExit();
  return <button onClick={goBack}>Retour</button>;
};

describe("ExitContext", () => {
  it("revient à la page précédente", () => {
    render(<MemoryRouter><ExitProvider><Consumer /></ExitProvider></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Retour" }));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it("signale une utilisation sans provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => render(<Consumer />)).toThrow(/ExitProvider/);
  });
});
