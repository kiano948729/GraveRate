import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    istanbul({
      include: "src/*",
      extension: [".js", ".ts", ".vue", ".tsx"],
      requireEnv: false,
    }),
  ],
});
