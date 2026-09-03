<?php
require_once '../../../config/database.php';
require_once '../../dao/tipoSacoleDAO.php';

header('Content-Type: application/json');

if (isset($_GET['tipo'])) {
    $tipoId = $_GET['tipo'];

    $dao = new tipoSacoleDAO();
    $preco = $dao->buscarPrecoPorId($tipoId);

    if ($preco !== null) {
        echo json_encode(['success' => true, 'preco' => $preco]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Preço não encontrado.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Parâmetro inválido.']);
}

