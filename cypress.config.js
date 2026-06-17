import { defineConfig } from "cypress";
import codeCoverageTask from "@cypress/code-coverage/task";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 390,
    viewportHeight: 844,

    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },

    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },

    specPattern: "cypress/component/**/*.cy.{js,jsx}",
    viewportWidth: 390,
    viewportHeight: 844,
  },
});
