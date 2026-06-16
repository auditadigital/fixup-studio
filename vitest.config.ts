import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "apps/landing/test/server-only-stub.ts"),
    },
  },
  test: { include: ["packages/**/*.test.ts", "apps/**/*.test.ts"], environment: "node" },
});
