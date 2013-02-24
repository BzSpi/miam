-- --------------------------------------------------------
--
-- Table structure for table `place`
--
CREATE TABLE IF NOT EXISTS `place` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` mediumtext NOT NULL,
  `place_type_id` int(11) NOT NULL,
  `link` varchar(255) NOT NULL,
  `lat` decimal(8,6) NOT NULL,
  `lng` decimal(8,6) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `place_type_id` (`place_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28;

-- --------------------------------------------------------
--
-- Table structure for table `place_type`
--
CREATE TABLE IF NOT EXISTS `place_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `label` (`label`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28;

--
-- Constraints for table `place`
--
ALTER TABLE `place`
  ADD CONSTRAINT `place_ibfk_1` FOREIGN KEY (`place_type_id`) REFERENCES `place_type` (`id`);
