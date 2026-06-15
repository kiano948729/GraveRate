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
});
