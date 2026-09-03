Cypress.Commands.add("saborUnico", (prefixo = "Sabor Teste") => {
  const sufixo = Date.now().toString().slice(-6);
  return `${prefixo} ${sufixo}`;
});

Cypress.Commands.add("cadastrarProduto", (sabor, tipo = "1") => {
  cy.visit("/app/controller/produtos/listarProdutos.php");
  cy.get("a.addSacole").click();
  cy.wait(500);
  cy.get("#modalAdd").should("be.visible");

  cy.get("#modalAdd #sabor").type(sabor);
  cy.wait(500);
  cy.get("#modalAdd #tipo").select(tipo);
  cy.get("#modalAdd form").contains("button", "Salvar").click();
  cy.wait(500);

  cy.url().should("include", "listarProdutos.php");
  cy.contains("table tbody tr", sabor).should("be.visible");

  return cy.wrap(sabor);
});

Cypress.Commands.add("linhaDoProduto", (sabor) => {
  return cy.contains("table tbody tr", sabor);
});
