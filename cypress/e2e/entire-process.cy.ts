describe('Run entire process', () => {
  before(() => {
    cy.visit('/');
    cy.wait(500);
  });

  it('Fill out inputs and click add button then settle-up calculation', function () {
    cy.wait(500);

    // Add New Name and Amount
    cy.get('input[ng-reflect-name="name"]').first().click().clear().type('John');
    cy.get('input[ng-reflect-name="amount"]').first().click().clear().type("4");
    cy.get('#add-new-member-btn').click();
    cy.wait(500);

    // Check input values, they should be blank
    cy.get('input[ng-reflect-name="name"]').first().invoke('val').should('eq', '');
    cy.get('input[ng-reflect-name="amount"]').first().invoke('val').should('eq', '');

    cy.wait(500);

    // Add New Name and Amount
    cy.get('input[ng-reflect-name="name"]').first().click().clear().type('Mark');
    cy.get('input[ng-reflect-name="amount"]').first().click().clear().type("6");
    cy.get('#add-new-member-btn').click();
    cy.wait(500);

    // Check input values, they should be blank
    cy.get('input[ng-reflect-name="name"]').first().invoke('val').should('eq', '');
    cy.get('input[ng-reflect-name="amount"]').first().invoke('val').should('eq', '');

    // Trigger request and fetch data
    cy.wait(500);
    cy.get('#settle-up-btn').click();

    cy.wait(1000);

    // Calculation section should be available
    cy.get('#member-list-title').contains('Member List').should('be.visible');
    cy.get('#holiday-expenses-calculation-title').contains('Holiday Expenses Calculation').should('be.visible');

    // Check values
    cy.get('#total-value').contains('Total: 10').should('be.visible');
    cy.get('#equal-share-value').contains('Equal Share: 5').should('be.visible');

    cy.wait(1000);

    // Reset data
    cy.get('#reset-btn').click();
    cy.wait(500);

    cy.url().should('include', '');
    cy.get('#add-member-title').contains('Add Member').should('be.visible');
    cy.get('#member-list-title').contains('Member List').should('be.visible');
    cy.get('#holiday-expenses-calculation-title').should('not.exist');
  });
});
