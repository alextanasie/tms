/// <reference types="cypress" />

context("Authentication flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  // https://on.cypress.io/interacting-with-elements

  it("visit '/' - should redirect to the login page", () => {
    cy.location("pathname").should("include", "login");
  });

  it("refresh login page - should not change URL", () => {
    cy.reload();
    cy.location("pathname").should("include", "login");
  });

  it("enter less than 6 chars in email/pass fields", () => {
    cy.get('input[id="email"]')
      .type("12345")
      .should("have.value", "12345");
    cy.get('input[id="password"]')
      .type("12345")
      .should("have.value", "12345");
    cy.get('button[type="submit"]').should("be.disabled");
  });

  it("enter wrong username", () => {
    cy.get('input[id="email"]')
      .type("wrong@email.com")
      .should("have.value", "wrong@email.com");
    cy.get('input[id="password"]')
      .type("whateverpass")
      .should("have.value", "whateverpass");
    cy.get('button[type="submit"]').click();
    cy.get(".MuiInputBase-formControl").should("have.class", "Mui-error");
  });

  it("enter correct credentials", () => {
    cy.get('input[id="email"]').type("a@a.com");
    cy.get('input[id="password"]').type("password1");
    cy.get('button[type="submit"]').click();
    cy.location("pathname").should("include", "timecard");
  });
});
