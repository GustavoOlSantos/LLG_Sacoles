<?php
require_once '../../model/sacole.php';
class sacoleDAO {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function listarTodos() {
        $query = $this->conn->query("SELECT s.id, s.sabor, s.quantidade, s.tipo AS codTipo, t.tipo AS tipo, t.preco FROM sacoles s JOIN tipoSacole t ON s.tipo = t.id;");
        $arrs = $query->fetchAll(PDO::FETCH_ASSOC);
        $sacoles = [];

        foreach ($arrs as $arr) {
            $sacoles[] = new Sacole($arr['id'], $arr['sabor'], $arr['codTipo'],  $arr['tipo'], $arr['preco'], $arr['quantidade']);
        }

        return $sacoles;
    }

    public function listarPorId($id) {
        $query = $this->conn->prepare("SELECT s.id, s.sabor, s.quantidade, S.tipo AS codTipo, t.tipo AS tipo, t.preco FROM sacoles s JOIN tipoSacole t ON s.tipo = t.id WHERE s.id = ?;");
        $query->execute([$id]);
        $arr = $query->fetch(PDO::FETCH_ASSOC);
        
        $sacole = new Sacole($arr['id'], $arr['sabor'], $arr['codTipo'],  $arr['tipo'], $arr['preco'], $arr['quantidade']);
        return $sacole;
    }

    public function inserir(Sacole $s) {
        $query = $this->conn->prepare("INSERT INTO sacoles (sabor, tipo, quantidade) VALUES (?, ?, ?)");
        return $query->execute([$s->getSabor(), $s->getTipo(), $s->getQuantidade()]);
    }

    public function editar(Sacole $s) {
        $query = $this->conn->prepare("UPDATE sacoles SET sabor = ?, tipo = ? WHERE id = ?");
        return $query->execute([$s->getSabor(), $s->getTipo(), $s->getId()]);
    }

    public function atualizarQuantidade($id, $quantidade) {
        $query = $this->conn->prepare("UPDATE sacoles SET quantidade = quantidade + ? WHERE id = ?");
        return $query->execute([$quantidade, $id]);
    }

    public function apagar($id) {
        $query = $this->conn->prepare("DELETE FROM sacoles WHERE id = ?");
        return $query->execute([$id]);
    }
}
