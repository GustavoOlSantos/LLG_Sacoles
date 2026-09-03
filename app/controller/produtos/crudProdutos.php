<?php
require_once '../../../config/database.php';
require_once '../../dao/sacoleDAO.php';
require_once '../../dao/tiposacoleDAO.php';

class crudProdutos {
    public static function inserir($sacole) {
        if($sacole->isValidoCadastro()) {
            $dao = new sacoleDAO();
            $dao->inserir($sacole);
        }

        header("Location: ../produtos/listarProdutos.php");
    }

    public static function editar($sacole) {
        if($sacole->isValidoCadastro()) {
            $dao = new sacoleDAO();
            $dao->editar($sacole);
        }

        header("Location: ../produtos/listarProdutos.php");
    }

    public static function apagar($id) {
        $dao = new sacoleDAO();
        $dao->apagar($id);

        header("Location: ../produtos/listarProdutos.php");
    }

    public static function configurarPreco($precoNormal, $precoGourmet) {
        $dao = new TiposacoleDAO();
        $dao->configurarPreco($precoNormal, $precoGourmet);
        
        header("Location: ../produtos/listarProdutos.php");
    }

    //=> Métodos de Modal
    
    public static function listarUmModal($id) {
        $dao = new sacoleDAO();
        $sacole = $dao->listarPorId($id);
        
        require '../../views/produtos/editarModal.php';

    }
}

