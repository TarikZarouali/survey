-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2024 at 04:01 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `surveyapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `contents`
--

CREATE TABLE `contents` (
  `contentId` varchar(15) NOT NULL,
  `contentSurveyId` varchar(15) NOT NULL,
  `contentQuestionId` varchar(15) NOT NULL,
  `contentText` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contents`
--

INSERT INTO `contents` (`contentId`, `contentSurveyId`, `contentQuestionId`, `contentText`) VALUES
('eaPWx2rPhCdNrzC', 'j5f8cbxIERQvnIO', 'H7itFChObrZ78zM', 'I have no complaints so far! Pretty user friendly!'),
('idjQ7KWJd4Vq05j', 'j5f8cbxIERQvnIO', 'tHoALtsO45fVZ55', 'I would rate it an 8 since there is almost room for improvement like the quality of the service');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `questionId` varchar(15) NOT NULL,
  `questionSurveyId` varchar(15) NOT NULL,
  `questionText` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`questionId`, `questionSurveyId`, `questionText`) VALUES
('H7itFChObrZ78zM', 'j5f8cbxIERQvnIO', 'If you could rate our service from 1-10 what would your rating be?'),
('tHoALtsO45fVZ55', 'j5f8cbxIERQvnIO', 'What do you think of our services?');

-- --------------------------------------------------------

--
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `responseId` varchar(15) NOT NULL,
  `responseSurveyId` varchar(15) NOT NULL,
  `responseQuestionId` varchar(15) NOT NULL,
  `responseText` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `responses`
--

INSERT INTO `responses` (`responseId`, `responseSurveyId`, `responseQuestionId`, `responseText`) VALUES
('p21VKs0uRX5yFOh', 'j5f8cbxIERQvnIO', 'H7itFChObrZ78zM', 'I am happy that you think of our service like that!At gardenframe we focus on keeping the customer happy and satisfied!'),
('QbbrIvhgmNdj5LW', 'j5f8cbxIERQvnIO', 'tHoALtsO45fVZ55', 'That is a great rating you gave us! Is there a possibility that you could elaborate more about what could be improved?');

-- --------------------------------------------------------

--
-- Table structure for table `surveys`
--

CREATE TABLE `surveys` (
  `surveyId` varchar(15) NOT NULL,
  `surveyTitle` varchar(50) NOT NULL,
  `surveyDescription` varchar(255) NOT NULL,
  `surveyCreateDate` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `surveys`
--

INSERT INTO `surveys` (`surveyId`, `surveyTitle`, `surveyDescription`, `surveyCreateDate`) VALUES
('j5f8cbxIERQvnIO', 'review', 'This is a survey to ask our customers about their experience', 1713267429);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`contentId`),
  ADD KEY `contentQuestionId` (`contentQuestionId`),
  ADD KEY `contentSurveyId` (`contentSurveyId`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`questionId`),
  ADD KEY `questionSurveyId` (`questionSurveyId`);

--
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`responseId`),
  ADD KEY `responseQuestionId` (`responseQuestionId`),
  ADD KEY `responseSurveyId` (`responseSurveyId`);

--
-- Indexes for table `surveys`
--
ALTER TABLE `surveys`
  ADD PRIMARY KEY (`surveyId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contents`
--
ALTER TABLE `contents`
  ADD CONSTRAINT `contents_ibfk_1` FOREIGN KEY (`contentQuestionId`) REFERENCES `questions` (`questionId`),
  ADD CONSTRAINT `contents_ibfk_2` FOREIGN KEY (`contentSurveyId`) REFERENCES `surveys` (`surveyId`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`questionSurveyId`) REFERENCES `surveys` (`surveyId`);

--
-- Constraints for table `responses`
--
ALTER TABLE `responses`
  ADD CONSTRAINT `responses_ibfk_1` FOREIGN KEY (`responseQuestionId`) REFERENCES `questions` (`questionId`),
  ADD CONSTRAINT `responses_ibfk_2` FOREIGN KEY (`responseSurveyId`) REFERENCES `surveys` (`surveyId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
