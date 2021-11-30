/// <reference types="Cypress" />

describe('Review-List', () => {
  beforeEach(() => {
    // Disable service worker
    cy.disableServiceWorker();

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

  it('can create a review under a project as a admin user', () => {
    cy.createProject();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();

    // Create a new review by clicking create review button
    cy.get('.btn').contains('CREATE REVIEW').click();
    cy.get('.modal-title').should('contain', 'Create review');
    cy.get('.btn').should('contain', 'Submit');
    cy.contains('Name').type('Test Review');
    cy.get('input:last').should(
      'have.attr',
      'placeholder',
      'Enter review description'
    );
    cy.get('input:last').type('Test Description');
    cy.get('.btn').contains('Submit').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Review created successfully');
  });

  it('can create multiple review under a project as a admin user', () => {
    cy.createProject();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();

    // Create a new review by clicking create review button
    cy.get('.btn').contains('CREATE REVIEW').click();
    cy.contains('Name').type('Test Review');
    cy.get('input:last').type('Test Description');
    cy.get('.btn').contains('Submit').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Review created successfully');

    // Create another new review by clicking create review button
    cy.get('.btn').contains('CREATE REVIEW').click();
    cy.contains('Name').type('Test Review 2');
    cy.get('input:last').type('Test Description 2');
    cy.get('.btn').contains('Submit').click();

    cy.wait(100);
    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Review created successfully');

    // Check both reviews
    cy.get('.title-card').should('contain', 'Test Review');
    cy.get('.title-card').should('contain', 'Test Review 2');
  });

  it('can not create a review under a project without a name and description as a admin user', () => {
    cy.createProject();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();

    // Create a new review by clicking create review button
    cy.get('.btn').contains('CREATE REVIEW').click();
    cy.get('.btn').contains('Submit').click();
    cy.get('.invalid-feedback').should(
      'contain',
      'Please provide a valid name.'
    );
    cy.get('.invalid-feedback').should(
      'contain',
      'Please provide a valid description.'
    );

    cy.contains('Name').type('Test Review');
    cy.get('.btn').contains('Submit').click();
    cy.get('.invalid-feedback').should(
      'contain',
      'Please provide a valid description.'
    );

    // Clear Name field
    cy.get('.modal-content').within(() => {
      cy.get('input').clear();
    });

    cy.get('input:last').type('Test Description');
    cy.get('.btn').contains('Submit').click();
    cy.get('.invalid-feedback').should(
      'contain',
      'Please provide a valid name.'
    );
  });
});
