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

  it("shows the profile image when one exists", () => {
    const users = [
      {
        id: 2,
        username: "gandalf",
        bio: "you shall not pass",
        profilePicture: "https://example.com/avatar.jpg",
        upvotes: 5,
      },
    ];

    cy.mount(
      <MemoryRouter>
        <ResultUsers users={users} />
      </MemoryRouter>,
    );

    cy.get("img").should("have.attr", "src", "https://example.com/avatar.jpg");

    cy.contains("Frontend developer").should("exist");
  });
});
