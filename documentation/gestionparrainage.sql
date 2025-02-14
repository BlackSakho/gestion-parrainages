-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 12, 2025 at 10:02 PM
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
  `NumeroCarteElecteur` varchar(20) NOT NULL,
  `Nom` varchar(50) NOT NULL,
  `Prenom` varchar(50) NOT NULL,
  `DateNaissance` date NOT NULL,
  `Email` varchar(191) NOT NULL,
  `Telephone` varchar(20) NOT NULL,
  `PartiPolitique` varchar(100) DEFAULT NULL,
  `Slogan` varchar(255) DEFAULT NULL,
  `Photo` varchar(255) DEFAULT NULL,
  `Couleurs` varchar(50) DEFAULT NULL,
  `URL` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `electeurs`
--

CREATE TABLE `electeurs` (
  `NumeroCarteElecteur` varchar(20) NOT NULL,
  `CIN` varchar(20) NOT NULL,
  `Nom` varchar(50) NOT NULL,
  `Prenom` varchar(50) NOT NULL,
  `DateNaissance` date NOT NULL,
  `BureauVote` varchar(50) NOT NULL,
  `Email` varchar(191) NOT NULL,
  `Telephone` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `electeurs`
--

INSERT INTO `electeurs` (`NumeroCarteElecteur`, `CIN`, `Nom`, `Prenom`, `DateNaissance`, `BureauVote`, `Email`, `Telephone`, `created_at`) VALUES
('ELEC123456', 'SN12345678', 'Doe', 'John', '1985-07-12', 'Dakar', 'john.doe@email.com', '771234567', '2025-02-11 13:46:38');

-- --------------------------------------------------------

--
-- Table structure for table `electeursproblematiques`
--

CREATE TABLE `electeursproblematiques` (
  `IDProbleme` int NOT NULL,
  `IDFichier` int NOT NULL,
  `NumeroCarteElecteur` varchar(25) DEFAULT NULL,
  `CIN` varchar(25) DEFAULT NULL,
  `NatureProbleme` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `BureauVote` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Telephone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IDFichier` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
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
  `IDFichier` int NOT NULL,
  `NomFichier` varchar(255) NOT NULL,
  `Checksum` varchar(64) NOT NULL,
  `Statut` enum('En attente','Validé','Erreur') DEFAULT 'En attente',
  `DateImportation` datetime DEFAULT CURRENT_TIMESTAMP,
  `EtatUploadElecteurs` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `historiqueupload`
--

CREATE TABLE `historiqueupload` (
  `IDUpload` int NOT NULL,
  `UtilisateurID` int NOT NULL,
  `AdresseIP` varchar(15) NOT NULL,
  `DateUpload` datetime DEFAULT CURRENT_TIMESTAMP,
  `ClefUtilisee` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `parrainages`
--

CREATE TABLE `parrainages` (
  `IDParrainage` int NOT NULL,
  `ElecteurID` varchar(20) NOT NULL,
  `CandidatID` varchar(20) NOT NULL,
  `DateParrainage` datetime DEFAULT CURRENT_TIMESTAMP,
  `CodeValidation` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `IDUtilisateur` int NOT NULL,
  `NomUtilisateur` varchar(50) NOT NULL,
  `MotDePasse` varchar(255) NOT NULL,
  `Role` enum('Admin','Gestionnaire') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidats`
--
ALTER TABLE `candidats`
  ADD PRIMARY KEY (`NumeroCarteElecteur`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Telephone` (`Telephone`);

--
-- Indexes for table `electeurs`
--
ALTER TABLE `electeurs`
  ADD PRIMARY KEY (`NumeroCarteElecteur`),
  ADD UNIQUE KEY `CIN` (`CIN`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Telephone` (`Telephone`);

--
-- Indexes for table `electeursproblematiques`
--
ALTER TABLE `electeursproblematiques`
  ADD PRIMARY KEY (`IDProbleme`),
  ADD KEY `IDFichier` (`IDFichier`);

--
-- Indexes for table `electeurtemps`
--
ALTER TABLE `electeurtemps`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`IDFichier`);

--
-- Indexes for table `historiqueupload`
--
ALTER TABLE `historiqueupload`
  ADD PRIMARY KEY (`IDUpload`),
  ADD KEY `UtilisateurID` (`UtilisateurID`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parrainages`
--
ALTER TABLE `parrainages`
  ADD PRIMARY KEY (`IDParrainage`),
  ADD KEY `ElecteurID` (`ElecteurID`),
  ADD KEY `CandidatID` (`CandidatID`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

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
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`IDUtilisateur`),
  ADD UNIQUE KEY `NomUtilisateur` (`NomUtilisateur`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `electeursproblematiques`
--
ALTER TABLE `electeursproblematiques`
  MODIFY `IDProbleme` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `electeurtemps`
--
ALTER TABLE `electeurtemps`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fichierelectoral`
--
ALTER TABLE `fichierelectoral`
  MODIFY `IDFichier` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `historiqueupload`
--
ALTER TABLE `historiqueupload`
  MODIFY `IDUpload` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `parrainages`
--
ALTER TABLE `parrainages`
  MODIFY `IDParrainage` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `IDUtilisateur` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidats`
--
ALTER TABLE `candidats`
  ADD CONSTRAINT `candidats_ibfk_1` FOREIGN KEY (`NumeroCarteElecteur`) REFERENCES `electeurs` (`NumeroCarteElecteur`) ON DELETE CASCADE;

--
-- Constraints for table `electeursproblematiques`
--
ALTER TABLE `electeursproblematiques`
  ADD CONSTRAINT `electeursproblematiques_ibfk_1` FOREIGN KEY (`IDFichier`) REFERENCES `fichierelectoral` (`IDFichier`) ON DELETE CASCADE;

--
-- Constraints for table `historiqueupload`
--
ALTER TABLE `historiqueupload`
  ADD CONSTRAINT `historiqueupload_ibfk_1` FOREIGN KEY (`UtilisateurID`) REFERENCES `utilisateurs` (`IDUtilisateur`) ON DELETE CASCADE;

--
-- Constraints for table `parrainages`
--
ALTER TABLE `parrainages`
  ADD CONSTRAINT `parrainages_ibfk_1` FOREIGN KEY (`ElecteurID`) REFERENCES `electeurs` (`NumeroCarteElecteur`) ON DELETE CASCADE,
  ADD CONSTRAINT `parrainages_ibfk_2` FOREIGN KEY (`CandidatID`) REFERENCES `candidats` (`NumeroCarteElecteur`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



