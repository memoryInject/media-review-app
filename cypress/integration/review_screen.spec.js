/// <reference types="Cypress" />

describe('Review-Screen', () => {
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

  it('go to review screen', () => {
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
  });
});

describe('Review-Screen-Upload-Video', () => {
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

  it('can upload video', () => {
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
    cy.get('[data-cy=cancel]').click();

    // Now video name should shown in mediaInfo bar
    cy.get('h6').should('contain', 'SampleVideo_1280x720_1mb');
  });

  it('after upload complete, change the video info', () => {
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

    // Now video name should shown in mediaInfo bar
    cy.get('h6').should('contain', 'Updated Video');
  });
});

describe('Review-Screen-Collaborators', () => {
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

  it('can see collaborators', () => {
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

    // Click collaborators button
    cy.get('[data-cy=collaborators]').click();
    cy.get('.offcanvas-title').should('contain', 'Collaborators');

    // Click a collaborator profile icon and see the details
    cy.get('[data-cy=profile-alexis]').click();
    cy.get('li').should('contain', 'alexis@example.com');
  });

  it('can add or remove existing users/collaborators', () => {
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

    // Click collaborators button
    cy.get('[data-cy=collaborators]').click();
    cy.get('.offcanvas-title').should('contain', 'Collaborators');

    // Click a collaborator profile icon and see the details
    cy.get('[data-cy=profile-alexis]').click();

    // Remove the collaborator
    cy.get('[data-cy=collaborator-remove]').click();

    // Confirm modal
    cy.get('.modal-title').should('contain', 'Remove Collaborator');
    cy.get('[data-cy=understood]').click();

    // Toast message is shown
    cy.get('.toast-body').should(
      'contain',
      'Successfully removed collaborator'
    );

    // Click collaborators button
    cy.get('[data-cy=collaborators]').click();

    // Add existing user as collaborator
    cy.get('[data-cy=add-collaborator]').click();
    cy.get('[data-cy=add-existing-user]').click();
  });

  it('can send invitation to add collaborator', () => {
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

    // Click collaborators button
    cy.get('[data-cy=collaborators]').click();

    // Send invitation button
    cy.get('[data-cy=add-collaborator]').click();
    cy.get('[data-cy=send-invitation]').click();
    cy.get('[data-cy=invitaion-email]').type('someone@example.com');
    cy.get('[data-cy=submit-invitation]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Successfully send email');
  });

  it('non admin collaborator can see the project and review they are in', () => {
    cy.createProject();
    cy.createReview();
    cy.loginUser();
    cy.location('pathname').should('equal', '/');

    // Show test project
    cy.get('.title-card').should('contain', 'Test Project');

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'projects');

    // Go to review screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'reviews');
  });
});

describe('Review-Screen-Feedbacks', () => {
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

  it('can post feedback and reply', () => {
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
    cy.get('[data-cy=cancel]').click();

    // Now video name should shown in mediaInfo bar
    cy.get('h6').should('contain', 'SampleVideo_1280x720_1mb');

    // Create a feedback
    cy.get('[data-cy=feedback-textarea]').type('Test Feedback');

    // Submit feedback
    cy.get('[data-cy=feedback-submit]').click();

    // Check if the feedback shown in feedback list
    cy.get('.card').should('contain', 'Test Feedback');

    // Logout as admin and login as normal user
    cy.get('[data-cy=header-profile]').click();
    cy.get('[data-cy=header-logout]').click();
    cy.loginUser();

    // Click the test project and go to review list/project screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'projects');

    // Go to review screen
    cy.get('.title-card').click();
    cy.location('pathname').should('contain', 'reviews');

    // Check if the feedback shown in feedback list
    cy.get('.card').should('contain', 'Test Feedback');

    // Reply to the feedback above
    cy.get('[data-cy=feedback-0-reply]').click();

    // Create a reply feedback
    cy.get('[data-cy=feedback-textarea]').type('Test Reply Feedback');

    // Submit reply feedback
    cy.get('[data-cy=feedback-submit]').click();

    // Check if the feedback shown in feedback list
    cy.get('.card').should('contain', 'Test Reply Feedback');
  });

  it('can edit and delete feedback', () => {
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
    cy.get('[data-cy=cancel]').click();

    // Now video name should shown in mediaInfo bar
    cy.get('h6').should('contain', 'SampleVideo_1280x720_1mb');

    // Create a feedback
    cy.get('[data-cy=feedback-textarea]').type('Test Feedback');

    // Submit feedback
    cy.get('[data-cy=feedback-submit]').click();

    // Check if the feedback shown in feedback list
    cy.get('.card').should('contain', 'Test Feedback');

    // Edit the feedback
    cy.get('[data-cy=feedback-0-edit]').click();

    // Clear current feedback and write new one
    cy.get('[data-cy=feedback-textarea]').clear();
    cy.get('[data-cy=feedback-textarea]').type('Updated Feedback');

    // Submit feedback
    cy.get('[data-cy=feedback-submit]').click();

    // Check if the feedback shown in feedback list
    cy.get('.card').should('contain', 'Updated Feedback');

    // Delete the feedback
    cy.get('[data-cy=feedback-0-delete]').click();

    // Confirm delete
    cy.get('[data-cy=understood]').click();

    // Toast message is shown
    cy.get('.toast-body').should('contain', 'Feedback successfully deleted.');
  });
});
