<?php
require_once '../../../config/database.php';
require_once '../../dao/sacoleDAO.php';
require_once '../../dao/vendaDAO.php';
require_once '../../dao/tiposacoleDAO.php';
require_once '../../model/venda.php';
require_once '../../model/sacole.php';

class crudVenda {
    
    public static function listarProduto($id, $qtd, $qtdEmEstoque) {
        session_start();

        $dao = new sacoleDAO();
        $sacolePedido = $dao->listarPorId($id);

        if (!isset($_SESSION['listPedido'])) {
            $_SESSION['listPedido'] = [];
        }

        $repetido = false;
        foreach ($_SESSION['listPedido'] as &$item) {
            if ($item['id'] == $id) {

                if ($item['quantidade'] + $qtd > $qtdEmEstoque) {
                    echo json_encode(['success' => false, 'message' => 'Não há sacolés o suficiente disponíveis no estoque.', 'errorLog' => '']);
                    return;
                }

                $item['quantidade'] += $qtd;
                $repetido = true;
                break;
            }
        }

        if (!$repetido && $sacolePedido) {
            $_SESSION['listPedido'][] = [
                'id' => $sacolePedido->getId(),
                'sabor' => $sacolePedido->getSabor(),
                'codTipo' => $sacolePedido->getCodTipo(),
                'tipo' => $sacolePedido->getTipo(),
                'preco' => $sacolePedido->getPreco(),
                'quantidade' => $qtd
            ];
        }
        echo json_encode(['success' => true, 'message' => '', 'errorLog' => '']);
    }

    public static function checaPedido() {
        session_start();

        if (!isset($_SESSION['listPedido'])) {
            echo json_encode(['success' => false, 'message' => 'Não há itens no pedido.', 'errorLog' => '']);
            return;
        }

        else{
            echo json_encode(['success' => true]);
            return;
        }
    }

    public static function carregarPagamento($fpg) {
        switch($fpg){
            case 1: require '../../views/vendas/partials/pix.php'; break;
            case 2: require '../../views/vendas/partials/dinheiro.php'; break;
        }
    }

    public static function registrarVenda() {
        session_start();

        if (!isset($_SESSION['listPedido'])) {
            echo json_encode(['success' => false, 'message' => 'Não há itens no pedido.', 'errorLog' => '']);
            return;
        }

        $dao = new vendaDAO();
        $venda = new Venda();
        $total = 0;

        $listPedido = Sacole::listaArrayToObject($_SESSION['listPedido']);
        foreach ($listPedido as $sacole) {
            $total += $sacole->getPreco() * $sacole->getQuantidade();
        }

        $venda->setSacolesVendidos($listPedido);
        $venda->setData(date('Y-m-d H:i:s'));
        $venda->setTotal($total);
 
        $dao->inserirVenda($venda);
    }

    public static function apagarSacole($id) {
        session_start();
        $_SESSION['listPedido'] = array_values(array_filter($_SESSION['listPedido'], function($item) use ($id) {
            return (int)$item['id'] !== (int)$id;
        }));        

        $listPedido = Sacole::listaArrayToObject($_SESSION['listPedido']);
        require '../../views/vendas/partials/renderPedido.php';
    }

    public static function limparPedido() {
        session_start();
  
        if (isset($_SESSION['listPedido'])) {
            unset($_SESSION['listPedido']);
        }

        $listPedido = [];
    
        require '../../views/vendas/partials/renderPedido.php';
    }

    public static function atualizarPedido() {
        session_start();

        $listPedido = Sacole::listaArrayToObject($_SESSION['listPedido']);
        require '../../views/vendas/partials/renderPedido.php';
    }

    public static function atualizaEstoque() {
        session_start();
        $dao = new sacoleDAO();
        $estoqueSacoles = $dao->listarTodos();
        require '../../views/vendas/partials/renderEstoque.php';
    }
}

