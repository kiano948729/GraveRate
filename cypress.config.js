import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 390,
    viewportHeight: 844,
    //simuleert een mobiel scherm want wie gebruikt er nou sociale media op desktop 
    setupNodeEvents(on, config) {},
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx}",
    viewportWidth: 390,
    viewportHeight: 844,
  },
});
