-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2024 at 03:32 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `survey`
--

-- --------------------------------------------------------

--
-- Table structure for table `surveys`
--

CREATE TABLE `surveys` (
  `surveyId` varchar(4) NOT NULL,
  `surveyQuestion` varchar(255) NOT NULL,
  `surveyAnswer` varchar(255) NOT NULL,
  `surveyResponse` varchar(255) DEFAULT NULL,
  `surveyStatus` enum('unread','read') NOT NULL,
  `surveyOwner` varchar(4) NOT NULL,
  `surveyCreateDate` int(10) NOT NULL,
  `surveyIsActive` int(1) NOT NULL,
  `surveyDescription` text DEFAULT NULL,
  `surveyNumber` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `surveys`
--

INSERT INTO `surveys` (`surveyId`, `surveyQuestion`, `surveyAnswer`, `surveyResponse`, `surveyStatus`, `surveyOwner`, `surveyCreateDate`, `surveyIsActive`, `surveyDescription`, `surveyNumber`) VALUES
('A1b2', 'What is your favorite color?', 'Blue', NULL, 'read', 'a1B2', 1685942400, 1, NULL, 5),
('A7b8', 'What is your favorite food?', 'Sushi', NULL, 'read', 'A7b8', 1685942400, 1, NULL, 13),
('C3d4', 'How often do you exercise?', 'Daily', NULL, 'read', 'C3d4', 1685942400, 1, NULL, 8),
('c9D0', 'How many languages do you speak?', 'Three', NULL, 'read', 'c9D0', 1685942400, 1, NULL, 19),
('cqqV', 'Do you prefer lambo or ferrari', 'lambo', NULL, 'read', '0VrM', 1715857650, 1, NULL, 3),
('E1f2', 'Do you like traveling?', 'Yes', NULL, 'read', 'E1f2', 1685942400, 1, NULL, 10),
('E5f6', 'What is your preferred mode of transportation?', 'Car', NULL, 'read', 'E5f6', 1685942400, 1, NULL, 12),
('g3H4', 'What is your favorite sport?', 'Soccer', NULL, 'read', 'g3H4', 1685942400, 1, NULL, 16),
('g7H8', 'Do you like coffee?', 'Yes', NULL, 'read', 'g7H8', 1685942400, 1, NULL, 20),
('I5j6', 'What is your favorite TV show?', 'Friends', NULL, 'read', 'I5j6', 1685942400, 1, NULL, 14),
('I9j0', 'What is your favorite book?', '1984', NULL, 'read', 'I9j0', 1685942400, 1, NULL, 7),
('K1L2', 'How many pets do you have?', 'Two', NULL, 'read', 'K1L2', 1685942400, 1, NULL, 15),
('k7L8', 'Do you like reading books?', 'Yes', NULL, 'read', 'k7L8', 1685942400, 1, NULL, 17),
('K8SM', 'What do you think of gardenframe?', 'I think the service gardenframe provides us has been nothing less than great!', NULL, 'read', 'Q8W0', 1713793759, 1, NULL, 1),
('kjZo', 'What do you think of Ouassim', 'He is good at php', 'hello', 'read', '0VrM', 1717144066, 1, NULL, 1),
('ky3I', 'Do you like lasagna', 'yes I do ', 'Qui Qui', 'read', '8aU8', 1715857549, 1, NULL, 2),
('lJ3O', 'Are you satisfied with our services?', 'Yes I am', NULL, 'read', 'Q8W0', 1715329137, 1, NULL, 1),
('m3N4', 'What is your favorite hobby?', 'Reading', NULL, 'read', 'm3N4', 1685942400, 1, NULL, 3),
('M9n0', 'What is your favorite animal?', 'Dog', NULL, 'read', 'M9n0', 1685942400, 1, NULL, 23),
('O5p6', 'Do you like pizza?', 'Yes', NULL, 'read', 'O5p6', 1685942400, 1, NULL, 22),
('Q1Dl', 'Do you prefer php or javascript?', 'Javascript', NULL, 'read', '0VrM', 1715857674, 1, NULL, 3),
('Q7r8', 'What is your dream job?', 'Astronaut', NULL, 'read', 'Q7r8', 1685942400, 1, NULL, 11),
('REAf', 'what do you think of gino', 'cool guy', NULL, 'read', '0VrM', 1717144291, 1, NULL, 2),
('s9T0', 'What is your favorite movie?', 'Inception', NULL, 'read', 's9T0', 1685942400, 1, NULL, 6),
('U1v2', 'Do you prefer cats or dogs?', 'Dogs', NULL, 'read', 'U1v2', 1685942400, 1, NULL, 9),
('w3X4', 'What is your favorite season?', 'Summer', NULL, 'read', 'w3X4', 1685942400, 1, NULL, 18),
('Y5z6', 'Do you play video games?', 'Yes', NULL, 'read', 'Y5z6', 1685942400, 1, NULL, 4),
('ZIFW', 'Do you want a new car?', 'Yes I do', 'doe fffffff', 'read', '8aU8', 1715857553, 1, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` varchar(4) NOT NULL,
  `userUserName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `userUserName`) VALUES
('0VrM', 'BarackObama'),
('8aU8', 'DonaldTrump'),
('a1B2', 'user1'),
('A7b8', 'user14'),
('C3d4', 'user2'),
('c9D0', 'user15'),
('E1f2', 'user16'),
('E5f6', 'user3'),
('eZi4', 'GeorgeWBush'),
('g3H4', 'user17'),
('g7H8', 'user4'),
('I5j6', 'user18'),
('I9j0', 'user5'),
('K1L2', 'user6'),
('k7L8', 'user19'),
('m3N4', 'user7'),
('M9n0', 'user20'),
('O5p6', 'user8'),
('Q7r8', 'user9'),
('Q8W0', 'JoeBiden'),
('s9T0', 'user10'),
('U1v2', 'user11'),
('w3X4', 'user12'),
('Y5z6', 'user13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `surveys`
--
ALTER TABLE `surveys`
  ADD PRIMARY KEY (`surveyId`),
  ADD KEY `surveyOwner` (`surveyOwner`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `surveys`
--
ALTER TABLE `surveys`
  ADD CONSTRAINT `surveys_ibfk_1` FOREIGN KEY (`surveyOwner`) REFERENCES `users` (`userId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
