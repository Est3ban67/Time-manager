-- ==========================================
--  DATABASE: Time Manager
--  DESCRIPTION: Structure des tables principales
-- ==========================================

-- Supprime les tables si elles existent déjà (pour redémarrer proprement)
DROP TABLE IF EXISTS clocks;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS teams;

-- ==========================
-- TABLE: teams
-- ==========================
CREATE TABLE teams (
    id_teams INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    id_manager INT NULL
) ENGINE=InnoDB;

-- ==========================
-- TABLE: users
-- ==========================
CREATE TABLE users (
    id_users INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    password_hash TEXT NOT NULL,
    role ENUM('EMPLOYEE', 'MANAGER') DEFAULT 'EMPLOYEE',
    tea INT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Ajoute la contrainte id_manager → user
ALTER TABLE teams
ADD CONSTRAINT fk_manager
FOREIGN KEY (id_manager)
REFERENCES users(id_users)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- ==========================
-- TABLE: clocks
-- ==========================
CREATE TABLE clocks (
    id_clocks INT AUTO_INCREMENT PRIMARY KEY,
    id_users INT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type ENUM('IN', 'OUT') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================
-- TABLE: reports
-- ==========================
CREATE TABLE reports (
    id_reports INT AUTO_INCREMENT PRIMARY KEY,
    id_users INT NULL,
    kpi_type VARCHAR(50) NOT NULL,
    kpi_value DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================
-- INSERTIONS DE TEST
-- ==========================

-- Équipes
INSERT INTO teams (name, description) VALUES
('Développement', 'Équipe technique'),
('Ressources Humaines', 'Équipe RH'),
('R & I', 'Équipe Recherche & Innovation'),
('Bien-être', 'Équipe Bien-être'),
('Comptabilité', 'Equipe comptable')

-- Utilisateurs
INSERT INTO users (first_name, last_name, email, password_hash, role, team_id)
VALUES
('Alice', 'Durand', 'alice@example.com', 'hashed_pwd', 'MANAGER', 1),
('Bob', 'Martin', 'bob@example.com', 'hashed_pwd', 'EMPLOYEE', 1),
('Chloé', 'Petit', 'chloe@example.com', 'hashed_pwd', 'EMPLOYEE', 2);

-- Associe Alice comme manager de l’équipe 1
UPDATE teams SET manager_id = 1 WHERE id = 1;

-- Clocks
INSERT INTO clocks (user_id, timestamp, type)
VALUES
(2, NOW(), 'IN'),
(2, DATE_SUB(NOW(), INTERVAL 8 HOUR), 'OUT');

-- Reports
INSERT INTO reports (user_id, kpi_type, kpi_value)
VALUES
(1, 'Taux de présence', 95.5),
(2, 'Heures travaillées', 38.0);

-- ==========================
-- Vues ou index (optionnel)
-- ==========================
CREATE INDEX idx_users_team ON users(team_id);
CREATE INDEX idx_clocks_user ON clocks(user_id);
CREATE INDEX idx_reports_user ON reports(user_id);
