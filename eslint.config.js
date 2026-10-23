import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

// The serverless side only. The frontend has its own config, and remotion/ is
// TypeScript with a typecheck of its own.
export default defineConfig([
  globalIgnores(["frontend/**", "remotion/**", "node_modules/**"]),
  {
    files: ["api/**/*.js", "backend/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
]);
