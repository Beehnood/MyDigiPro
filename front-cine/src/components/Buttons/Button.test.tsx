import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it.each([
    ["primary", "rgb(0, 75, 251)"],
    ["secondary", "gray"],
    ["danger", "rgb(139, 0, 0)"],
    ["success", "rgb(43, 177, 6)"],
    ["warning", "rgb(255, 222, 7)"],
  ] as const)("applique la variante %s", (variant, color) => {
    render(<Button variant={variant}>Action</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).style.backgroundColor).toBe(color);
  });

  it("transmet le clic et les styles personnalisés", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} style={{ color: "purple" }}>Action</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
    expect((screen.getByRole("button") as HTMLButtonElement).style.color).toBe("purple");
  });
});
