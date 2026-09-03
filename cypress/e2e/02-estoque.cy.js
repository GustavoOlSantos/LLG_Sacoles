describe("Tela de Estoque", () => {
  before(() => {
    cy.saborUnico("Estoque Base").then((sabor) => {
      cy.cadastrarProduto(sabor, "1");
      cy.wait(500);
      cy.wrap(sabor).as("saborBase");
    });
  });

  beforeEach(() => {
    cy.visit("/app/controller/estoque/listarEstoque.php");
  });

  it("exibe a tabela de estoque atual com as colunas esperadas", () => {
    cy.contains("h2", "Estoque atual de Sacolés").should("be.visible");
    cy.get("table.table").within(() => {
      cy.contains("th", "Sabor");
      cy.contains("th", "Quantidade");
      cy.contains("th", "V. Unid");
      cy.contains("th", "V. Total");
    });
  });

  it("destaca em vermelho as linhas de sacolés com quantidade zerada", function () {
    cy.contains("table tbody tr", this.saborBase)
      .find("td")
      .eq(1)
      .then(($qtd) => {
        if ($qtd.text().trim() === "0") {
          cy.contains("table tbody tr", this.saborBase).should(
            "have.class",
            "table-danger"
          );
        }
      });
  });

  it("exibe o botão para abrir o popup de Produção", () => {
    cy.get("a.addSacole").should("be.visible").and("contain.text", "Produção");
  });

  describe("Popup: Produção de Sacolé (#modalProd)", () => {
    it("abre o modal com o select de sabores e o campo de quantidade", () => {
      cy.get("a.addSacole").click();
      cy.wait(500);
      cy.get("#modalProd").should("be.visible");
      cy.contains("#modalProd .modal-title", "Produção de Sacolé");
      cy.get("#modalProd select[name='sacolesDisponiveis']").should("be.visible");
      cy.get("#modalProd #qtdProduzida").should("be.visible");
    });

    it("alerta quando nenhum sabor é selecionado ao clicar em 'Ok'", () => {
      const alertStub = cy.stub();
      cy.on("window:alert", alertStub);

      cy.get("a.addSacole").click();
      cy.wait(500);
      cy.get("#modalProd #qtdProduzida").type("5");
      cy.get("#modalProd").contains("button", "Ok").click().then(() => {
        expect(alertStub).to.have.been.calledWith(
          "Selecione um sacole disponível."
        );
      });
    });

    it("alerta quando a quantidade produzida não é informada", function () {
      const alertStub = cy.stub();
      cy.on("window:alert", alertStub);

      cy.get("a.addSacole").click();
      cy.get("#modalProd select[name='sacolesDisponiveis']").select(this.saborBase);
      cy.get("#modalProd").contains("button", "Ok").click().then(() => {
        expect(alertStub).to.have.been.calledWith(
          "Informe a quantidade produzida."
        );
      });
    });

    it("registra um sabor produzido e o lista na tabela 'Sacolés Produzidos'", function () {
      cy.get("a.addSacole").click();
      cy.get("#modalProd select[name='sacolesDisponiveis']").select(this.saborBase);
      cy.get("#modalProd #qtdProduzida").type("10");
      cy.get("#modalProd").contains("button", "Ok").click();

      cy.get("#sacolesProduzidos table tbody tr").should("have.length.at.least", 1);
      cy.get("#sacolesProduzidos").contains("td", this.saborBase);
      cy.get("#sacolesProduzidos").contains("td", "10");
    });

    it("remove um item da lista de produzidos ao clicar em excluir", function () {
      cy.get("a.addSacole").click();
      cy.get("#modalProd select[name='sacolesDisponiveis']").select(this.saborBase);
      cy.get("#modalProd #qtdProduzida").type("3");
      cy.get("#modalProd").contains("button", "Ok").click();

      cy.get("#sacolesProduzidos table tbody tr").its("length").then((qtdAntes) => {
        cy.get("#sacolesProduzidos table tbody tr")
          .first()
          .find("a.tableAction")
          .click();

        cy.get("#sacolesProduzidos table tbody tr").should(
          "have.length",
          qtdAntes - 1
        );
      });
    });

    it("descarta a lista de produzidos ao clicar em 'Fechar'", function () {
      cy.get("a.addSacole").click();
      cy.wait(500);
      cy.get("#modalProd select[name='sacolesDisponiveis']").select(this.saborBase);
      cy.get("#modalProd #qtdProduzida").type("4");
      cy.get("#modalProd").contains("button", "Ok").click();
      cy.get("#sacolesProduzidos table tbody tr").should("have.length.at.least", 1);

      cy.get("#modalProd").contains("button", "Fechar").click();
      cy.get("#modalProd").should("not.be.visible");
    });

    it("confirma a produção com 'Enviar Produzidos' e atualiza o estoque", function () {
      cy.get("a.addSacole").click();
      cy.get("#modalProd select[name='sacolesDisponiveis']").select(this.saborBase);
      cy.get("#modalProd #qtdProduzida").type("7");
      cy.get("#modalProd").contains("button", "Ok").click();

      const alertStub = cy.stub();
      cy.on("window:alert", alertStub);

      cy.get("#modalProd").contains("button", "Enviar Produzidos").click().then(() => {
        expect(alertStub).to.have.been.calledWith(
          "Quantidades atualizadas com sucesso!"
        );
      });

      // A página recarrega após a confirmação.
      cy.contains("h2", "Estoque atual de Sacolés").should("be.visible");
    });
  });
});
