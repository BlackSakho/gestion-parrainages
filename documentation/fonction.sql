DELIMITER //

CREATE FUNCTION ControlerElecteurs(
    numeroCarte VARCHAR(25), 
    cin VARCHAR(25), 
    nom VARCHAR(50), 
    prenom VARCHAR(50), 
    dateNaissance DATE, 
    bureauVote VARCHAR(50), 
    email VARCHAR(100), 
    telephone VARCHAR(15), 
    fichierID INT
) RETURNS BOOLEAN 
DETERMINISTIC
BEGIN
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
END //

DELIMITER ;

--valider importation

DELIMITER //

CREATE PROCEDURE ValiderImportation(IN fichierID INT)
BEGIN
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

    boucleElecteurs: LOOP
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
END //

DELIMITER ;
