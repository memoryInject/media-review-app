/// <reference types="Cypress" />

describe('About', () => {
  beforeEach(() => {
    // Clean up database
    cy.exec('npm run flush-data');

    // Seed database
    cy.exec('npm run load-data');

    cy.visit('/');
  });

  after(() => {
    // Clean up database
    cy.exec('npm run flush-data');
  });

  it('go to about modal', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Go to app settings screen
    cy.get('[data-cy=header-profile]').click();
    cy.get('[data-cy=header-about]').click();
    cy.get('.modal-title').should('contain', 'About');
    cy.get('.modal-body').should('contain', 'memoryinject.io');
  });
});
