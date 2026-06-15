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

  it("shows the correct title for a known route", () => {
    mountWithRoute("/search");

    cy.contains("Zoeken").should("exist");
  });

  it("shows 'Profiel' for user pages", () => {
    mountWithRoute("/user/1");

    cy.contains("Profiel").should("exist");
  });

  it("does not render on the login page", () => {
    mountWithRoute("/login");

    cy.get("header").should("not.exist");
  });
});
