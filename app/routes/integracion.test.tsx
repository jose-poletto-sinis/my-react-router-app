// app/routes/integration.vitest.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader as crearLoader, action as crearAction } from "./crear";
import { action as borrarAction } from "./borrar";

// 🔹 Mock fetch
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Test de Vitest puro", () => {
  it("crearLoader hace fetch y devuelve datos", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ idUnidad: 1, nombre: "Unidad Test" }],
    });

    const result = await crearLoader();
    expect(result).toEqual([{ idUnidad: 1, nombre: "Unidad Test" }]);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("crearAction hace fetch con POST", async () => {
    const mockFormData = {
      get: vi.fn().mockImplementation((key) => {
        if (key === "nombre") return "Test";
        if (key === "nombreCorto") return "T";
        return "";
      }),
      getAll: vi.fn().mockReturnValue([]),
    };
    const request = { formData: async () => mockFormData } as unknown as Request;

    (fetch as any).mockResolvedValueOnce({ ok: true });

    const result = await crearAction({ request });
    expect(result).toEqual({ resultado: "Atributo creado correctamente" });
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("borrarAction hace fetch DELETE", async () => {
    (fetch as any).mockResolvedValueOnce({ ok: true });
    const result = await borrarAction({ params: { id: "123" } });
    expect(result).toEqual({ resultado: "Atributo borrado correctamente" });
    expect(fetch).toHaveBeenCalledWith(
      "https://appcms.desarrollo.dnscheck.com.ar/Atributos/DeleteAtributo/IdAtributo/123",
      { method: "DELETE" }
    );
  });
});
