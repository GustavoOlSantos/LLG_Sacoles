describe("Tela de Vendas", () => {
  before(() => {
    // Fluxo independente: cadastra um sabor e dá entrada de estoque nele,
    // garantindo quantidade suficiente para os testes de venda abaixo,
    // sem depender de dados pré-existentes no banco.
    cy.saborUnico("Venda Base").then((sabor) => {
      cy.cadastrarProduto(sabor, "1").then(() => {
        cy.visit("/app/controller/estoque/listarEstoque.php");
        cy.get("a.addSacole").click();
        cy.get("#modalProd select[name='sacolesDisponiveis']").select(sabor);
        cy.get("#modalProd #qtdProduzida").type("50");
        cy.get("#modalProd").contains("button", "Ok").click();
        cy.get("#modalProd").contains("button", "Enviar Produzidos").click();
      });
      cy.wrap(sabor).as("saborBase");
    });
  });

  beforeEach(() => {
    cy.visit("/app/controller/vendas/novaVenda.php");
  });

  it("exibe a tela com o formulário de pedido e a tabela de estoque atual", () => {
    cy.contains("h2", "Venda de Sacolés").should("be.visible");
    cy.get("#sacoleSelecionado").should("be.visible");
    cy.get("#qtd").should("be.visible");
    cy.get("table").contains("th", "Sabor");
    cy.get("#tablePedido").should("exist");
  });

  it("alerta quando nenhum sabor é selecionado ao adicionar ao pedido", () => {
    cy.get("#qtd").type("1");
    cy.contains("button", "Adicionar").click();
    cy.get("#divMessages").should("be.visible").and("have.class", "alert-warning");
    cy.get("#textMessage").should("contain.text", "Selecione um sacolé.");
  });

  it("alerta quando a quantidade não é informada", function () {
    cy.get("#sacoleSelecionado").select(this.saborBase);
    cy.contains("button", "Adicionar").click();
    cy.get("#divMessages").should("be.visible").and("have.class", "alert-warning");
    cy.get("#textMessage").should(
      "contain.text",
      "Informe a quantidade de sacolés a serem vendidos."
    );
  });

  it("alerta quando a quantidade solicitada excede o estoque disponível", function () {
    cy.get("#sacoleSelecionado").select(this.saborBase);
    cy.get("#qtd").type("999999");
    cy.contains("button", "Adicionar").click();
    cy.get("#divMessages").should("be.visible").and("have.class", "alert-danger");
    cy.get("#textMessage").should(
      "contain.text",
      "Não há sacolés o suficiente disponíveis no estoque."
    );
  });

  it("adiciona um sacolé ao pedido e atualiza o total", function () {
    cy.get("#sacoleSelecionado").select(this.saborBase);
    cy.get("#qtd").type("2");
    cy.contains("button", "Adicionar").click();

    cy.get("#pedidoAtual tr").should("have.length.at.least", 1);
    cy.get("#pedidoAtual").contains("td", this.saborBase);
    cy.get("#TotalPedido").should("not.contain.text", "R$ 0,00");
  });

  it("remove um item do pedido ao clicar no ícone de excluir", function () {
    cy.get("#sacoleSelecionado").select(this.saborBase);
    cy.get("#qtd").type("1");
    cy.contains("button", "Adicionar").click();
    cy.get("#pedidoAtual tr").should("have.length.at.least", 1);

    cy.get("#pedidoAtual tr").first().find("a.tableAction").click();
    cy.get("#pedidoAtual tr").should("have.length", 0);
    cy.get("#TotalPedido").should("contain.text", "R$ 0,00");
  });

  it("limpa o pedido inteiro ao clicar em 'Limpar pedido'", function () {
    cy.get("#sacoleSelecionado").select(this.saborBase);
    cy.get("#qtd").type("3");
    cy.contains("button", "Adicionar").click();
    cy.get("#pedidoAtual tr").should("have.length.at.least", 1);

    cy.contains("a", "Limpar pedido").click();
    cy.get("#pedidoAtual tr").should("have.length", 0);
    cy.get("#TotalPedido").should("contain.text", "R$ 0,00");
  });

  describe("Popup: Selecione uma forma de pagamento (#modalPag)", () => {
    beforeEach(function () {
      cy.get("#sacoleSelecionado").select(this.saborBase);
      cy.get("#qtd").type("2");
      cy.contains("button", "Adicionar").click();
      cy.get("#pedidoAtual tr").should("have.length.at.least", 1);
    });

    it("não abre o modal se o pedido estiver vazio", () => {
      cy.contains("a", "Limpar pedido").click();
      cy.get("#pedidoAtual tr").should("have.length", 0);

      cy.contains("a", "Fechar venda").click();
      cy.get("#modalPag").should("not.be.visible");
      cy.get("#divMessages").should("be.visible").and("have.class", "alert-danger");
    });

    it("abre o modal de pagamento ao clicar em 'Fechar venda'", () => {
      cy.contains("a", "Fechar venda").click();
      cy.get("#modalPag").should("be.visible");
      cy.contains("#modalPag .modal-title", "Selecione uma forma de pagamento");
      cy.get("#regBtn").should("be.disabled");
    });

    it.only("fecha o modal de pagamento ao clicar em 'Fechar'", () => {
      cy.contains("a", "Fechar venda").click();
      cy.wait(500);
      cy.get("#modalPag").should("be.visible");
      cy.get("#modalPag").contains("button", "Fechar").click();
      cy.wait(500);
      cy.get("#modalPag").should("not.be.visible");
    });

    it("exibe o formulário de troco ao selecionar 'Dinheiro' e calcula o valor a devolver", () => {
      cy.contains("a", "Fechar venda").click();
      cy.get("#modalPag #dinheiro").check({ force: true });

      cy.get("#divPag #tot").should("be.visible");
      cy.get("#divPag #pago").should("be.visible");
      cy.get("#divPag #troco").should("be.visible");

      cy.get("#divPag #tot").invoke("val").then((total) => {
        const valorPago = (Number(total) + 10).toString();
        cy.get("#divPag #pago").type(valorPago);
        cy.get("#divPag #troco").should("have.value", "10.00");
      });

      cy.get("#regBtn").should("be.enabled");
    });

    it("exibe o QR Code do Pix e o valor total ao selecionar 'Pix'", () => {
      cy.contains("a", "Fechar venda").click();
      cy.get("#modalPag #pix").check({ force: true });

      cy.get("#divPag img").should("be.visible").and("have.attr", "src");
      cy.get("#divPag #tot").should("contain.text", "Valor Total: R$");
      cy.get("#regBtn").should("be.enabled");
    });

    it("registra a venda, dá baixa no estoque e limpa o pedido", () => {
      cy.contains("a", "Fechar venda").click();
      cy.get("#modalPag #pix").check({ force: true });
       cy.wait(500);
      cy.get("#regBtn").should("be.enabled").click();
      cy.wait(1000);

      cy.get("#divMessages").should("be.visible").and("have.class", "alert-success");
      cy.get("#modalPag").should("not.be.visible");
      cy.get("#pedidoAtual tr").should("have.length", 0);
      cy.get("#TotalPedido").should("contain.text", "R$ 0,00");
    });
  });
});
