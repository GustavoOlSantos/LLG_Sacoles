<?php
require_once '../../../config/database.php';
require_once '../../dao/sacoleDAO.php';
require_once '../../dao/tipoSacoleDAO.php';
require_once '../../model/sacole.php';

class crudEstoque {

    //=> Métodos de Modal
    
    public static function listarProducao($id, $qtd) {
        session_start();

        $dao = new sacoleDAO();
        $sacoleProduzido = $dao->listarPorId($id);

        if (!isset($_SESSION['listProduzidos'])) {
            $_SESSION['listProduzidos'] = [];
        }

        $repetido = false;
        foreach ($_SESSION['listProduzidos'] as &$item) {
            if ($item['id'] == $id) {
                $item['quantidade'] += $qtd;
                $repetido = true;
                break;
            }
        }

        if (!$repetido && $sacoleProduzido) {
            $_SESSION['listProduzidos'][] = [
                'id' => $sacoleProduzido->getId(),
                'sabor' => $sacoleProduzido->getSabor(),
                'codTipo' => $sacoleProduzido->getCodTipo(),
                'tipo' => $sacoleProduzido->getTipo(),
                'preco' => $sacoleProduzido->getPreco(),
                'quantidade' => $qtd
            ];
        }

        $listProduzidos = Sacole::listaArrayToObject($_SESSION['listProduzidos']);
        
        require '../../views/estoque/renderProduzidos.php';

    }

    public static function apagaProduzido() {
        session_start();

        if (!isset($_SESSION['listProduzidos'])) {
            echo "Nenhum item encontrado.";
            return;
        }

        $id = $_POST['id'];
        $listProduzidos = Sacole::listaArrayToObject($_SESSION['listProduzidos']);

        foreach ($listProduzidos as $key => $sacole) {
            if ($sacole->getId() == $id) {
                unset($_SESSION['listProduzidos'][$key]);
                break;
            }
        }

        $_SESSION['listProduzidos'] = array_values($_SESSION['listProduzidos']);
        $listProduzidos = Sacole::listaArrayToObject($_SESSION['listProduzidos']);
        require '../../views/estoque/renderProduzidos.php';
    }

    static function desfazerLista() {
        session_start();

        if (isset($_SESSION['listProduzidos'])) {
            unset($_SESSION['listProduzidos']);
        }
    }

    public static function updateAll() {
        session_start();

        if (!isset($_SESSION['listProduzidos']) || empty($_SESSION['listProduzidos'])) {
           echo "Nenhum item encontrado.";
           return;
        }
        
        $listProduzidos = Sacole::listaArrayToObject($_SESSION['listProduzidos']);
        $dao = new sacoleDAO();

        foreach ($listProduzidos as $sacole) {
            $dao->atualizarQuantidade($sacole->getId(), $sacole->getQuantidade());
        }
        unset($_SESSION['listProduzidos']);
    }
}

