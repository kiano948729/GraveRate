import { MemoryRouter } from "react-router-dom";
import ResultUsers from "../../src/components/ResultUsers";

describe("<ResultUsers />", () => {
  it("renders a user with fallback values", () => {
    const users = [
      {
        id: 1,
        username: "John",
        bio: "",
        profilePicture: null,
        upvotes: 12,
      },
    ];

    cy.mount(
      <MemoryRouter>
        <ResultUsers users={users} />
      </MemoryRouter>,
    );

    cy.contains("John").should("exist");
    cy.contains("Geen bio").should("exist");
    cy.contains("J").should("exist");
    cy.contains("12").should("exist");
  });

  it("renders multiple users", () => {
    const users = [
      {
        id: 1,
        username: "Frodo",
        bio: "",
        profilePicture: null,
        upvotes: 2,
      },
      {
        id: 2,
        username: "Sam",
        bio: "Gardener",
        profilePicture: null,
        upvotes: 7,
      },
    ];

    cy.mount(
      <MemoryRouter>
        <ResultUsers users={users} />
      </MemoryRouter>,
    );

    cy.contains("Frodo").should("exist");
    cy.contains("Sam").should("exist");
  });

  it("shows zero upvotes", () => {
    const users = [
      {
        id: 5,
        username: "Pippin",
        bio: "",
        profilePicture: null,
        upvotes: 0,
      },
    ];

    cy.mount(
      <MemoryRouter>
        <ResultUsers users={users} />
      </MemoryRouter>,
    );

    cy.contains("0").should("exist");
  });

  it("creates the correct profile link", () => {
    const users = [
      {
        id: 42,
        username: "Aragorn",
        bio: "",
        profilePicture: null,
        upvotes: 20,
      },
    ];

    cy.mount(
      <MemoryRouter>
        <ResultUsers users={users} />
      </MemoryRouter>,
    );

    cy.get("a").should("have.attr", "href").and("include", "42");
  });
});
