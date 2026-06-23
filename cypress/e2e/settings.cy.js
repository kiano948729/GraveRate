describe("Instellingen", () => {
  beforeEach(() => {
    cy.fixture("user").then((user) => {
      cy.login(user.email, user.password);
      cy.visit("/settings");
    });
  });

  //WEERGAVE
  describe("Instellingenpagina interface", () => {
    it("laadt de instellingenpagina", () => {
      cy.get(".top-header").contains("Instellingen").should("be.visible");
    });

    it("toont het account-onderdeel", () => {
      cy.contains("Account").should("be.visible");
    });

    it("toont het e-mailadres van de gebruiker", () => {
      cy.fixture("user").then((user) => {
        cy.contains(user.email).should("be.visible");
      });
    });

    it("toont het privacy-onderdeel", () => {
      cy.contains("Privacy").should("be.visible");
      cy.contains("Privé profiel").should("be.visible");
    });

    it("toont de uitlog-knop", () => {
      cy.contains("Uitloggen").should("be.visible");
    });
  });

  //PRIVACY TOGGLE
  describe("Privacy toggle", () => {
    it("toggle is omkeerbaar", () => {
      //zet aan
      cy.contains("Privé profiel").parent().find("button").click();
      cy.contains("Opgeslagen").should("be.visible");
      //zet weer uit
      cy.contains("Privé profiel").parent().find("button").click();
      cy.contains("Opgeslagen").should("be.visible");
    });
  });

  //UITLOGGEN
  describe("Uitloggen via instellingen", () => {
    it("logt uit en stuurt door naar /login", () => {
      cy.contains("Uitloggen").click();
      cy.url().should("include", "/login");
    });

    it("toont na uitloggen het loginformulier", () => {
      cy.contains("Uitloggen").click();
      cy.get('input[type="email"]').should("be.visible");
    });
  });
});
