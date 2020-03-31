/// <reference types="cypress" />

context("User access", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('input[id="email"]').type("user@user.com");
    cy.get('input[id="password"]').type("password1");
    cy.get('button[type="submit"]').click();
  });

  // https://on.cypress.io/interacting-with-elements

  it("get to Timecards page after login", () => {
    cy.location("pathname").should("include", "timecard");
  });

  it("Don't see the owner column as user", () => {
    cy.get("table")
      .find("thead tr")
      .find("th")
      .should("not.contain", "Owner");
  });

  it("user can not access /manage-users", () => {
    cy.wait(1000);
    cy.visit("http://localhost:3000/manage-users");
    cy.location("pathname").should("not.include", "manage-users");
  });
});
