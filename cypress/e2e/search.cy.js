describe("Zoeken", () => {
  beforeEach(() => {
    cy.visit("/search");
  });

  //UI
  describe("Zoekpagina interface", () => {
    it("toont de zoekbalk", () => {
      cy.get("input[placeholder]").should("be.visible");
    });

    it("toont alle tabs: Mensen, Posts, Groepen, Begraafplaatsen", () => {
      cy.contains("Mensen").should("be.visible");
      cy.contains("Posts").should("be.visible");
      cy.contains("Groepen").should("be.visible");
      cy.contains("Begraafplaatsen").should("be.visible");
    });

    it("start zoeken bij klik op zoek-knop", () => {
      cy.get("input[placeholder]").type("test");
      cy.contains("button", "Zoek").click();
      cy.get("input[placeholder]").should("have.value", "test");
    });
  });

  //TABS
  describe("Tabs wisselen", () => {
    it("activeert de Mensen-tab standaard", () => {
      cy.contains("Mensen").should("have.class", "active");
    });

    it("wisselt naar de Posts-tab", () => {
      cy.contains("Posts").click();
      cy.contains("Posts").should("have.class", "active");
    });

    it("wisselt naar de Groepen-tab", () => {
      cy.contains("Groepen").click();
      cy.contains("Groepen").should("have.class", "active");
    });

    it("wisselt naar de Begraafplaatsen-tab", () => {
      cy.contains("Begraafplaatsen").click();
      cy.contains("Begraafplaatsen").should("have.class", "active");
    });

    it("toont sorteeropties op de Posts-tab na zoeken", () => {
      cy.get("input[placeholder]").type("test");
      cy.contains("button", "Zoek").click();
      cy.contains("Posts").click();
      cy.contains("recent").should("be.visible");
      cy.contains("popular").should("be.visible");
      cy.contains("rating").should("be.visible");
    });

    it("verbergt sorteeropties op de Mensen-tab", () => {
      cy.contains("Mensen").click();
      cy.contains("recent").should("not.exist");
    });
  });

  //RESULTATEN 
  describe("Zoekresultaten", () => {
    it("toont 'Geen resultaten' bij een zoekopdracht zonder match", () => {
      cy.get("input[placeholder]").type("xqzxqzxqz");
      cy.contains("button", "Zoek").click();
      cy.contains("Geen resultaten").should("be.visible");
    });

    it("toont zoekterm in de 'geen resultaten'-melding", () => {
      cy.get("input[placeholder]").type("xqzxqzxqz");
      cy.contains("button", "Zoek").click();
      cy.contains('"xqzxqzxqz"').should("be.visible");
    });

    it("reset resultaten niet bij wisselen van tab", () => {
      cy.get("input[placeholder]").type("xqzxqzxqz");
      cy.contains("button", "Zoek").click();
      cy.contains("Posts").click();
      cy.contains("Geen resultaten").should("be.visible");
    });
  });
});
