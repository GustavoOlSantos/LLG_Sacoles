# 🧊 Sacolé Vendas

Este projeto é um sistema de gerenciamento de vendas e estoque de sacolés. Ele permite cadastrar, editar, excluir e visualizar informações sobre os produtos disponíveis, além de configurar preços e gerenciar o estoque.

---

## ✅ Funcionalidades

### 🧁 Gerenciamento de Produtos
- Adicionar novos sabores de sacolés.
- Editar informações de sabores existentes.
- Excluir sabores cadastrados.

### 📦 Gerenciamento de Estoque
- Visualizar o estoque atual de sacolés.
- Registrar produção de novos sacolés.

### ⚙ Configuração de Preços
- Configurar preços para os tipos de sacolés (normal e gourmet).

### 💲 Vendas de Sacolés
- Registrar as vendas do sacolés.
- Calculo automático do estoque.

### 📊 Relatórios
- Relatórios gerais *(em desenvolvimento)*.

---

## 🗂️ Estrutura do Projeto

### 📁 Diretórios Principais

- `app/controller/` – Contém os controladores responsáveis por gerenciar as ações do sistema.
- `app/dao/` – Contém as classes de acesso ao banco de dados.
- `app/model/` – Contém as classes de modelo que representam os dados do sistema.
- `app/views/` – Contém os arquivos de interface do usuário.
- `config/` – Contém arquivos de configuração, como conexão com o banco de dados e URL base.
- `public/` – Contém os arquivos públicos, como CSS, JavaScript e imagens.

### 📄 Principais Arquivos

- `index.php` – Arquivo inicial que redireciona para a interface principal do sistema.
- `config/database.php` – Configuração da conexão com o banco de dados.
- `app/views/produtos/index.php` – Interface para gerenciar os produtos cadastrados.
- `app/views/estoque/index.php` – Interface para visualizar e gerenciar o estoque.

---

## 💻 Tecnologias Utilizadas

### 🔸 Frontend
- HTML5, 
- CSS3, 
- JavaScript (puro)
- [Bootstrap](https://getbootstrap.com/) (para responsividade)
- [Font Awesome](https://fontawesome.com/) (para ícones)

### 🔸 Backend
- PHP (sem framework)
- PDO, para acesso ao MySQL

### 🔸 Banco de Dados
- MySQL


---

## ⚙️ Configuração do Ambiente

1. **Clone o repositório para o seu ambiente local:**
   ```bash
   git clone https://github.com/GustavoOlSantos/vendasSacole.git
2. Configure o servidor local (ex.: XAMPP) e coloque o projeto na pasta htdocs.

3. Crie o banco de dados no MySQL com o nome sistem-sacole e configure as credenciais no arquivo config/database.php.

4. Importe o arquivo SQL para criar as tabelas necessárias.

5. Acesse o sistema no navegador:
   ```bash
   http://localhost/sacoleVendas

## 🗄️ Estrutura do Banco de Dados

### 📋 Tabelas Principais

#### `sacoles`
- `id`: Código do Sacolé.
- `sabor`: Nome do sabor.
- `tipo`: Id do tipo do sacolé.
- `quantidade`: Quantidade disponível no estoque.

#### `tiposacole`
- `id`: Código do tipo de sacolé.
- `tipo`: Nome (Tradicional ou gourmet).
- `preco`: Preço para o tipo de sacolé.

#### `vendas`
- `id`: Código da Venda.
- `data_venda`: Data da venda.
- `total`: Valor total da venda.

#### `vendas_sacole`
- `id_venda`: Código da Venda.
- `id_sacole`: Código do Sacolé.
- `qtd`: Quantidade de sacolés vendidos.

