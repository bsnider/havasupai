import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If deploying to https://<user>.github.io/<repo>/ set base to '/<repo>/'
// For a user/organization root site (repo named <user>.github.io) leave base as '/'
const repoName = "havasupai"; // change if your repo name differs
const isRootSite = false; // set true if publishing to <user>.github.io

export default defineConfig({
  base: isRootSite ? "/" : `/${repoName}/`,
  plugins: [react()],
  server: { open: true },
  build: { outDir: "dist" },
});
