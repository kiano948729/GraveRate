import { MemoryRouter } from "react-router-dom";
import ResultGroups from "../../src/components/ResultGroups";

describe("<ResultGroups />", () => {
  it("renders a group with fallback values", () => {
    const groups = [
      {
        id: 1,
        name: "the ringbearers",
        description: "sam carried the ring to mordor",
        members: 0,
      },
    ];

    cy.mount(
      <MemoryRouter>
        <ResultGroups groups={groups} />
      </MemoryRouter>,
    );

    cy.contains("the ringbearers").should("exist");
    cy.contains("sam carried the ring to mordor").should("exist");
    cy.contains("0").should("exist");
  });

  it("renders multiple groups", () => {
    const groups = [
      {
        id: 1,
        name: "Group One",
        description: "First group",
        members: 1,
      },
      {
        id: 2,
        name: "Group Two",
        description: "Second group",
        members: 5,
      },
    ];

    cy.mount(
      <MemoryRouter>
        <ResultGroups groups={groups} />
      </MemoryRouter>,
    );

    cy.contains("Group One").should("exist");
    cy.contains("Group Two").should("exist");
  });

  it("creates the correct group link", () => {
    const groups = [
      {
        id: 99,
        name: "Link Test",
        description: "Testing links",
        members: 0,
      },
    ];

    cy.mount(
      <MemoryRouter>
        <ResultGroups groups={groups} />
      </MemoryRouter>,
    );

    cy.get("a").should("have.attr", "href").and("include", "99");
  });
});
