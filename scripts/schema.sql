CREATE TABLE `tiposacole` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(11) NOT NULL,
  `preco` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sistem-sacole`.`tiposacole`
(`id`,
`tipo`,
`preco`)
VALUES
('1', 'Tradicional', '3'),
('2', 'Gourmet', '5');



CREATE TABLE `sacoles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sabor` varchar(50) NOT NULL,
  `tipo` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tipo` (`tipo`),
  CONSTRAINT `sacoles_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `tiposacole` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vendas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_venda` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `vendas_sacole` (
  `id_venda` int(11) NOT NULL,
  `id_sacole` int(11) NOT NULL,
  `qtd` int(11) NOT NULL,
  KEY `sacoles-vendidos` (`id_sacole`),
  KEY `venda` (`id_venda`),
  CONSTRAINT `sacoles-vendidos` FOREIGN KEY (`id_sacole`) REFERENCES `sacoles` (`id`),
  CONSTRAINT `venda` FOREIGN KEY (`id_venda`) REFERENCES `vendas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

