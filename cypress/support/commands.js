//hrbruikbare commands zodat ik niet in elke test opnieuw hoeft in te loggen

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.get(".bottom-nav").should("be.visible");
});

Cypress.Commands.add("logout", () => {
  cy.visit("/settings");
  cy.contains("Uitloggen").click();
  cy.url().should("include", "/login");
});
