describe("Navigatie", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  //BOTTOM NAV
  describe("Bottom navigatie", () => {
    it("toont de bottom nav op de homepagina", () => {
      cy.get(".bottom-nav").should("be.visible");
    });

    it("navigeert naar /search via de zoeken-knop", () => {
      cy.get(".bottom-nav").contains("Zoeken").click();
      cy.url().should("include", "/search");
    });

    it("navigeert naar /groups via de groepen-knop", () => {
      cy.get(".bottom-nav").contains("Groepen").click();
      cy.url().should("include", "/groups");
    });

    it("navigeert naar /login via de login-knop als niet ingelogd", () => {
      cy.get(".bottom-nav").contains("Login").click();
      cy.url().should("include", "/login");
    });

    it("toont Meldingen en Profiel als ingelogd", () => {
      cy.fixture("user").then((user) => {
        cy.login(user.email, user.password);
        cy.get(".bottom-nav").contains("Meldingen").should("be.visible");
        cy.get(".bottom-nav").contains("Profiel").should("be.visible");
      });
    });
  });

  //TOP HEADER
  describe("Top header", () => {
    it("toont 'Zoeken' als titel op de zoekpagina", () => {
      cy.visit("/search");
      cy.get(".top-header").contains("Zoeken").should("be.visible");
    });

    it("toont 'Groepen' als titel op de groepenpagina", () => {
      cy.visit("/groups");
      cy.get(".top-header").contains("Groepen").should("be.visible");
    });

    it("verbergt de top header op de loginpagina", () => {
      cy.visit("/login");
      cy.get(".top-header").should("not.exist");
    });
  });

  //HOME
  describe("Homepagina", () => {
    it("toont de hero tekst", () => {
      cy.contains("Ontdek het").should("be.visible");
      cy.contains("stille erfgoed").should("be.visible");
    });
    
    it("verbergt de auth-knoppen als ingelogd", () => {
      cy.fixture("user").then((user) => {
        cy.login(user.email, user.password);
        cy.visit("/");
        cy.contains("Registreren").should("not.exist");
      });
    });
  });
});
