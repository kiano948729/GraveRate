import { MemoryRouter } from "react-router-dom";
import TopHeader from "../../src/components/layout/TopHeader";

const mountWithRoute = (route) => {
  cy.mount(
    <MemoryRouter initialEntries={[route]}>
      <TopHeader />
    </MemoryRouter>,
  );
};

describe("<TopHeader />", () => {
  it("shows GraveRate on the home page", () => {
    mountWithRoute("/");

    cy.contains("GraveRate").should("exist");
  });

  it("shows the correct title for the search page", () => {
    mountWithRoute("/search");

    cy.contains("Zoeken").should("exist");
  });

  it("shows Profiel on user pages", () => {
    mountWithRoute("/user/1");

    cy.contains("Profiel").should("exist");
  });

  it("shows Groep on group pages", () => {
    mountWithRoute("/group/1");

    cy.contains("Groep").should("exist");
  });

  it("shows Instellingen on the settings page", () => {
    mountWithRoute("/settings");

    cy.contains("Instellingen").should("exist");
  });

  it("does not render on the login page", () => {
    mountWithRoute("/login");

    cy.get("header").should("not.exist");
  });

  it("does not render on the register page", () => {
    mountWithRoute("/register");

    cy.get("header").should("not.exist");
  });
});
