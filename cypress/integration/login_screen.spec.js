/// <reference types="Cypress" />

describe('MediaReviewApp login', () => {
  before(() => {
    // Clean up database
    cy.exec('npm run flush-data');

    // Seed database
    cy.exec('npm run load-data');
  });

  beforeEach(() => {
    cy.visit('/');
  });

  after(() => {
    // Clean up database
    cy.exec('npm run flush-data');
  });

  it('does not work with wrong credentials', () => {
    cy.contains('Email Address').type('wrong@email.com');
    cy.contains('Password').type('no-such-user');
    cy.get('.btn').contains('Sign In').click();

    // Error message is shown and we remain on the login page
    cy.get('.alert').should(
      'contain',
      'Unable to log in with provided credentials.'
    );
    cy.url().should('contain', '/login');
  });

  it('log in with correct credentials', () => {
    const user = Cypress.env('user');
    cy.contains('Email Address').type(user.email);
    cy.contains('Password').type(user.password);
    cy.get('.btn').contains('Sign In').click();

    // Check the logged in url
    cy.url().should('not.contain', '/login');
    cy.location('pathname').should('equal', '/');
  });
});
