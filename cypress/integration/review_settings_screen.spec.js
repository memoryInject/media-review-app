/// <reference types="Cypress" />

describe('Review-Settings-Screen', () => {
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

  it('go to review settings screen', () => {
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

    // Go to review screen
    cy.get('.title-card').click();

    cy.location('pathname').should('contain', 'reviews');

    // Check buttons in review screen
    cy.get('.review-buttons').should('contain', 'Upload');
    cy.get('.review-buttons').should('contain', 'Collaborators');

    // Go to review settings screen
    cy.get('[data-cy=settings]').click();
    cy.location('pathname').should('contain', 'settings');

    // Check the review details
    cy.get('li').should('contain', 'Test Review');
  });

  it('edit and delete the review', () => {
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

    // Go to review screen
    cy.get('.title-card').click();

    cy.location('pathname').should('contain', 'reviews');

    // Check buttons in review screen
    cy.get('.review-buttons').should('contain', 'Upload');
    cy.get('.review-buttons').should('contain', 'Collaborators');

    // Go to review settings screen
    cy.get('[data-cy=settings]').click();
    cy.location('pathname').should('contain', 'settings');

    // Click the edit button
    cy.get('[data-cy=edit]').click();
    cy.get('.modal-title').should('contain', 'Edit review');

    // Change review name, description and status
    cy.get('[data-cy=form-check]').click();
    cy.get('[data-cy=review-name]').clear();
    cy.get('[data-cy=review-name]').type('Updated Review');
    cy.get('[data-cy=review-description]').clear();
    cy.get('[data-cy=review-description]').type('Updated Description');

    // Submit the changes
    cy.get('[data-cy=submit]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Review updated successfully');

    // Check the review details
    cy.get('li').should('contain', 'Updated Review');
    cy.get('li').should('contain', 'Updated Description');
    cy.get('li').should('contain', 'Close');

    // Delete the review
    cy.get('[data-cy=delete]').click();

    // Confirm delete
    cy.get('[data-cy=understood]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Review deleted successfully');

    cy.location('pathname').should('not.include', 'reviews');
  });

  it('show media list, edit and delete media from review settings screen', () => {
    cy.createProject();
    cy.createReview();
    cy.loginAdmin();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'projects');

    // Go to review screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'reviews');

    // Click upload button
    cy.get('[data-cy=upload]').click();
    cy.get('.offcanvas-title').should('contain', 'Upload Video');
    cy.get('[data-cy=file]').attachFile('SampleVideo_1280x720_1mb.mp4');
    cy.wait(200);
    cy.get('.alert').should('contain', 'Video successfully uploaded');
    cy.get('[data-cy=media-name]').clear();
    cy.get('[data-cy=media-name]').type('Updated Video');
    cy.get('[data-cy=update-media]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Media updated successfully');

    // Go to review settings screen
    cy.get('[data-cy=settings]').click();
    cy.location('pathname').should('contain', 'settings');

    // Go and check media list
    cy.get('[data-cy=media-list]').click();
    cy.get('.table').should('contain', 'Updated Video');

    // Edit the media
    cy.get('[data-cy=edit-0]').click();
    cy.get('.modal-title').should('contain', 'Edit media');
    cy.get('[data-cy=media-name]').clear();
    cy.get('[data-cy=media-name]').type('New Video');
    cy.get('[data-cy=media-version]').clear();
    cy.get('[data-cy=media-version]').type('55');

    // Submit data
    cy.get('[data-cy=submit]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Media updated successfully');

    // Check media list
    cy.get('[data-cy=media-list]').click();
    cy.get('.table').should('contain', 'New Video');
    cy.get('.table').should('contain', '55');

    // Delete the media
    cy.get('[data-cy=delete-0]').click();

    // Confirm delete
    cy.get('[data-cy=understood]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Media deleted successfully');
  });
});
