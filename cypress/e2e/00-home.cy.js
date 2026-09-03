describe("Tela Inicial", () => {
  beforeEach(() => {
    cy.visit("/app/views/");
  });

  it("exibe o menu, a saudação e os quatro cartões de acesso", () => {
    cy.get("nav.navbar").should("be.visible");
    cy.get("nav.navbar").contains("LLG").should("be.visible");
    cy.contains("h2", "Bem vindo!").should("be.visible");

    cy.contains(".card", "Venda de Sacolé").should("be.visible");
    cy.contains(".card", "Estoque").should("be.visible");
    cy.contains(".card", "Produtos").should("be.visible");
    cy.contains(".card", "Relatórios").should("be.visible");
  });

  it("o menu superior possui os links para Início, Vendas, Estoque e Produtos", () => {
    cy.get("nav.navbar").within(() => {
      cy.contains("a.nav-link", "Início").should("have.attr", "href");
      cy.contains("a.nav-link", "Vendas").should(
        "have.attr",
        "href"
      ).and("include", "novaVenda.php");
      cy.contains("a.nav-link", "Estoque").should(
        "have.attr",
        "href"
      ).and("include", "listarEstoque.php");
      cy.contains("a.nav-link", "Produtos").should(
        "have.attr",
        "href"
      ).and("include", "listarProdutos.php");
    });
  });

  it("navega para a tela de Vendas ao clicar no cartão 'Venda de Sacolé'", () => {
    cy.contains(".card", "Venda de Sacolé").click();
    cy.url().should("include", "novaVenda.php");
    cy.contains("h2", "Venda de Sacolés").should("be.visible");
  });

  it("navega para a tela de Estoque ao clicar no cartão 'Estoque'", () => {
    cy.contains(".card", "Estoque").click();
    cy.url().should("include", "listarEstoque.php");
    cy.contains("h2", "Estoque atual de Sacolés").should("be.visible");
  });

  it("navega para a tela de Produtos ao clicar no cartão 'Produtos'", () => {
    cy.contains(".card", "Produtos").click();
    cy.url().should("include", "listarProdutos.php");
    cy.contains("h2", "Sacolés Disponíveis para Venda").should("be.visible");
  });

  it("o cartão 'Relatórios' ainda não navega para nenhuma tela (funcionalidade em desenvolvimento)", () => {
    cy.contains(".card", "Relatórios")
      .should("have.attr", "href", "#");
  });

  it("os links do menu superior navegam corretamente a partir de qualquer tela", () => {
    cy.visit("/app/controller/estoque/listarEstoque.php");
    cy.get("nav.navbar").contains("a.nav-link", "Produtos").click();
    cy.url().should("include", "listarProdutos.php");
  });
});
