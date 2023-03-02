describe('Page has valid content', () => {
  before(() => {
    cy.visit('/');

    cy.wait(500);
  });

  it('Check available titles', function () {
    cy.wait(500);
    cy.url().should('include', '');
    cy.get('#add-member-title').contains('Add Member').should('be.visible');
    cy.get('#member-list-title').contains('Member List').should('be.visible');
    cy.get('#holiday-expenses-calculation-title').should('not.exist');
  });
});
