describe("Profielpagina", () => {
  beforeEach(() => {
    cy.fixture("user").then((user) => {
      cy.login(user.email, user.password);
      cy.visit("/profile");
    });
  });

  //WEERGAVE
  describe("Profielweergave", () => {
    it("laadt de profielpagina zonder fouten", () => {
      cy.get(".top-header").contains("Profiel").should("be.visible");
    });

    it("toont de gebruikersnaam", () => {
      cy.fixture("user").then((user) => {
        cy.contains(user.username).should("be.visible");
      });
    });

    it("toont de statistieken: Posts, Vrienden, Points", () => {
      cy.contains("Posts").should("be.visible");
      cy.contains("Vrienden").should("be.visible");
      cy.contains("Points").should("be.visible");
    });

    it("toont de 'Profiel bewerken'-knop", () => {
      cy.contains("Profiel bewerken").should("be.visible");
    });

    it("toont de settings-link in de top header", () => {
      cy.get(".top-header").contains("⚙").should("be.visible");
    });

    it("toont het posts-grid", () => {
      //grid heeft 3 kolommen
      cy.get('[style*="grid-template-columns"]').should("be.visible");
    });
  });

  //BEWERKEN
  describe("Profiel bewerken", () => {
    it("opent het bewerkformulier bij klik op 'Profiel bewerken'", () => {
      cy.contains("Profiel bewerken").click();
      cy.get('input[placeholder="Gebruikersnaam"]').should("be.visible");
      cy.get('textarea[placeholder="Bio"]').should("be.visible");
    });

    it("vult de huidige gebruikersnaam in als beginwaarde", () => {
      cy.fixture("user").then((user) => {
        cy.contains("Profiel bewerken").click();
        cy.get('input[placeholder="Gebruikersnaam"]').should(
          "have.value",
          user.username
        );
      });
    });

    it("toont foutmelding bij lege gebruikersnaam", () => {
      cy.contains("Profiel bewerken").click();
      cy.get('input[placeholder="Gebruikersnaam"]').clear();
      cy.contains("Opslaan").click();
      cy.contains("Gebruikersnaam mag niet leeg zijn").should("be.visible");
    });

    it("annuleert bewerken en keert terug naar profielweergave", () => {
      cy.contains("Profiel bewerken").click();
      cy.contains("Annuleren").click();
      cy.contains("Profiel bewerken").should("be.visible");
    });

    it("slaat een gewijzigde bio op", () => {
      const nieuwesBio = `Bio getest op ${Date.now()}`;
      cy.contains("Profiel bewerken").click();
      cy.get('textarea[placeholder="Bio"]').clear().type(nieuwesBio);
      cy.contains("Opslaan").click();
      cy.contains(nieuwesBio).should("be.visible");
    });
  });
});
