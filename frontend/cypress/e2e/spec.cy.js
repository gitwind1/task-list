describe('add todo', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/test')
    cy.get('input[name="addTodo"]').type('new todo item');
    cy.get('button[name="addTodoButton"]').click();
    cy.contains('new todo item').should('be.visible');
  })
})