-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 18, 2025 at 12:05 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gestionparrainage`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `ValiderImportation` (IN `fichierID` INT)   BEGIN
    DECLARE fin INT DEFAULT 0;
    DECLARE idElecteur INT;
    DECLARE numeroCarte VARCHAR(25);
    DECLARE cin VARCHAR(25);
    DECLARE nom VARCHAR(50);
    DECLARE prenom VARCHAR(50);
    DECLARE dateNaissance DATE;
    DECLARE bureauVote VARCHAR(50);
    DECLARE email VARCHAR(100);
    DECLARE telephone VARCHAR(15);
    
    -- Curseur pour parcourir les électeurs valides
    DECLARE cur CURSOR FOR 
        SELECT id, NumeroCarteElecteur, CIN, Nom, Prenom, DateNaissance, BureauVote, Email, Telephone 
        FROM electeurtemps 
        WHERE IDFichier = fichierID;

    -- Gérer les erreurs
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET fin = 1;

    -- Bloquer les nouveaux uploads
    UPDATE FichierElectoral SET Statut = 'Validé' WHERE IDFichier = fichierID;

    OPEN cur;

    boucleElecteurs:LOOP
        FETCH cur INTO idElecteur, numeroCarte, cin, nom, prenom, dateNaissance, bureauVote, email, telephone;

        IF fin = 1 THEN
            LEAVE boucleElecteurs;
        END IF;

        -- Vérification avec `ControlerElecteurs`
        IF ControlerElecteurs(numeroCarte, cin, nom, prenom, dateNaissance, bureauVote, email, telephone, fichierID) THEN
            -- Insérer dans la table finale
            INSERT INTO Electeurs (NumeroCarteElecteur, CIN, Nom, Prenom, DateNaissance, BureauVote, Email, Telephone, Statut)
            VALUES (numeroCarte, cin, nom, prenom, dateNaissance, bureauVote, email, telephone, 'Validé');

            -- Supprimer de la table temporaire
            DELETE FROM electeurtemps WHERE id = idElecteur;
        END IF;
    END LOOP;

    CLOSE cur;
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `ControlerElecteurs` (`numeroCarte` VARCHAR(25), `cin` VARCHAR(25), `nom` VARCHAR(50), `prenom` VARCHAR(50), `dateNaissance` DATE, `bureauVote` VARCHAR(50), `email` VARCHAR(100), `telephone` VARCHAR(15), `fichierID` INT) RETURNS TINYINT(1) DETERMINISTIC BEGIN
    DECLARE erreur TEXT DEFAULT '';

    -- Vérifier le format du numéro de carte électeur
    IF LENGTH(numeroCarte) <> 9 OR numeroCarte NOT REGEXP '^[0-9]+$' THEN
        SET erreur = 'Numéro de carte électeur invalide';
    END IF;

    -- Vérifier le format du CIN
    IF LENGTH(cin) <> 14 OR cin NOT REGEXP '^[0-9]+$' THEN
        SET erreur = CONCAT(erreur, ', CIN invalide');
    END IF;

    -- Vérifier que tous les champs obligatoires sont remplis
    IF nom IS NULL OR prenom IS NULL OR dateNaissance IS NULL OR bureauVote IS NULL OR email IS NULL OR telephone IS NULL THEN
        SET erreur = CONCAT(erreur, ', Informations incomplètes');
    END IF;

    -- Enregistrer l'erreur si nécessaire
    IF erreur <> '' THEN
        INSERT INTO ElecteursProblematiques (IDFichier, NumeroCarteElecteur, CIN, NatureProbleme)
        VALUES (fichierID, numeroCarte, cin, erreur);
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `candidats`
--

CREATE TABLE `candidats` (
  `id` bigint UNSIGNED NOT NULL,
  `NumeroCarteElecteur` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateNaissance` date NOT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `PartiPolitique` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Slogan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Couleurs` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `URL` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CodeSecurite` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidats`
--

INSERT INTO `candidats` (`id`, `NumeroCarteElecteur`, `Nom`, `Prenom`, `DateNaissance`, `Email`, `Telephone`, `PartiPolitique`, `Slogan`, `Photo`, `Couleurs`, `URL`, `CodeSecurite`, `created_at`, `updated_at`) VALUES
(2, '123456789', 'Faye', 'Bassirou Diomaye', '1985-07-12', 'bassiroudf@email.com', '771234567', 'Partie de la Paix', 'Dox guir Diameu', 'https://maliactu.net/wp-content/uploads/2024/03/qui-est-bassirou-diomaye-faye-le-candidat-annonce-comme-futur-president-du-senegal-1024x703-1.jpeg', ' #0000FF', 'https://parti-pur.com/', '22512', '2025-02-20 16:34:29', '2025-03-18 06:59:57'),
(3, '455544678', 'Dia', 'Aliou Mamadou', '1965-01-01', 'alioumamadou@email.com', '776555555', 'Parti de l\'unite et du rassemblement', 'Les Valeurs aux Services de la Nation !', 'https://th.bing.com/th/id/OIP.JwnjgK_53SwRiM-5BwvY_QHaFA?w=260&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', '#0FFFFF', 'https://parti-pur.com/', '12340', '2025-02-20 17:46:18', '2025-02-20 17:46:18'),
(5, '888222666', 'Ba', 'Amadou', '1970-03-30', 'taibasakho3@gmail.com', '+221 707348214', 'APR', 'Alliance pour la republique', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Mamadou_Ba_au_EITI_Global_Conference_%28cropped%29.jpg/220px-Mamadou_Ba_au_EITI_Global_Conference_%28cropped%29.jpg', '#FF0000', 'https://fr.wikipedia.org/wiki/Amadou_Ba_(1961)', '73214', '2025-03-18 02:15:53', '2025-03-18 07:00:16');

-- --------------------------------------------------------

--
-- Table structure for table `electeurs`
--

CREATE TABLE `electeurs` (
  `NumeroCarteElecteur` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CIN` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Nom` varchar(50) NOT NULL,
  `Prenom` varchar(50) NOT NULL,
  `DateNaissance` date NOT NULL,
  `BureauVote` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lieuDeNaissance` varchar(100) NOT NULL,
  `Sexe` enum('Masculin','Féminin') NOT NULL,
  `Commune` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `electeurs`
