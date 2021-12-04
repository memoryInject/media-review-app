/// <reference types="Cypress" />

describe('Project-Settings', () => {
  beforeEach(() => {
    // Disable service worker
    cy.disableServiceWorker();

    //Clean up local storage
    cy.clearLocalStorage()

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

  it('show create review button and project settings button', () => {
    cy.createProject();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'projects');
    cy.get('.btn').should('contain', 'CREATE REVIEW');
    cy.get('.btn').should('contain', 'Settings');
  });

  it('go to project settings', () => {
    cy.createProject();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'projects');
    cy.get('.btn').should('contain', 'CREATE REVIEW');
    cy.get('.btn').should('contain', 'Settings');

    cy.get('[data-cy=settings]').click();
    cy.location('pathname').should('contain', 'settings');
    cy.get('.list-group-item').should('contain', 'Test Project');
  });

  it('can edit and delete a project', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'projects');
    cy.get('.btn').should('contain', 'CREATE REVIEW');
    cy.get('.btn').should('contain', 'Settings');

    cy.get('[data-cy=settings]').click();
    cy.location('pathname').should('contain', 'settings');
    cy.get('.list-group-item').should('contain', 'Test Project');
    cy.get('.btn').should('contain', 'Edit');
    cy.get('.btn').should('contain', 'Delete');

    // Click the edit button and edit the project
    cy.get('[data-cy=edit]').click();
    cy.get('.modal-header').should('contain', 'Edit project');
    cy.get('[data-cy=project-name]').clear();
    cy.get('[data-cy=project-name]').type('Updated Project');
    cy.get('[data-cy=submit]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Project updated successfully');

    cy.get('.list-group-item').should('contain', 'Updated Project');

    // Click the delete button adn delete the project
    cy.get('[data-cy=delete]').click();
    cy.get('.modal-header').should('contain', 'Delete Project');

    // Confirm delete button
    cy.get('[data-cy=understood]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Project deleted successfully');

    // Go back to home after successfully delete the project
    cy.location('pathname').should('equal', '/');
  });

  it('show project settings screen with review list', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'projects');
    cy.get('.btn').should('contain', 'CREATE REVIEW');
    cy.get('.btn').should('contain', 'Settings');

    cy.get('[data-cy=settings]').click();
    cy.location('pathname').should('contain', 'settings');
    cy.get('.list-group-item').should('contain', 'Test Project');
    cy.get('[data-cy=review-list]').click();
    cy.get('.table').should('contain', 'Test Review');
  });
});
