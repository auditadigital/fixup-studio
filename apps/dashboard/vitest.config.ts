import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { include: ["src/**/*.test.ts"], environment: "node" },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      // repo.ts es server-only → stub para los tests (reusa el de landing).
      "server-only": path.resolve(
        new URL("..", import.meta.url).pathname,
        "landing/test/server-only-stub.ts",
      ),
    },
  },
});
