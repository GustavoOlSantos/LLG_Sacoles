<?php
class Venda {
    private $id, $sacolesVendidos, $data, $total;

    public function __construct($id = null, $sacolesVendidos = null, $data = null, $total = null) {
        $this->id = $id;
        $this->sacolesVendidos = $sacolesVendidos ?? []; 
        $this->data = $data;
        $this->total = $total;
    }

    public function getId() { return $this->id; }
    public function getSacolesVendidos() { return $this->sacolesVendidos; }
    public function getData() { return $this->data; }
    public function getTotal() { return $this->total; }

    public function setId($id) { $this->id = $id; }
    public function setSacolesVendidos($sacolesVendidos) { $this->sacolesVendidos = $sacolesVendidos; }
    public function setData($data) { $this->data = $data; }
    public function setTotal($total) { $this->total = $total; }

    public function appendSacole($sacole) { 
        $this->sacolesVendidos[] = $sacole; 
    }
}