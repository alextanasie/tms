/// <reference types="cypress" />

context("Admin access", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[id="email"]').type("a@a.com");
    cy.get('input[id="password"]').type("password1");
    cy.get('button[type="submit"]').click();
  });

  // https://on.cypress.io/interacting-with-elements

  it("get to Timecards page after login", () => {
    cy.location("pathname").should("include", "timecard");
  });

  it("see the owner column as admin", () => {
    cy.get("table")
      .find("thead tr")
      .find("th")
      .should("contain", "Owner");
  });

  it("admin can access /manage-users", () => {
    cy.wait(1000);
    cy.visit("http://localhost:3000/manage-users");
    cy.location("pathname").should("include", "manage-users");
  });
});
