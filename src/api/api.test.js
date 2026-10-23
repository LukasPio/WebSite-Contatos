import { describe, expect, it } from "vitest";
import api from "./api.js";

describe("Axios JWT", () => {
  it("anexa Authorization Bearer quando há JWT", async () => {
    localStorage.setItem("token", "meu-jwt");
    const result = await api.get("/contatos", {
      adapter: async (config) => ({ config, data: [], headers: {}, status: 200, statusText: "OK" }),
    });
    expect(result.config.headers.get("Authorization")).toBe("Bearer meu-jwt");
  });

  it("não envia Authorization quando não há JWT", async () => {
    const result = await api.get("/contatos", {
      adapter: async (config) => ({ config, data: [], headers: {}, status: 200, statusText: "OK" }),
    });
    expect(result.config.headers.get("Authorization")).toBeUndefined();
  });
});
