# 🍧 LLG Sacolés

Sistema de gerenciamento de **vendas e estoque de sacolés**, desenvolvido em PHP. Permite cadastrar, editar, excluir e visualizar produtos, configurar preços por tipo de sacolé e controlar o estoque de forma automática a partir das vendas registradas.

<p align="center">
  <img src="https://skillicons.dev/icons?i=php,mysql,bootstrap,css,docker" alt="Tecnologias utilizadas"/>
</p>

<p align="center"> 
   <img src="https://img.shields.io/badge/PHP-8.2-777BB4?logo=php&logoColor=white" alt="PHP"/> 
   <img src="https://img.shields.io/badge/MySQL-8.4-4479A1?logo=mysql&logoColor=white" alt="MySQL"/> 
   <img src="https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?logo=bootstrap&logoColor=white" alt="Bootstrap"/> 
   <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker"/> 
</p>

---

## Funcionalidades

### Gerenciamento de Produtos
- Adicionar novos sabores de sacolés.
- Editar informações de sabores existentes.
- Excluir sabores cadastrados.

### Gerenciamento de Estoque
- Visualizar o estoque atual de sacolés.
- Registrar produção de novos sacolés.

### Configuração de Preços
- Configurar preços para os tipos de sacolés (tradicional e gourmet).

### Vendas de Sacolés
- Registrar as vendas de sacolés.
- Cálculo automático da baixa no estoque a cada venda.

### Relatórios
- Relatórios gerais *(em desenvolvimento)*.

---

## Tecnologias Utilizadas

**Frontend**
- HTML5, CSS3, JavaScript (puro)
- [Bootstrap](https://getbootstrap.com/) — responsividade
- [Font Awesome](https://fontawesome.com/) — ícones

**Backend**
- PHP (sem framework)
- PDO — acesso ao MySQL

**Banco de Dados**
- MySQL

**Infraestrutura**
- Docker e Docker Compose — orquestração dos containers PHP e MySQL

---

## 🗂️ Estrutura do Projeto

```
sacoleVendas/
├── app/
│   ├── controller/
│   │   ├── actions/
│   │   ├── ajax/
│   │   ├── estoque/
│   │   ├── produtos/
│   │   └── vendas/
│   ├── dao/          # Classes de acesso ao banco de dados
│   ├── model/         # Classes de modelo que representam os dados do sistema
│   └── views/
│       ├── estoque/
│       ├── partials/
│       ├── produtos/
│       ├── vendas/
│       └── index.php
├── config/
│   ├── database.php   # Configuração da conexão com o banco de dados
│   └── url.php         # Configuração da URL base do sistema
├── public/
│   ├── css/
│   ├── img/
│   └── js/
├── scripts/
│   └── schema.sql      # Script de criação das tabelas do banco de dados
├── .env                 # Variáveis de ambiente
├── .gitignore
├── docker-compose.yml   # Orquestração dos containers PHP e MySQL
├── Dockerfile            # Imagem da aplicação PHP
├── index.php              # Ponto de entrada da aplicação
└── readme.md
```

## Como Executar (Docker)

O projeto já conta com Docker configurado, subindo automaticamente um container MySQL (alimentado pelo `scripts/schema.sql`) e outro para a aplicação PHP.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/GustavoOlSantos/LLG_sacoles.git
   cd vendasSacole
   ```

2. **Suba os containers com Docker Compose:**
   ```bash
   docker compose up -d
   ```

3. **Acesse o sistema no navegador:**
   ```
   http://localhost:3333/sacoleVendas
   ```

> 💡 O banco de dados é criado e populado automaticamente a partir do `scripts/schema.sql` na primeira inicialização do container MySQL.



## 🗄️ Estrutura do Banco de Dados

### 📋 Tabelas Principais

#### `sacoles`
| Campo | Descrição |
|---|---|
| `id` | Código do sacolé |
| `sabor` | Nome do sabor |
| `tipo` | Id do tipo do sacolé |
| `quantidade` | Quantidade disponível no estoque |

#### `tiposacole`
| Campo | Descrição |
|---|---|
| `id` | Código do tipo de sacolé |
| `tipo` | Nome (tradicional ou gourmet) |
| `preco` | Preço para o tipo de sacolé |

#### `vendas`
| Campo | Descrição |
|---|---|
| `id` | Código da venda |
| `data_venda` | Data da venda |
| `total` | Valor total da venda |

#### `vendas_sacole`
| Campo | Descrição |
|---|---|
| `id_venda` | Código da venda |
| `id_sacole` | Código do sacolé |
| `qtd` | Quantidade de sacolés vendidos |

---

## 🗺️ Roadmap

- [ ] Finalizar módulo de relatórios gerais.
- [ ] Exportação de relatórios em PDF/Excel.

---

<p align="center">Desenvolvido com 🍧 por <a href="https://github.com/GustavoOlSantos">Gustavo Oliveira Santos</a></p>