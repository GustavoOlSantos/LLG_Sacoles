<?php
require_once('../vendas/crudVenda.php');
require_once '../../model/sacole.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {

    switch($_POST['action']) {
        case 'registrarProduto':
            if (!isset($_POST['id']) && !isset($_POST['qtd'])) {
                echo "Parâmetros inválidos.";
                exit;
            }

            $id = $_POST['id'];
            $qtd = $_POST['qtd'];
            $qtdEmEstoque = $_POST['qtdEmEstoque'];

            crudVenda::listarProduto($id, $qtd, $qtdEmEstoque);
        break;

        case 'checaPedido': 
            crudVenda::checaPedido();
        break;

        case 'carregarPagamento':
            $formaPg = $_POST['formaPagamento'];
            crudVenda::carregarPagamento($formaPg);
        break;

        case 'registrarVenda': 
            crudVenda::registrarVenda();
        break;

        case 'apagarSacole':
            if (!isset($_POST['id'])) {
                echo "Sem sacolé para apagar";
                exit;
            }

            $id = $_POST['id'];
            crudVenda::apagarSacole($id);
        break;

        case 'limparPedido':
            crudVenda::limparPedido();
        break;

        case 'atualizarPedido':
            crudVenda::atualizarPedido();
        break;

        case 'atualizaEstoque':
            crudVenda::atualizaEstoque();
        break;

        default:
            echo "Ação inválida.";
            break;
    }
    
}