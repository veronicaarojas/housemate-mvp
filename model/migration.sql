DROP TABLE IF EXISTS `roomies`;

CREATE TABLE `roomies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(40) NOT NULL,
  `lastname` VARCHAR(40) NOT NULL,
  `bio` VARCHAR(255), 
  `age` INT,
  `ocupation`VARCHAR(255), 
  `locationname` VARCHAR(255),
  `latitude` DECIMAL(10,8),
  `longitude` DECIMAL(11,8),
  `maxbudget` INT, 
  `smoke` BOOLEAN,
  `has_pets` BOOLEAN,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS `answers`;

CREATE TABLE `answers` (
  `answerID` INT NOT NULL AUTO_INCREMENT,
  `roomieID` INT NOT NULL,
  `question` VARCHAR(255), 
  `answer` VARCHAR(255), 
  PRIMARY KEY (answerID),
  FOREIGN KEY (roomieID) references roomie(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `userimages`;

CREATE TABLE `userimages` (
  `id` INT NOT NULL AUTO_INCREMENT, 
  `path` VARCHAR(255),
  `roomieID` INT, 
  PRIMARY KEY (id), 
  FOREIGN KEY (roomieID) references roomies(id) ON DELETE CASCADE
);