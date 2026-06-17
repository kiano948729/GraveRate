import {
  IconHome,
  IconSearch,
  IconGroups,
  IconBell,
  IconUser,
} from "../../src/components/layout/Icons";

describe("<Icons />", () => {
  it("renders the Home icon", () => {
    cy.mount(<IconHome />);
    cy.get("svg").should("exist");
  });

  it("renders the Search icon", () => {
    cy.mount(<IconSearch />);
    cy.get("svg").should("exist");
  });

  it("renders the Groups icon", () => {
    cy.mount(<IconGroups />);
    cy.get("svg").should("exist");
  });

  it("renders the Bell icon", () => {
    cy.mount(<IconBell />);
    cy.get("svg").should("exist");
  });

  it("renders the User icon", () => {
    cy.mount(<IconUser />);
    cy.get("svg").should("exist");
  });

  it("renders a filled Home icon", () => {
    cy.mount(<IconHome filled />);
    cy.get("svg").should("have.attr", "fill", "currentColor");
  });

  it("renders an outlined Home icon", () => {
    cy.mount(<IconHome />);
    cy.get("svg").should("have.attr", "fill", "none");
  });
});
