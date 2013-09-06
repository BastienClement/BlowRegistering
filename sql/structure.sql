SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `bt_answers` (
  `event` mediumint(8) unsigned NOT NULL,
  `user` mediumint(8) unsigned NOT NULL,
  `answer` tinyint(1) NOT NULL,
  `time` datetime NOT NULL,
  `note` text NOT NULL,
  PRIMARY KEY (`event`,`user`),
  KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `bt_chars` (
  `id` bigint(20) unsigned NOT NULL,
  `name` varchar(25) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `server` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `owner` mediumint(8) unsigned DEFAULT NULL,
  `main` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `class` tinyint(3) unsigned DEFAULT NULL,
  `race` tinyint(3) unsigned DEFAULT NULL,
  `gender` enum('0','1') DEFAULT NULL,
  `level` tinyint(3) unsigned DEFAULT NULL,
  `achievements` smallint(5) unsigned DEFAULT NULL,
  `thumbnail` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `guild` varchar(30) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `ilvl` smallint(6) unsigned DEFAULT NULL,
  `role` enum('TANK','DPS','HEALING') NOT NULL DEFAULT 'DPS',
  `is_blow` tinyint(1) NOT NULL DEFAULT '0',
  `last_update` int(11) NOT NULL DEFAULT '0',
  `last_full_update` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`server`),
  KEY `owner` (`owner`),
  KEY `is_blow` (`is_blow`),
  KEY `last_full_update` (`last_full_update`),
  KEY `last_update` (`last_update`),
  KEY `active` (`active`),
  KEY `race` (`race`),
  KEY `class` (`class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `bt_classes` (
  `id` tinyint(3) unsigned NOT NULL,
  `mask` int(10) unsigned NOT NULL,
  `power` varchar(15) NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `bt_events` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `type` tinyint(1) NOT NULL,
  `desc` text,
  `date` datetime NOT NULL,
  `owner` mediumint(8) unsigned NOT NULL,
  `event_note` text,
  `state` tinyint(1) NOT NULL DEFAULT '0',
  `editing` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `date` (`date`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE `bt_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `source` varchar(50) NOT NULL,
  `desc` varchar(50) NOT NULL,
  `payload` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE `bt_races` (
  `id` tinyint(3) unsigned NOT NULL,
  `mask` int(10) unsigned NOT NULL,
  `side` varchar(10) NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `bt_raidcomps` (
  `event` mediumint(8) unsigned NOT NULL,
  `comp` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `slot` tinyint(2) NOT NULL COMMENT 'Must be signed!',
  `char` bigint(20) unsigned NOT NULL,
  `forced_role` enum('TANK','DPS','HEALING') DEFAULT NULL,
  PRIMARY KEY (`event`,`comp`,`slot`),
  KEY `char` (`char`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `bt_realms` (
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `locale` varchar(10) NOT NULL,
  PRIMARY KEY (`name`),
  KEY `locale` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `bt_slacks` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `player` mediumint(8) unsigned NOT NULL,
  `reason` text NOT NULL,
  `from` date NOT NULL,
  `to` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `player` (`player`),
  KEY `date` (`from`,`to`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE `bt_specs` (
  `class` tinyint(3) unsigned NOT NULL,
  `name` varchar(25) NOT NULL,
  `role` enum('TANK','DPS','HEALING') NOT NULL,
  `icon` varchar(50) NOT NULL,
  `desc` varchar(255) NOT NULL,
  `order` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`class`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `bt_answers`
  ADD CONSTRAINT `bt_answers_ibfk_2` FOREIGN KEY (`user`) REFERENCES `phpbb_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bt_answers_ibfk_3` FOREIGN KEY (`event`) REFERENCES `bt_events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `bt_chars`
  ADD CONSTRAINT `bt_chars_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `phpbb_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bt_chars_ibfk_7` FOREIGN KEY (`class`) REFERENCES `bt_classes` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `bt_chars_ibfk_8` FOREIGN KEY (`race`) REFERENCES `bt_races` (`id`) ON UPDATE CASCADE;

ALTER TABLE `bt_events`
  ADD CONSTRAINT `bt_events_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `phpbb_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `bt_raidcomps`
  ADD CONSTRAINT `bt_raidcomps_ibfk_1` FOREIGN KEY (`event`) REFERENCES `bt_events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bt_raidcomps_ibfk_2` FOREIGN KEY (`char`) REFERENCES `bt_chars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `bt_slacks`
  ADD CONSTRAINT `bt_slacks_ibfk_1` FOREIGN KEY (`player`) REFERENCES `phpbb_users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `bt_specs`
  ADD CONSTRAINT `bt_specs_ibfk_1` FOREIGN KEY (`class`) REFERENCES `bt_classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
