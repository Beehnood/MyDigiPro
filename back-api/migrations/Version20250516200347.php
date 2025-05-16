<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250516200347 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE film ADD tmdb_id INT NOT NULL, CHANGE titre title VARCHAR(100) NOT NULL, CHANGE synopsis overview LONGTEXT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_8244BE2255BCC5E5 ON film (tmdb_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE subscription ADD created_at DATETIME NOT NULL, ADD updated_at DATETIME NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_8244BE2255BCC5E5 ON film
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE film DROP tmdb_id, CHANGE title titre VARCHAR(100) NOT NULL, CHANGE overview synopsis LONGTEXT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE subscription DROP created_at, DROP updated_at
        SQL);
    }
}
