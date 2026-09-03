<?php
require_once('../produtos/crudProdutos.php');
require_once '../../model/sacole.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {

    switch($_POST['action']) {

        case 'inserir':
            $sacole = new Sacole();
            $sacole->setSabor($_POST['sabor']);
            $sacole->setTipo($_POST['tipo']);
            $sacole->setPreco($_POST['preco']);
            $sacole->setQuantidade(0);

            crudProdutos::inserir($sacole);
        break;

        case 'editar':
            if(isset($_POST['id'])) {
                $sacole = new Sacole();
                $sacole->setId($_POST['id']);
                $sacole->setSabor($_POST['sabor']);
                $sacole->setTipo($_POST['tipo']);
                $sacole->setPreco($_POST['preco']);

                crudProdutos::editar($sacole);
            }
            else {
                echo "ID não fornecido.";
            }
            
        break;

        case 'apagar':
            if(isset($_POST['id'])) {
                $dao = new sacoleDAO();
                crudProdutos::apagar($_POST['id']);
            } else {
                echo "ID não fornecido.";
            }
        break;

        case 'listarModal':
            if(isset($_POST['id'])) {
                crudProdutos::listarUmModal($_POST['id']);
            } else {
                echo "ID não fornecido.";
            }
        break;

        case 'configurarPreco':
            if(!isset($_POST['normal']) || !isset($_POST['gourmet'])) {
                throw new Exception("Preços dos tipos de sacolé não fornecidos.");
            } 

            $precoNormal = $_POST['normal'];
            $precoGourmet = $_POST['gourmet'];
            
            crudProdutos::configurarPreco($precoNormal, $precoGourmet);
        break;

        default:
            echo "Ação inválida.";
            break;
    }
}