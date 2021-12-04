/// <reference types="Cypress" />

describe('App-Settings-Screen', () => {
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

  it('go to app settings screen', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Go to app settings screen
    cy.get('[data-cy=header-profile]').click();
    cy.get('[data-cy=header-settings]').click();

    // Check if it's on right place
    cy.location('pathname').should('equal', '/settings');

    cy.get('li').should('contain', 'adminTester');
  });

  it('user can edit profile', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Go to app settings screen
    cy.get('[data-cy=header-profile]').click();
    cy.get('[data-cy=header-settings]').click();

    // Edit profile
    cy.get('[data-cy=edit-profile]').click();
    cy.get('.modal-title').should('contain', 'Edit profile');
    cy.get('[data-cy=first-name]').clear();
    cy.get('[data-cy=first-name]').type('John');
    cy.get('[data-cy=last-name]').clear();
    cy.get('[data-cy=last-name]').type('Doe');
    cy.get('[data-cy=company-name]').clear();
    cy.get('[data-cy=company-name]').type('memoryInject');

    // Submit data
    cy.get('[data-cy=submit]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'User updated successfully');

    // Check the updated data
    cy.get('li').should('contain', 'John');
    cy.get('li').should('contain', 'Doe');
    cy.get('li').should('contain', 'memoryInject');
  });

  it('user can request password reset email', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Go to app settings screen
    cy.get('[data-cy=header-profile]').click();
    cy.get('[data-cy=header-settings]').click();

    // Change password request
    cy.get('[data-cy=change-password]').click();
    cy.get('.modal-title').should('contain', 'Password reset email');
    cy.get('[data-cy=email]').should('have.value', 'adminTester@example.com');

    // Submit data
    cy.get('[data-cy=submit]').click();

    // Toast message is shown
    cy.get('.toast-body').should(
      'contain',
      'Password reset email send successfully'
    );
  });

  it('can see project list from app settings screen', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Go to app settings screen
    cy.get('[data-cy=header-profile]').click();
    cy.get('[data-cy=header-settings]').click();

    // Click and see project list
    cy.get('[data-cy=project-list]').click();
    cy.get('.table').should('contain', 'Test Project');
  });

  it('can see user list from app settings screen', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Go to app settings screen
    cy.get('[data-cy=header-profile]').click();
    cy.get('[data-cy=header-settings]').click();

    // Click and see user list
    cy.get('[data-cy=user-list]').click();
    cy.get('.table').should('contain', 'alexis');
  });
});
