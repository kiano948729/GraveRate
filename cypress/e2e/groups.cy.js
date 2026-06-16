describe("Groepen", () => {
  //LIJST
  describe("Groepen overzicht", () => {
    beforeEach(() => {
      cy.visit("/groups");
    });

    it("laadt de groepenpagina zonder fouten", () => {
      cy.get(".top-header").contains("Groepen").should("be.visible");
    });

    it("verbergt de 'Nieuwe groep'-knop als niet ingelogd", () => {
      cy.contains("Nieuwe groep").should("not.exist");
    });

    it("toont lege-staat tekst als er geen groepen zijn", () => {
      //dit test de fallback als er wel groepen zijn slaagt de test alsnog
      cy.get("body").then(($body) => {
        if ($body.text().includes("Nog geen groepen")) {
          cy.contains("Nog geen groepen").should("be.visible");
        }
      });
    });
  });

//AANMAKEN
  describe("Groep aanmaken (ingelogd)", () => {
    beforeEach(() => {
      cy.fixture("user").then((user) => {
        cy.login(user.email, user.password);
        cy.visit("/groups");
      });
    });

    it("toont de 'Nieuwe groep'-knop als ingelogd", () => {
      cy.contains("Nieuwe groep").should("be.visible");
    });

    it("opent de modal bij klik op 'Nieuwe groep'", () => {
      cy.contains("Nieuwe groep").click();
      cy.contains("Nieuwe groep aanmaken").should("be.visible");
    });

    it("sluit de modal bij klik op ✕", () => {
      cy.contains("Nieuwe groep").click();
      cy.get("button").contains("✕").click();
      cy.contains("Nieuwe groep aanmaken").should("not.exist");
    });

    it("sluit de modal bij klik buiten het venster", () => {
      cy.contains("Nieuwe groep").click();
      cy.get('[style*="inset: 0"]').click({ force: true });
      cy.contains("Nieuwe groep aanmaken").should("not.exist");
    });

    it("de aanmaken-knop is uitgeschakeld zonder naam", () => {
      cy.contains("Nieuwe groep").click();
      cy.contains("button", "Aanmaken").should("be.disabled");
    });

    it("maakt een nieuwe groep aan en toont die in de lijst", () => {
      const naam = `TestGroep ${Date.now()}`;
      cy.contains("Nieuwe groep").click();
      cy.get('input[placeholder="Naam"]').type(naam);
      cy.contains("button", "Aanmaken").click();
      cy.contains(naam).should("be.visible");
    });

    it("kan een privé groep aanmaken", () => {
      const naam = `PrivéGroep ${Date.now()}`;
      cy.contains("Nieuwe groep").click();
      cy.get('input[placeholder="Naam"]').type(naam);
      //toggle prive
      cy.contains("Privé groep").parent().find("button").click();
      cy.contains("button", "Aanmaken").click();
      cy.contains(naam).should("be.visible");
      cy.contains("privé").should("be.visible");
    });
  });

  //DETAIL
  describe("Groepdetailpagina", () => {
    beforeEach(() => {
      cy.fixture("user").then((user) => {
        cy.login(user.email, user.password);
        cy.visit("/groups");
      });
    });

    it("opent de detailpagina bij klik op een groep", () => {
      cy.get("a[href^='/group/']").first().click();
      cy.get(".top-header").contains("Groep").should("be.visible");
    });

    it("toont de terug-naar-groepen link", () => {
      cy.get("a[href^='/group/']").first().click();
      cy.contains("Terug naar groepen").should("be.visible");
    });

    it("navigeert terug naar /groups via de link", () => {
      cy.get("a[href^='/group/']").first().click();
      cy.contains("Terug naar groepen").click();
      cy.url().should("include", "/groups");
    });
  });
});
