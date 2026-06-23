describe("Authenticatie", () => {
  beforeEach(() => {
    cy.fixture("user").as("user");
  });

  //REGISTREREN
  describe("Registreren", () => {
    it("toont foutmelding als wachtwoorden niet overeenkomen", () => {
      cy.visit("/register");
      cy.get('input[placeholder="Gebruikersnaam"]').type("testuser");
      cy.get('input[placeholder="E-mailadres"]').type("test@test.com");
      cy.get('input[placeholder="Wachtwoord"]').type("wachtwoord123");
      cy.get('input[placeholder="Wachtwoord bevestigen"]').type(
        "anderwachtwoord",
      );
      cy.get('button[type="submit"]').click();
      cy.contains("Wachtwoorden komen niet overeen").should("be.visible");
    });

    it("toont foutmelding bij te kort wachtwoord", () => {
      cy.visit("/register");
      cy.get('input[placeholder="Gebruikersnaam"]').type("testuser");
      cy.get('input[placeholder="E-mailadres"]').type("nieuw@test.com");
      cy.get('input[placeholder="Wachtwoord"]').type("123");
      cy.get('input[placeholder="Wachtwoord bevestigen"]').type("123");
      cy.get('button[type="submit"]').click();
      cy.contains("minimaal 6 tekens").should("be.visible");
    });

    it("navigeert naar /login via de link", () => {
      cy.visit("/register");
      cy.contains("Inloggen").click();
      cy.url().should("include", "/login");
    });
  });

  //INLOGGEN
  describe("Inloggen", () => {
    it("toont foutmelding bij onjuiste gegevens", function () {
      cy.visit("/login");
      cy.get('input[type="email"]').type("fout@email.com");
      cy.get('input[type="password"]').type("foutWachtwoord");
      cy.get('button[type="submit"]').click();
      cy.contains("Ongeldig e-mailadres of wachtwoord").should("be.visible");
    });

    it("logt succesvol in en toont de bottom nav", function () {
      cy.fixture("user").then((user) => {
        cy.login(user.email, user.password);
        cy.get(".bottom-nav").should("be.visible");
        cy.url().should("eq", Cypress.config("baseUrl") + "/");
      });
    });

    it("navigeert naar /register via de link", () => {
      cy.visit("/login");
      cy.contains("Registreren").click();
      cy.url().should("include", "/register");
    });

    it("verbergt de bottom nav op de loginpagina", () => {
      cy.visit("/login");
      cy.get(".bottom-nav").should("not.exist");
    });
  });

  //UITLOGGEN
  describe("Uitloggen", () => {
    it("logt uit via instellingen en stuurt door naar /login", function () {
      cy.fixture("user").then((user) => {
        cy.login(user.email, user.password);
        cy.logout();
        cy.url().should("include", "/login");
      });
    });
  });

  //PROTECTED ROUTES
  describe("Protected routes", () => {
    it("stuurt niet-ingelogde gebruiker door van /profile naar /login", () => {
      cy.visit("/profile");
      cy.url().should("include", "/login");
    });

    it("stuurt niet-ingelogde gebruiker door van /settings naar /login", () => {
      cy.visit("/settings");
      cy.url().should("include", "/login");
    });
  });
});
