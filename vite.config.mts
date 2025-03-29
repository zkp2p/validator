import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["**/node_modules/**", "**/index.ts"],
    },
    exclude: ["**/node_modules/**", "**/index.ts", "**/client/**"],
    globals: true,
    restoreMocks: true,
    minWorkers: 1,
    maxWorkers: 1,
  },
  plugins: [tsconfigPaths()],
});
