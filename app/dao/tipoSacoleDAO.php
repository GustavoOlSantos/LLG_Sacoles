<?php
class tipoSacoleDAO {
    private $conn;

    public function __construct() {
        $this->conn = Database::getConnection();
    }

    public function listarTodos() {
        $query = $this->conn->query("SELECT * FROM tiposacole");
        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarPrecoPorId($tipoId) {
        $exec = $this->conn->prepare("SELECT preco FROM tiposacole WHERE id = ?");
        $exec->execute([$tipoId]);
        $r = $exec->fetch(PDO::FETCH_ASSOC);
        return $r['preco'];
    }

    public function configurarPreco($precoNormal, $precoGourmet) {
    
        try {
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $exec = $this->conn->prepare("UPDATE tiposacole SET preco = ? WHERE id = 1");
            $exec->execute([$precoNormal]);

            $exec = $this->conn->prepare("UPDATE tiposacole SET preco = ? WHERE id = 2");
            $exec->execute([$precoGourmet]);

        } catch (PDOException $e) {
            die("Erro ao atualizar preços: " . $e->getMessage());
        }
    }
}
