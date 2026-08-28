import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requestHandler: undefined as undefined | ((config: any) => any),
  responseSuccess: undefined as undefined | ((response: any) => any),
  responseError: undefined as undefined | ((error: any) => Promise<never>),
  toastError: vi.fn(),
  fakeApi: {
    interceptors: {
      request: { use: vi.fn((handler) => { mocks.requestHandler = handler; }) },
      response: { use: vi.fn((success, error) => {
        mocks.responseSuccess = success;
        mocks.responseError = error;
      }) },
    },
  },
}));

vi.mock("axios", () => ({
  default: { create: vi.fn(() => mocks.fakeApi) },
}));
vi.mock("react-toastify", () => ({ toast: { error: mocks.toastError } }));

await import("./Http-service");

describe("Http-service", () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.toastError.mockClear();
  });

  it("ajoute le token Bearer aux requêtes authentifiées", () => {
    localStorage.setItem("token", "secret-token");
    const config = { headers: {} as Record<string, string> };

    expect(mocks.requestHandler?.(config)).toBe(config);
    expect(config.headers.Authorization).toBe("Bearer secret-token");
  });

  it("laisse intacte une requête sans token", () => {
    const config = { headers: {} as Record<string, string> };
    mocks.requestHandler?.(config);
    expect(config.headers.Authorization).toBeUndefined();
  });

  it("retourne les réponses réussies sans modification", () => {
    const response = { data: { success: true } };
    expect(mocks.responseSuccess?.(response)).toBe(response);
  });

  it("affiche le message de l'API et propage l'erreur", async () => {
    const error = { response: { data: { message: "Accès refusé" } } };
    await expect(mocks.responseError?.(error)).rejects.toBe(error);
    expect(mocks.toastError).toHaveBeenCalledWith("Accès refusé");
  });

  it("affiche un message explicite lorsque le serveur est inaccessible", async () => {
    const error = new Error("Network Error");
    await expect(mocks.responseError?.(error)).rejects.toBe(error);
    expect(mocks.toastError).toHaveBeenCalledWith(expect.stringContaining("Serveur API inaccessible"));
  });
});
