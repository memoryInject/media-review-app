/// <reference types="Cypress" />

describe('Project', () => {
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

  it('can not create project as a normal user', () => {
    cy.loginUser();
    cy.wait(100);
    cy.location('pathname').should('equal', '/');
    cy.get('.btn').should('not.contain', 'CREATE PROJECT');
  });

  it('can create project as a admin user', () => {
    cy.loginAdmin();
    cy.wait(100);
    cy.location('pathname').should('equal', '/');
    cy.get('.btn').should('contain', 'CREATE PROJECT');
    cy.get('.btn').contains('CREATE PROJECT').click();
    cy.wait(50);
    cy.get('.btn').should('contain', 'Submit');
    cy.contains('Name').type('Test Project');
    cy.get('.btn').contains('Submit').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Project created successfully');
    cy.wait(100);

    // Show new project as card
    cy.get('.title-card').should('contain', 'Test Project');
  });

  it('can create multiple project as a admin user', () => {
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');
    cy.get('.btn').contains('CREATE PROJECT').click();
    cy.contains('Name').type('Test Project');
    cy.get('.btn').contains('Submit').click();

    cy.wait(100);

    cy.get('.btn').contains('CREATE PROJECT').click();
    cy.contains('Name').type('Test Project 2');
    cy.get('.btn').contains('Submit').click();

    cy.wait(100);

    // Show new project as card
    cy.get('.title-card').should('contain', 'Test Project');

    cy.get('.title-card').should('contain', 'Test Project 2');
  });

  it('can not create project without a name as a admin user', () => {
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');
    cy.get('.btn').contains('CREATE PROJECT').click();
    cy.get('.btn').contains('Submit').click();

    cy.get('.invalid-feedback').should(
      'contain',
      'Please provide a valid name.'
    );
  });

  // No need to test this often, because it will cause access cloudinary
  it.skip('can create project with image as a admin user', () => {
    cy.loginAdmin();
    cy.wait(100);
    cy.location('pathname').should('equal', '/');
    cy.get('.btn').should('contain', 'CREATE PROJECT');
    cy.get('.btn').contains('CREATE PROJECT').click();
    cy.wait(50);
    cy.get('.btn').should('contain', 'Submit');
    cy.contains('Name').type('Test Project');
    cy.get('.form-control[type=file]').attachFile('test-150x150.png');
    cy.get('.btn').contains('Submit').click();

    cy.wait(100);

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Project created successfully');

    // Show new project as card
    cy.get('.title-card').should('contain', 'Test Project');

    // Show project image in the card
    cy.get('.card-img')
      .should('have.attr', 'src')
      .should('include', 'cloudinary');
  });
});
