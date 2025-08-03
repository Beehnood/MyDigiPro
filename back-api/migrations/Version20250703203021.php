<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250703203021 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE film (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, tmdb_id INT NOT NULL, title VARCHAR(100) NOT NULL, overview LONGTEXT NOT NULL, note_moyenne DOUBLE PRECISION DEFAULT '0' NOT NULL, poster_path VARCHAR(255) DEFAULT NULL, release_date DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', updated_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', UNIQUE INDEX UNIQ_8244BE2255BCC5E5 (tmdb_id), INDEX IDX_8244BE22A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE film_category (film_id INT NOT NULL, category_id INT NOT NULL, INDEX IDX_A4CBD6A8567F5183 (film_id), INDEX IDX_A4CBD6A812469DE2 (category_id), PRIMARY KEY(film_id, category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE liste (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, nom VARCHAR(50) NOT NULL, type VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, INDEX IDX_FCF22AF4A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE poster (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, tmdb_id INT NOT NULL, file_path VARCHAR(255) NOT NULL, uploaded_at DATETIME NOT NULL, INDEX IDX_2D710CF2A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE poster_access (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, poster_id INT NOT NULL, accessed_at DATETIME NOT NULL, INDEX IDX_ED9399C0A76ED395 (user_id), INDEX IDX_ED9399C05BB66C05 (poster_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE randomizer_log (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, created_at DATETIME NOT NULL, paid TINYINT(1) NOT NULL, INDEX IDX_1AF6D9C6A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE subscription (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(100) NOT NULL, price NUMERIC(10, 2) NOT NULL, duration_in_days INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE test_entity (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, last_name VARCHAR(50) NOT NULL, first_name VARCHAR(50) NOT NULL, email VARCHAR(100) NOT NULL, country VARCHAR(50) NOT NULL, city VARCHAR(50) NOT NULL, username VARCHAR(50) NOT NULL, password VARCHAR(100) NOT NULL, interests VARCHAR(255) DEFAULT NULL, points INT NOT NULL, is_premium TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, roles JSON NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), UNIQUE INDEX UNIQ_8D93D649F85E0677 (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_film_reference (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, tmdb_id INT NOT NULL, type VARCHAR(255) NOT NULL, INDEX IDX_F1EAC879A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_subscription (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, subscription_id INT NOT NULL, started_at DATETIME NOT NULL, ended_at DATETIME DEFAULT NULL, is_active TINYINT(1) NOT NULL, INDEX IDX_230A18D1A76ED395 (user_id), INDEX IDX_230A18D19A1887DC (subscription_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE film ADD CONSTRAINT FK_8244BE22A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE film_category ADD CONSTRAINT FK_A4CBD6A8567F5183 FOREIGN KEY (film_id) REFERENCES film (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE film_category ADD CONSTRAINT FK_A4CBD6A812469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE liste ADD CONSTRAINT FK_FCF22AF4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster ADD CONSTRAINT FK_2D710CF2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster_access ADD CONSTRAINT FK_ED9399C0A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster_access ADD CONSTRAINT FK_ED9399C05BB66C05 FOREIGN KEY (poster_id) REFERENCES poster (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE randomizer_log ADD CONSTRAINT FK_1AF6D9C6A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_film_reference ADD CONSTRAINT FK_F1EAC879A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_subscription ADD CONSTRAINT FK_230A18D1A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_subscription ADD CONSTRAINT FK_230A18D19A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE film DROP FOREIGN KEY FK_8244BE22A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE film_category DROP FOREIGN KEY FK_A4CBD6A8567F5183
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE film_category DROP FOREIGN KEY FK_A4CBD6A812469DE2
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE liste DROP FOREIGN KEY FK_FCF22AF4A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster DROP FOREIGN KEY FK_2D710CF2A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster_access DROP FOREIGN KEY FK_ED9399C0A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster_access DROP FOREIGN KEY FK_ED9399C05BB66C05
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE randomizer_log DROP FOREIGN KEY FK_1AF6D9C6A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_film_reference DROP FOREIGN KEY FK_F1EAC879A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_subscription DROP FOREIGN KEY FK_230A18D1A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_subscription DROP FOREIGN KEY FK_230A18D19A1887DC
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE category
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE film
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE film_category
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE liste
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE poster
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE poster_access
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE randomizer_log
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE subscription
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE test_entity
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_film_reference
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_subscription
        SQL);
    }
}
