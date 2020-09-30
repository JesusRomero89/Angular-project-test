-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 07-04-2020 a las 07:04:23
-- Versión del servidor: 10.4.10-MariaDB
-- Versión de PHP: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `webbase9`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `referencia` varchar(255) NOT NULL,
  `descripcion` tinytext DEFAULT NULL,
  `unidades` int(11) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `precio` decimal(14,4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `referencia`, `descripcion`, `unidades`, `imagen`, `precio`) VALUES
(1, '089E3ZX', 'Creation of pleuroperitoneal shunt', 1, 'http://dummyimage.com/199x111.png/ff4444/ffffff', '26.0000'),
(2, 'BQ0X0ZZ', 'Fitting of hearing aid', 2, 'http://dummyimage.com/201x223.jpg/ff4444/ffffff', '86.0000'),
(3, '0BB50ZX', 'Microscopic examination of specimen from ear, nose, throat, and larynx, other microscopic examination', 3, 'http://dummyimage.com/120x123.png/ff4444/ffffff', '91.0000'),
(4, 'DDY5FZZ', 'Failed forceps', 4, 'http://dummyimage.com/222x195.png/dddddd/000000', '91.0000'),
(5, '0YB94ZX', 'Suture of laceration of esophagus', 5, 'http://dummyimage.com/245x136.bmp/dddddd/000000', '37.0000'),
(6, '0MQ84ZZ', 'Closure of ureterostomy', 6, 'http://dummyimage.com/179x217.bmp/dddddd/000000', '66.0000'),
(7, '041K49N', 'Percutaneous cystostomy', 7, 'http://dummyimage.com/218x213.bmp/5fa2dd/ffffff', '16.0000'),
(8, '0J8S0ZZ', 'Laparoscopic right hemicolectomy', 8, 'http://dummyimage.com/173x240.bmp/ff4444/ffffff', '1.0000'),
(9, '3E053WL', 'Microscopic examination of blood, cell block and Papanicolaou smear', 9, 'http://dummyimage.com/173x118.jpg/ff4444/ffffff', '38.0000'),
(10, '2W0PX5Z', 'Aorta-subclavian-carotid bypass', 10, 'http://dummyimage.com/179x147.png/ff4444/ffffff', '40.0000'),
(11, '0QPR45Z', 'Infusion of immunosuppressive antibody therapy', 11, 'http://dummyimage.com/171x201.png/dddddd/000000', '50.0000'),
(12, '04HH4DZ', 'Diagnostic aspiration of orbit', 12, 'http://dummyimage.com/194x199.jpg/5fa2dd/ffffff', '15.0000'),
(13, '03HN33Z', 'Other excision or avulsion of cranial and peripheral nerves', 13, 'http://dummyimage.com/226x236.jpg/dddddd/000000', '100.0000'),
(14, '090KXKZ', 'Excision of pilonidal cyst or sinus', 14, 'http://dummyimage.com/201x133.jpg/ff4444/ffffff', '81.0000'),
(15, '0SQ5XZZ', 'Ankle fusion', 15, 'http://dummyimage.com/168x169.png/cc0000/ffffff', '18.0000'),
(16, '03VK3CZ', 'Aorta-iliac-femoral bypass', 16, 'http://dummyimage.com/243x166.bmp/cc0000/ffffff', '58.0000'),
(17, '00NX0ZZ', 'Closed reduction of separated epiphysis, tibia and fibula', 17, 'http://dummyimage.com/183x137.jpg/cc0000/ffffff', '9.0000'),
(18, '0SGD0KZ', 'Mobilization of spine', 18, 'http://dummyimage.com/105x182.bmp/5fa2dd/ffffff', '87.0000'),
(19, '0BU24KZ', 'Cisternal puncture', 19, 'http://dummyimage.com/222x216.png/dddddd/000000', '65.0000'),
(20, '0MU14JZ', 'Other repair of injury of eyeball or orbit', 20, 'http://dummyimage.com/118x198.png/ff4444/ffffff', '47.0000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registros`
--

DROP TABLE IF EXISTS `registros`;
CREATE TABLE IF NOT EXISTS `registros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `fecha` varchar(255) DEFAULT NULL,
  `entrada` varchar(255) DEFAULT NULL,
  `salida` varchar(255) DEFAULT NULL,
  `incidencias` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `registros`
--

INSERT INTO `registros` (`id`, `email`, `fecha`, `entrada`, `salida`, `incidencias`) VALUES
(30, 'elopez@bsw.es', '6/4/2020', '11:13:17', '11:13:36', 'entrada de prueba'),
(31, 'elopez@bsw.es', '6/4/2020', '11:14:40', '11:16:30', 'entrada de prueba 2'),
(32, 'elopez@bsw.es', '6/4/2020', '11:16:37', '11:17:27', 'entrada de prueba 3'),
(33, 'elopez@bsw.es', '6/4/2020', '11:48:49', '11:49:09', 'pupupupupu');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `rol` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `rol`) VALUES
(1, 'administrador'),
(2, 'usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `rol` int(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ukey_email` (`email`),
  KEY `rol` (`rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `email`, `password`, `imagen`, `rol`) VALUES
(1, 'jesus', 'romero gonzalez', 'jromero@bsw.es', '12345', 'imagen-jromero.jpg', 2),
(2, 'esperanza', 'lopez rui-diaz', 'elopez@bsw.es', '12345', 'imagen-elopez.jpg', 1);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `registros`
--
ALTER TABLE `registros`
  ADD CONSTRAINT `registros_ibfk_1` FOREIGN KEY (`email`) REFERENCES `usuarios` (`email`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
