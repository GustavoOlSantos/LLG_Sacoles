<?php
require_once '../../../config/database.php';
require_once '../../dao/sacoleDAO.php';
require_once '../../dao/tipoSacoleDAO.php';
require_once(__DIR__ . '../../../../config/url.php');

$dao = new sacoleDAO();
$sacoles = $dao->listarTodos();

$tipoDao = new sacoleDAO();
$sTipos = $tipoDao->listarTodos();

require '../../views/produtos/index.php';