--

INSERT INTO `electeurs` (`NumeroCarteElecteur`, `CIN`, `Nom`, `Prenom`, `DateNaissance`, `BureauVote`, `created_at`, `lieuDeNaissance`, `Sexe`, `Commune`) VALUES
('000111444', '3214567890987', 'DIOP', 'Aliou', '1985-04-23', 'Bureau 1', '2025-03-18 08:21:57', 'Dakar', 'Masculin', 'Dakar'),
('111222333', '111111222222', 'Sakho', 'Rockaya', '2003-03-10', '4', '2025-03-02 09:37:22', 'Camberene', 'Féminin', 'Camberene'),
('123456789', '1234567890123', 'Faye', 'Bassirou Diomaye', '1985-07-12', 'Bureau 12', '2025-02-11 13:46:38', 'Camberene', 'Masculin', 'Camberene'),
('455544678', '0099887768895', 'Dia', 'Aliou Mamadou Dia', '1965-01-01', 'Bureau 1', '2025-02-20 17:37:18', 'Camberene', 'Masculin', 'Camberene'),
('456789123', '4567891230124', 'BA', 'Mamadou', '1982-11-30', 'Bureau 3', '2025-03-18 08:21:57', 'Kaolack', 'Masculin', 'Kaolack'),
('567891234', '5678912340123', 'SY', 'Fatou', '1995-02-12', 'Bureau 4', '2025-03-18 08:21:57', 'St-Louis', 'Féminin', 'St-Louis'),
('678912345', '6789123450123', 'FALL', 'Moussa', '1987-06-25', 'Bureau 5', '2025-03-18 08:21:57', 'Ziguinchor', 'Masculin', 'Ziguinchor'),
('888222666', '1945656777773', 'Ba', 'Amadou', '1970-03-30', '5', '2025-02-21 15:22:52', 'Camberene', 'Masculin', 'Camberene'),
('987654321', '9876543210123', 'NDIAYE', 'Awa', '1990-07-15', 'Bureau 2', '2025-03-18 08:21:57', 'Thies', 'Féminin', 'Thies');

-- --------------------------------------------------------

