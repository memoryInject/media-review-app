// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')
require('cypress-dark');

const apiUrl = Cypress.env('apiUrl');

// Login user via UI
Cypress.Commands.add('loginUser', (user = Cypress.env('user')) => {
  cy.visit('/login');
  cy.contains('Email Address').type(user.email);
  cy.contains('Password').type(user.password);
  cy.get('.btn').contains('Sign In').click();
});

// Login admin via UI
Cypress.Commands.add('loginAdmin', (user = Cypress.env('admin')) => {
  cy.visit('/login');
  cy.contains('Email Address').type(user.email);
  cy.contains('Password').type(user.password);
  cy.get('.btn').contains('Sign In').click();
});

// Get logged in token
Cypress.Commands.add('getToken', (user = Cypress.env('user')) => {
  return cy
    .request({
      method: 'POST',
      url: `${apiUrl}/api/v1/auth/login/`,
      body: {
        email: user.email,
        password: user.password,
      },
      failOnStatusCode: false,
    })
    .its('body.key')
    .should('exist');
});

// Create a project
Cypress.Commands.add('createProject', () => {
  cy.getToken(Cypress.env('admin')).then((token) => {
    const authorization = `token ${token}`;

    const newProject = {
      projectName: 'Test Project',
    };

    const options = {
      method: 'POST',
      url: `${apiUrl}/api/v1/review/projects/`,
      headers: { authorization },
      body: {
        ...newProject,
      },
    };

    return cy.request(options).its('status').should('eq', 201);
  });
});

// Create review for project id 1
Cypress.Commands.add(
  'createReview',
  (
    project = 1,
    reviewName = 'Test Review',
    description = 'Test Description',
    collaborators = [1, 2, 3, 4, 5]
  ) => {
    cy.getToken(Cypress.env('admin')).then((token) => {
      const authorization = `token ${token}`;

      const newReview = {
        reviewName,
        description,
        collaborators,
        project,
      };

      const options = {
        method: 'POST',
        url: `${apiUrl}/api/v1/review/reviews/`,
        headers: { authorization },
        body: {
          ...newReview,
        },
      };

      return cy.request(options).its('status').should('eq', 201);
    });
  }
);
