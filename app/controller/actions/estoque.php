<?php
require_once('../estoque/crudEstoque.php');
require_once '../../model/sacole.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {

    switch($_POST['action']) {
        case 'registrarProducao':
            if (!isset($_POST['id']) && !isset($_POST['qtd'])) {
                echo "Parâmetros inválidos.";
                exit;
            }

            $id = $_POST['id'];
            $qtd = $_POST['qtd'];

            crudEstoque::listarProducao($id, $qtd);
        break;

        case 'enviarProduzidos':
            crudEstoque::updateAll();
        break;

        case 'apagaProduzido':
            crudEstoque::apagaProduzido();
        break;

        case 'desfazerLista':
            crudEstoque::desfazerLista();
        break;

        default:
            echo "Ação inválida.";
            break;
    }
    
}