--
-- Table structure for table `electeursproblematiques`
--

CREATE TABLE `electeursproblematiques` (
  `id` bigint UNSIGNED NOT NULL,
  `IDFichier` bigint UNSIGNED NOT NULL,
  `NumeroCarteElecteur` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CIN` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NatureProbleme` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `electeurtemps`
--

CREATE TABLE `electeurtemps` (
  `id` bigint UNSIGNED NOT NULL,
  `NumeroCarteElecteur` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CIN` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateNaissance` date NOT NULL,
  `Commune` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `BureauVote` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IDFichier` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `lieuDeNaissance` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Sexe` enum('Masculin','Féminin') COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fichierelectoral`
--

CREATE TABLE `fichierelectoral` (
  `id` bigint UNSIGNED NOT NULL,
  `NomFichier` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Checksum` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Statut` enum('En attente','Validé','Erreur') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'En attente',
  `EtatUploadElecteurs` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fichierelectoral`
--

INSERT INTO `fichierelectoral` (`id`, `NomFichier`, `Checksum`, `Statut`, `EtatUploadElecteurs`, `created_at`, `updated_at`) VALUES
(1, '1739524516_electeur.csv', '49137d94db7b16e513efee1ee3af2ffe2f06d07f0050acd21f598f0264e8f308', 'En attente', 1, '2025-02-14 09:15:16', '2025-02-14 09:15:16'),
(2, '1739970894_electeurs.csv', 'fe73524271daad72a639b2fdce74fc936d87bce382e24b6aeae69b5576acec13', 'En attente', 1, '2025-02-19 13:14:54', '2025-02-19 13:14:54'),
(25, '1739989852_electeur4.csv', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', 'En attente', 1, '2025-02-19 18:30:52', '2025-02-19 18:30:52'),
(28, '1739991959_electeur5.csv', '89153c633843f83a7e1852603da8c78582f63415a496e035d9822c6e3420cfaf', 'En attente', 1, '2025-02-19 19:05:59', '2025-02-19 19:05:59'),
(30, '1739992580_electeur6.csv', 'e35cb94809c313f33e980667667b547653c71ad80255a54b676368bb3d8852ed', 'En attente', 1, '2025-02-19 19:16:20', '2025-02-19 19:16:20'),
(31, '1739994351_electeur7.csv', '20b70d9b96804bfb5fe3fcf4c51efc2679ad4dc5733d28107e5cfe98ab9338db', 'En attente', 1, '2025-02-19 19:45:51', '2025-02-19 19:45:51'),
(32, '1739995318_electeur8.csv', 'a606683c9372293d6b2a22a0b800095966829141b9d554f232e6b6d68de28881', 'En attente', 1, '2025-02-19 20:01:58', '2025-02-19 20:01:58'),
(35, '1740012452_electeur9.csv', 'd05646bf2b910e87d714bb768891bfeeccaf7e21d52df7fd09841f83d61fd6f5', 'En attente', 1, '2025-02-20 00:47:32', '2025-02-20 00:47:32'),
(37, '1740048897_electeur9.csv', '8089d6fb34497c0e483326ecfc22fa8a7effd443060f24d4e254fa54cca9aa4c', 'En attente', 1, '2025-02-20 10:54:57', '2025-02-20 10:54:57'),
(38, '1740050261_electeur10.csv', '0e6371769c70fff13cb38ba2dfb92cadd4300b3714134575db0f5f11c7eebf03', 'En attente', 1, '2025-02-20 11:17:41', '2025-02-20 11:17:41'),
(42, '1740147875_electeur3.csv', '75f5b55ced260922c6621d396d43ba499b43a3ab2efbcf57f9e3c61194e3135d', 'En attente', 1, '2025-02-21 14:24:35', '2025-02-21 14:24:35'),
(44, '1740148671_electeur4.csv', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', 'En attente', 1, '2025-02-21 14:37:51', '2025-02-21 14:37:51'),
(45, '1740186510_electeur6.csv', 'e35cb94809c313f33e980667667b547653c71ad80255a54b676368bb3d8852ed', 'En attente', 1, '2025-02-22 01:08:31', '2025-02-22 01:08:31'),
(46, '1740346295_electeur4.csv', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', 'En attente', 1, '2025-02-23 21:31:36', '2025-02-23 21:31:36'),
(47, '1742259075_electeur9.csv', '8089d6fb34497c0e483326ecfc22fa8a7effd443060f24d4e254fa54cca9aa4c', 'En attente', 1, '2025-03-18 00:51:16', '2025-03-18 00:51:16'),
(48, '1742259655_electeur3.csv', '75f5b55ced260922c6621d396d43ba499b43a3ab2efbcf57f9e3c61194e3135d', 'En attente', 1, '2025-03-18 01:00:55', '2025-03-18 01:00:55');

-- --------------------------------------------------------

--
-- Table structure for table `historiqueupload`
--

CREATE TABLE `historiqueupload` (
  `id` bigint UNSIGNED NOT NULL,
  `UtilisateurID` bigint UNSIGNED NOT NULL,
  `AdresseIP` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DateUpload` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ClefUtilisee` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `historiqueupload`
--

INSERT INTO `historiqueupload` (`id`, `UtilisateurID`, `AdresseIP`, `DateUpload`, `ClefUtilisee`, `created_at`, `updated_at`) VALUES
(1, 1, '127.0.0.1', '2025-02-19 09:35:29', '49137D94DB7B16E513EFEE1EE3AF2FFE2F06D07F0050ACD21F598F0264E8F308', '2025-02-19 09:35:29', '2025-02-19 09:35:29'),
(2, 1, '127.0.0.1', '2025-02-19 11:28:03', '85A906FDE043FF3D2137E0B743C65FDCE1285FD3AAFAAC78365A1546608CA9F5', '2025-02-19 11:28:03', '2025-02-19 11:28:03'),
(3, 1, '127.0.0.1', '2025-02-19 11:37:19', '85A906FDE043FF3D2137E0B743C65FDCE1285FD3AAFAAC78365A1546608CA9F5', '2025-02-19 11:37:19', '2025-02-19 11:37:19'),
(4, 1, '127.0.0.1', '2025-02-19 11:38:29', '85A906FDE043FF3D2137E0B743C65FDCE1285FD3AAFAAC78365A1546608CA9F5', '2025-02-19 11:38:29', '2025-02-19 11:38:29'),
(5, 1, '127.0.0.1', '2025-02-19 11:42:30', '85A906FDE043FF3D2137E0B743C65FDCE1285FD3AAFAAC78365A1546608CA9F5', '2025-02-19 11:42:30', '2025-02-19 11:42:30'),
(6, 1, '127.0.0.1', '2025-02-19 11:43:04', '85A906FDE043FF3D2137E0B743C65FDCE1285FD3AAFAAC78365A1546608CA9F5', '2025-02-19 11:43:04', '2025-02-19 11:43:04'),
(7, 1, '127.0.0.1', '2025-02-19 11:56:16', '85A906FDE043FF3D2137E0B743C65FDCE1285FD3AAFAAC78365A1546608CA9F5', '2025-02-19 11:56:16', '2025-02-19 11:56:16'),
(8, 1, '127.0.0.1', '2025-02-19 11:59:47', '096475D899A0C5A9B03B10D8F47AB887C3C02164BCA96A3A920FD1BE34D7CF4C', '2025-02-19 11:59:47', '2025-02-19 11:59:47'),
(9, 1, '127.0.0.1', '2025-02-19 12:01:24', '096475D899A0C5A9B03B10D8F47AB887C3C02164BCA96A3A920FD1BE34D7CF4C', '2025-02-19 12:01:24', '2025-02-19 12:01:24'),
(10, 1, '127.0.0.1', '2025-02-19 12:02:06', '096475D899A0C5A9B03B10D8F47AB887C3C02164BCA96A3A920FD1BE34D7CF4C', '2025-02-19 12:02:06', '2025-02-19 12:02:06'),
(11, 1, '127.0.0.1', '2025-02-19 12:05:53', '096475D899A0C5A9B03B10D8F47AB887C3C02164BCA96A3A920FD1BE34D7CF4C', '2025-02-19 12:05:53', '2025-02-19 12:05:53'),
(12, 1, '127.0.0.1', '2025-02-19 12:08:18', '096475D899A0C5A9B03B10D8F47AB887C3C02164BCA96A3A920FD1BE34D7CF4C', '2025-02-19 12:08:18', '2025-02-19 12:08:18'),
(13, 1, '127.0.0.1', '2025-02-19 12:08:25', '096475D899A0C5A9B03B10D8F464BCA96A3A920FD1BE34D7CF4C', '2025-02-19 12:08:25', '2025-02-19 12:08:25'),
(14, 1, '127.0.0.1', '2025-02-19 12:25:41', 'FE73524271DAAD72A639B2FDCE74FC936D87BCE382E24B6AEAE69B5576ACEC13', '2025-02-19 12:25:41', '2025-02-19 12:25:41'),
(15, 1, '127.0.0.1', '2025-02-19 17:09:36', 'c16341437de482d03fa04cdfe9cc38d840beee0bdea8e1dcfe3334eabe7c7ea1', '2025-02-19 17:09:36', '2025-02-19 17:09:36'),
(16, 1, '127.0.0.1', '2025-02-19 17:11:51', '096475d899a0c5a9b03b10d8f47ab887c3c02164bca96a3a920fd1be34d7cf4c', '2025-02-19 17:11:51', '2025-02-19 17:11:51'),
(17, 1, '127.0.0.1', '2025-02-19 17:12:06', 'c16341437de482d03fa04cdfe9cc38d840beee0bdea8e1dcfe3334eabe7c7ea1', '2025-02-19 17:12:06', '2025-02-19 17:12:06'),
(18, 1, '127.0.0.1', '2025-02-19 17:18:36', '721dc07ae8cc40c0ea32fdca79e96139886ae1a88031e3ec9b961f66ef49c62c', '2025-02-19 17:18:36', '2025-02-19 17:18:36'),
(19, 1, '127.0.0.1', '2025-02-19 17:19:15', '721dc07ae8cc40c0ea32fdca79e96139886ae1a88031e3ec9b961f66ef49c62c', '2025-02-19 17:19:15', '2025-02-19 17:19:15'),
(20, 1, '127.0.0.1', '2025-02-19 17:23:20', '721dc07ae8cc40c0ea32fdca79e96139886ae1a88031e3ec9b961f66ef49c62c', '2025-02-19 17:23:20', '2025-02-19 17:23:20'),
(21, 1, '127.0.0.1', '2025-02-19 17:26:31', '721dc07ae8cc40c0ea32fdca79e96139886ae1a88031e3ec9b961f66ef49c62c', '2025-02-19 17:26:31', '2025-02-19 17:26:31'),
(22, 1, '127.0.0.1', '2025-02-19 17:29:28', '6bd2296a438af0a6c213c187a29ce5e26cd532c0136cb709b152c2296d151117', '2025-02-19 17:29:28', '2025-02-19 17:29:28'),
(23, 1, '127.0.0.1', '2025-02-19 17:33:44', '6bd2296a438af0a6c213c187a29ce5e26cd532c0136cb709b152c2296d151117', '2025-02-19 17:33:44', '2025-02-19 17:33:44'),
(24, 1, '127.0.0.1', '2025-02-19 17:35:06', '6bd2296a438af0a6c213c187a29ce5e26cd532c0136cb709b152c2296d151117', '2025-02-19 17:35:06', '2025-02-19 17:35:06'),
(25, 1, '127.0.0.1', '2025-02-19 17:49:19', '710bfa0f03ad44a9711ba27b5d2a0846935a3a448bb81ffef61db8723628fffb', '2025-02-19 17:49:19', '2025-02-19 17:49:19'),
(26, 1, '127.0.0.1', '2025-02-19 17:51:14', '441c190727e2ff2885b3c47b6f705e185a0d18bd3a31f1d601da095f4ac61cb2', '2025-02-19 17:51:14', '2025-02-19 17:51:14'),
(27, 1, '127.0.0.1', '2025-02-19 17:57:44', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 17:57:44', '2025-02-19 17:57:44'),
(28, 1, '127.0.0.1', '2025-02-19 18:00:35', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:00:35', '2025-02-19 18:00:35'),
(29, 1, '127.0.0.1', '2025-02-19 18:05:16', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:05:16', '2025-02-19 18:05:16'),
(30, 1, '127.0.0.1', '2025-02-19 18:09:47', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:09:47', '2025-02-19 18:09:47'),
(31, 1, '127.0.0.1', '2025-02-19 18:10:36', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:10:36', '2025-02-19 18:10:36'),
(32, 1, '127.0.0.1', '2025-02-19 18:11:29', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:11:29', '2025-02-19 18:11:29'),
(33, 1, '127.0.0.1', '2025-02-19 18:16:52', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:16:52', '2025-02-19 18:16:52'),
(34, 1, '127.0.0.1', '2025-02-19 18:23:00', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:23:00', '2025-02-19 18:23:00'),
(35, 1, '127.0.0.1', '2025-02-19 18:24:42', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:24:42', '2025-02-19 18:24:42'),
(36, 1, '127.0.0.1', '2025-02-19 18:30:23', '5d0a7966325cf513589cbdbb07f8f297b5056081acc23fc140b24ce88967d131', '2025-02-19 18:30:23', '2025-02-19 18:30:23'),
(37, 1, '127.0.0.1', '2025-02-19 19:03:02', 'b5e19be0dc03665f055e98909ca97b7f9be558a2834805fdd3d819ef3a2c3c0a', '2025-02-19 19:03:02', '2025-02-19 19:03:02'),
(38, 1, '127.0.0.1', '2025-02-19 19:04:48', 'a73e26f5415faca3af7758b80684a66b904f00f2d5207a32bfa54d650dd1c195', '2025-02-19 19:04:48', '2025-02-19 19:04:48'),
(39, 1, '127.0.0.1', '2025-02-19 19:14:30', '096475d899a0c5a9b03b10d8f47ab887c3c02164bca96a3a920fd1be34d7cf4c', '2025-02-19 19:14:30', '2025-02-19 19:14:30'),
(40, 1, '127.0.0.1', '2025-02-19 20:02:19', 'a606683c9372293d6b2a22a0b800095966829141b9d554f232e6b6d68de28881', '2025-02-19 20:02:19', '2025-02-19 20:02:19'),
(41, 1, '127.0.0.1', '2025-02-20 00:46:42', '01e7545b3a7faabfba0c19620366651a64a837e326377387c00d1c77f772d568', '2025-02-20 00:46:42', '2025-02-20 00:46:42'),
(42, 1, '127.0.0.1', '2025-02-20 10:53:56', '82d04d89dc8ce38e4592b18900ebef17415eccbc2f7364e2ff1b771c71eab269', '2025-02-20 10:53:56', '2025-02-20 10:53:56'),
(44, 1, '127.0.0.1', '2025-02-21 14:20:14', 'jj', '2025-02-21 14:20:14', '2025-02-21 14:20:14'),
(46, 1, '127.0.0.1', '2025-02-21 14:20:53', 'hh', '2025-02-21 14:20:53', '2025-02-21 14:20:53'),
(47, 1, '127.0.0.1', '2025-02-21 14:21:13', '75f5b55ced260922c6621d396d43ba499b43a3ab2efbcf57f9e3c61194e3135d', '2025-02-21 14:21:13', '2025-02-21 14:21:13'),
(48, 1, '127.0.0.1', '2025-02-21 14:22:40', '75f5b55ced260922c6621d396d43ba499b43a3ab2efbcf57f9e3c61194e3135d', '2025-02-21 14:22:40', '2025-02-21 14:22:40'),
(49, 1, '127.0.0.1', '2025-02-21 14:23:06', '75f5b55ced260922c6621d396d43ba499b43a3ab2efbcf57f9e3c61194e3135d', '2025-02-21 14:23:06', '2025-02-21 14:23:06'),
(50, 1, '127.0.0.1', '2025-02-21 14:37:35', '75f5b55ced260922c6621d396d43ba499b43a3ab2efbcf57f9e3c61194e3135d', '2025-02-21 14:37:35', '2025-02-21 14:37:35');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_02_13_015845_create_periodes_parrainage_table', 2),
(6, '2025_02_14_085512_create_fichier_electoral_table', 3),
(7, '2025_02_14_090349_create_electeurtemps_table', 3),
(8, '2025_02_14_091318_create_electeursproblematiques_table', 4),
(9, '2025_02_14_093110_create_historique_upload_table', 5),
(10, '2025_02_20_140846_create_periode_parrainages_table', 6),
(11, '2025_02_20_145017_periode_parrainage', 7),
(12, '2025_02_20_152351_create_candidats_table', 8),
(13, '2025_02_21_150355_create_parrains_table', 9),
(14, '2025_02_21_151540_create_parrainages_table', 10);

-- --------------------------------------------------------

--
-- Table structure for table `parrainages`
--

CREATE TABLE `parrainages` (
  `id` bigint UNSIGNED NOT NULL,
  `ElecteurID` bigint UNSIGNED NOT NULL,
  `CandidatID` bigint UNSIGNED NOT NULL,
  `CodeValidation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parrains`
--

CREATE TABLE `parrains` (
  `id` bigint UNSIGNED NOT NULL,
  `NumeroCarteElecteur` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CIN` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Prenom` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DateNaissance` date DEFAULT NULL,
  `BureauVote` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CodeAuth` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `CodeExpiration` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `parrains`
--

INSERT INTO `parrains` (`id`, `NumeroCarteElecteur`, `CIN`, `Nom`, `Prenom`, `DateNaissance`, `BureauVote`, `Email`, `Telephone`, `CodeAuth`, `CodeExpiration`, `created_at`, `updated_at`) VALUES
(3, '888222666', '1945656777773', 'Ba', 'Amadou', '1970-03-30', '5', 'taibasakho3@gmail.com', '+221 707348214', '861079', '2025-03-20 13:16:07', '2025-03-01 00:06:07', '2025-03-01 00:06:07'),
(4, '111222333', '111111222222', 'Sakho', 'Rockaya', '2003-03-10', '4', 'rockaya@gmail.com', '771112223', '228824', '2025-03-02 19:26:30', '2025-03-02 19:16:30', '2025-03-02 19:16:30');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `periodeparrainage`
--

CREATE TABLE `periodeparrainage` (
  `id` bigint UNSIGNED NOT NULL,
  `DateDebut` date NOT NULL,
  `DateFin` date NOT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `periodeparrainage`
--

INSERT INTO `periodeparrainage` (`id`, `DateDebut`, `DateFin`, `Active`, `created_at`, `updated_at`) VALUES
(1, '2025-09-23', '2025-11-28', 0, '2025-02-20 14:52:25', '2025-02-23 21:34:43');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(5, 'App\\Models\\User', 3, 'authToken', 'fea3600b17e00f7714806df24fcb45ece481b2486e3805bf6e91567cdb048b90', '[\"*\"]', NULL, NULL, '2025-02-16 14:03:50', '2025-02-16 14:03:50'),
(126, 'App\\Models\\Parrains', 4, 'ParrainToken', '8e31caaa27e6ea1ff3cdbc78ddf8e09b30b806e30227ca5d1c7ef0bc6446bdd2', '[\"parrain\"]', NULL, NULL, '2025-03-03 12:31:01', '2025-03-03 12:31:01'),
(155, 'App\\Models\\User', 1, 'authToken', 'a459d3e3b2573a3bd662d826c91d3ff16db45769332a89b052cea19103e3bd0f', '[\"*\"]', '2025-03-18 08:25:07', NULL, '2025-03-18 07:50:51', '2025-03-18 08:25:07'),
(156, 'App\\Models\\Parrains', 3, 'ParrainToken', 'e8dcdf0ba754f22b6598bde94834adb662a488db2271a544adb716828b1c85c9', '[\"parrain\"]', '2025-03-18 10:18:54', NULL, '2025-03-18 08:37:16', '2025-03-18 10:18:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `prenom`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Sakho', '', 'taibasakho3@gmail.com', NULL, '$2y$10$cfzYKCS1MPUQiygbV9SccO0vVnQ1LnFi5ZWYtuk7STQgNbTkmzFNq', NULL, '2025-02-14 10:06:04', '2025-02-14 10:06:04'),
(2, 'Ndiaye', 'Maty', 'maty@gmail.com', NULL, '$2y$10$QZNukc92OBS791FrKYrljO42OpJAP53upOykvrgD4kzU2gtlW75ry', NULL, '2025-02-16 13:36:33', '2025-02-16 13:36:33'),
(3, 'modou', 'fall', 'modoufall@gmail.com', NULL, '$2y$10$LAp1eO77OTYkEFcldc2EpOzcSDsrqT04ET3YTBVKv/yJm0pJlYnM6', NULL, '2025-02-16 14:03:30', '2025-02-16 14:03:30'),
(4, 'sakho', 'Black', 'blacksakho3@gmail.com', NULL, '$2y$10$C47a2jkPcUVl2meh8RX1x..gegTRU7xH/.20C7gLk9du1vZ4pOsRO', NULL, '2025-02-18 16:46:31', '2025-02-18 16:46:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidats`
--
ALTER TABLE `candidats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `candidats_numerocarteelecteur_unique` (`NumeroCarteElecteur`),
  ADD UNIQUE KEY `candidats_email_unique` (`Email`),
  ADD UNIQUE KEY `candidats_telephone_unique` (`Telephone`);

--
-- Indexes for table `electeurs`
--
ALTER TABLE `electeurs`
  ADD PRIMARY KEY (`NumeroCarteElecteur`),
  ADD UNIQUE KEY `CIN` (`CIN`);

--
-- Indexes for table `electeursproblematiques`
--
ALTER TABLE `electeursproblematiques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `electeursproblematiques_idfichier_foreign` (`IDFichier`);

--
-- Indexes for table `electeurtemps`
--
ALTER TABLE `electeurtemps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `electeurtemps_numerocarteelecteur_unique` (`NumeroCarteElecteur`),
  ADD UNIQUE KEY `electeurtemps_cin_unique` (`CIN`),
  ADD KEY `electeurtemps_idfichier_foreign` (`IDFichier`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `fichierelectoral`
--
ALTER TABLE `fichierelectoral`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `historiqueupload`
--
ALTER TABLE `historiqueupload`
  ADD PRIMARY KEY (`id`),
  ADD KEY `historiqueupload_utilisateurid_foreign` (`UtilisateurID`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parrainages`
--
ALTER TABLE `parrainages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parrainages_electeurid_foreign` (`ElecteurID`),
  ADD KEY `parrainages_candidatid_foreign` (`CandidatID`);

--
-- Indexes for table `parrains`
--
ALTER TABLE `parrains`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `parrains_numerocarteelecteur_unique` (`NumeroCarteElecteur`),
  ADD UNIQUE KEY `parrains_cin_unique` (`CIN`),
  ADD UNIQUE KEY `parrains_email_unique` (`Email`),
  ADD UNIQUE KEY `parrains_telephone_unique` (`Telephone`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `periodeparrainage`
--
ALTER TABLE `periodeparrainage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `periodeparrainage_datedebut_unique` (`DateDebut`),
  ADD UNIQUE KEY `periodeparrainage_datefin_unique` (`DateFin`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidats`
--
ALTER TABLE `candidats`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `electeursproblematiques`
--
ALTER TABLE `electeursproblematiques`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `electeurtemps`
--
ALTER TABLE `electeurtemps`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fichierelectoral`
--
ALTER TABLE `fichierelectoral`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `historiqueupload`
--
ALTER TABLE `historiqueupload`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `parrainages`
--
ALTER TABLE `parrainages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parrains`
--
ALTER TABLE `parrains`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `periodeparrainage`
--
ALTER TABLE `periodeparrainage`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `electeursproblematiques`
--
ALTER TABLE `electeursproblematiques`
  ADD CONSTRAINT `electeursproblematiques_idfichier_foreign` FOREIGN KEY (`IDFichier`) REFERENCES `fichierelectoral` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `electeurtemps`
--
ALTER TABLE `electeurtemps`
  ADD CONSTRAINT `electeurtemps_idfichier_foreign` FOREIGN KEY (`IDFichier`) REFERENCES `fichierelectoral` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `historiqueupload`
--
ALTER TABLE `historiqueupload`
  ADD CONSTRAINT `historiqueupload_utilisateurid_foreign` FOREIGN KEY (`UtilisateurID`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `parrainages`
--
ALTER TABLE `parrainages`
  ADD CONSTRAINT `parrainages_candidatid_foreign` FOREIGN KEY (`CandidatID`) REFERENCES `candidats` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `parrainages_electeurid_foreign` FOREIGN KEY (`ElecteurID`) REFERENCES `parrains` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
