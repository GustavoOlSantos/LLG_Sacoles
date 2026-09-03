describe("Tela de Produtos", () => {
  beforeEach(() => {
    cy.visit("/app/controller/produtos/listarProdutos.php");
  });

  it("exibe a tabela de sacolés cadastrados com as colunas esperadas", () => {
    cy.contains("h2", "Sacolés Disponíveis para Venda").should("be.visible");
    cy.get("table.table").within(() => {
      cy.contains("th", "Sabor");
      cy.contains("th", "Tipo");
      cy.contains("th", "Valor");
      cy.contains("th", "Edit");
      cy.contains("th", "Del");
    });
  });

  it("exibe os botões de ação 'Adicionar Novo Sabor' e 'Configurar Valores'", () => {
    cy.get("a.addSacole").should("be.visible").and("contain.text", "Adicionar Novo Sabor");
    cy.get("a.config").should("be.visible").and("contain.text", "Configurar Valores");
  });

  describe("Popup: Adicionar Novo Sabor (#modalAdd)", () => {
    it("abre e fecha o modal ao clicar em 'Cancelar'", () => {
      cy.get("a.addSacole").click();
      cy.get("#modalAdd").should("be.visible");
      cy.contains("#modalAdd .modal-title", "Adicionar Sacolé");

      cy.get("#modalAdd").contains("button", "Cancelar").click();
      cy.get("#modalAdd").should("not.be.visible");
    });

    it("preenche automaticamente o preço ao selecionar o tipo do sacolé", () => {
      cy.get("a.addSacole").click();
      cy.get("#modalAdd #tipo").select("Tradicional");
      cy.get("#modalAdd #preco").invoke("val").then((precoTradicional) => {
        expect(Number(precoTradicional)).to.be.greaterThan(0);
      });

      cy.get("#modalAdd #tipo").select("Gourmet");
      cy.get("#modalAdd #preco").invoke("val").then((precoGourmet) => {
        expect(Number(precoGourmet)).to.be.greaterThan(0);
      });
    });

    it("exige o preenchimento do campo Sabor antes de enviar", () => {
      cy.get("a.addSacole").click();
      cy.get("#modalAdd #sabor").then(($input) => {
        expect($input[0].checkValidity()).to.eq(false);
      });
    });

    it("cadastra um novo sabor e o exibe na listagem após o redirecionamento", () => {
      cy.saborUnico("Morango").then((sabor) => {
        cy.get("a.addSacole").click();
        cy.get("#modalAdd #sabor").type(sabor);
        cy.get("#modalAdd #tipo").select("Tradicional");
        cy.get("#modalAdd form").contains("button", "Salvar").click();

        cy.url().should("include", "listarProdutos.php");
        cy.contains("table tbody tr", sabor).within(() => {
          cy.contains("td", "Tradicional");
        });
      });
    });
  });

  describe("Popup: Configurar Valores (#modalPrices)", () => {
    it("abre o modal já preenchido com os preços atuais de Tradicional e Gourmet", () => {
      cy.get("a.config").click();
      cy.get("#modalPrices").should("be.visible");
      cy.contains("#modalPrices .modal-title", "Configurar Preço");

      cy.get("#modalPrices #normal").invoke("val").should("not.be.empty");
      cy.get("#modalPrices #gourmet").invoke("val").should("not.be.empty");
    });

    it("fecha ao clicar em 'Cancelar' sem alterar os preços", () => {
      cy.get("a.config").click();
      cy.wait(500);
      cy.get("#modalPrices").contains("button", "Cancelar").click();
      cy.get("#modalPrices").should("not.be.visible");
    });

    it("atualiza os preços dos tipos Tradicional e Gourmet", () => {
      cy.get("a.config").click();
      cy.wait(500);
      cy.get("#modalPrices #normal").clear().type("4.5");
      cy.get("#modalPrices #gourmet").clear().type("6.5");
      cy.get("#modalPrices form").contains("button", "Confirmar").click();

      cy.url().should("include", "listarProdutos.php");

      cy.get("a.config").click();
      cy.wait(500);
      cy.get("#modalPrices #normal").should("have.value", "4.5");
      cy.get("#modalPrices #gourmet").should("have.value", "6.5");
      cy.get("#modalPrices").contains("button", "Cancelar").click();
    });
  });

  describe("Popup: Editar Sacolé (#modalEdit)", () => {
    it("carrega via AJAX os dados do sacolé selecionado", () => {
      cy.saborUnico("Uva").then((sabor) => {
        cy.cadastrarProduto(sabor, "1");

        cy.linhaDoProduto(sabor).find("a.edit").click();
        cy.get("#modalEdit").should("be.visible");
        cy.contains("#modalEdit .modal-title", "Editar Sacolé");

        cy.get("#modalEdit .editBody #sabor").should("have.value", sabor);
      });
    });

    it("edita o sabor de um sacolé existente e reflete a alteração na listagem", () => {
      cy.saborUnico("Coco").then((sabor) => {
        cy.cadastrarProduto(sabor, "1");
        const novoSabor = `${sabor} Editado`;

        cy.linhaDoProduto(sabor).find("a.edit").click();
        cy.wait(500);
        cy.get("#modalEdit .editBody #sabor").should("have.value", sabor);
        cy.get("#modalEdit .editBody #sabor").clear();
        cy.wait(500);
        cy.get("#modalEdit .editBody #sabor").type(novoSabor);
        cy.get("#modalEdit .editBody form").contains("button", "Salvar").click();

        cy.url().should("include", "listarProdutos.php");
        cy.contains("table tbody tr", novoSabor).should("be.visible");
      });
    });

    it("fecha o modal de edição ao clicar em 'Cancelar'", () => {
      cy.saborUnico("Limão").then((sabor) => {
        cy.cadastrarProduto(sabor, "1");
        cy.wait(500);
        cy.linhaDoProduto(sabor).find("a.edit").click();
        cy.wait(500);
        cy.get("#modalEdit .editBody form").contains("button", "Cancelar").click();
        cy.wait(500);
        cy.get("#modalEdit").should("not.be.visible");
      });
    });
  });

  describe("Popup: Excluir Sacolé (#modalDel)", () => {
    it("exibe o nome do sacolé selecionado na mensagem de confirmação", () => {
      cy.saborUnico("Abacaxi").then((sabor) => {
        cy.cadastrarProduto(sabor, "1");
        cy.wait(500);
        cy.linhaDoProduto(sabor).find('a[data-bs-target="#modalDel"]').click();
        cy.wait(500);

        cy.get("#modalDel").should("be.visible");
        cy.get("#modalDel #h5Apagar").should("contain.text", sabor);
      });
    });

    it("cancela a exclusão sem remover o item da listagem", () => {
      cy.saborUnico("Maracujá").then((sabor) => {
        cy.cadastrarProduto(sabor, "1");
        cy.linhaDoProduto(sabor).find('a[data-bs-target="#modalDel"]').click();
        cy.wait(500);
        cy.get("#modalDel").contains("button", "Cancelar").click();
        cy.wait(500);
        cy.get("#modalDel").should("not.be.visible");
        cy.contains("table tbody tr", sabor).should("be.visible");
      });
    });

    it("confirma a exclusão e remove o sacolé da listagem", () => {
      cy.saborUnico("Acerola").then((sabor) => {
        cy.cadastrarProduto(sabor, "1");
        cy.wait(500);
        cy.linhaDoProduto(sabor).find('a[data-bs-target="#modalDel"]').click();
        cy.wait(500);
        cy.get("#modalDel form").contains("button", "Confirmar").click();
        cy.wait(500);

        cy.url().should("include", "listarProdutos.php");
        cy.contains("table tbody tr", sabor).should("not.exist");
      });
    });
  });
});
