-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2024 at 03:45 PM
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
('cqqV', 'Do you prefer lambo or ferrari', 'lambo', NULL, 'read', '0VrM', 1715857650, 1, NULL, 3),
('K8SM', 'What do you think of gardenframe?', 'I think the service gardenframe provides us has been nothing less than great!', NULL, 'read', 'Q8W0', 1713793759, 1, NULL, 1),
('ky3I', 'Do you like lasagna', 'yes I do ', NULL, 'read', '8aU8', 1715857549, 1, NULL, 2),
('lJ3O', 'Are you satisfied with our services?', 'Yes I am', NULL, 'read', 'Q8W0', 1715329137, 1, NULL, 1),
('Q1Dl', 'Do you prefer php or javascript?', 'Javascript', NULL, 'read', '0VrM', 1715857674, 1, NULL, 3),
('ZIFW', 'Do you want a new car?', 'Yes I do', NULL, 'read', '8aU8', 1715857553, 1, NULL, 2);

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
('eZi4', 'GeorgeWBush'),
('Q8W0', 'JoeBiden');

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
