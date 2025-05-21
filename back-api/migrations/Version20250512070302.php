<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250512070302 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE poster ADD user_id INT NOT NULL, ADD film_id INT NOT NULL, ADD file_path VARCHAR(255) NOT NULL, ADD uploaded_at DATETIME NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster ADD CONSTRAINT FK_2D710CF2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster ADD CONSTRAINT FK_2D710CF2567F5183 FOREIGN KEY (film_id) REFERENCES film (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_2D710CF2A76ED395 ON poster (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_2D710CF2567F5183 ON poster (film_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE poster DROP FOREIGN KEY FK_2D710CF2A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster DROP FOREIGN KEY FK_2D710CF2567F5183
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_2D710CF2A76ED395 ON poster
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_2D710CF2567F5183 ON poster
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster DROP user_id, DROP film_id, DROP file_path, DROP uploaded_at
        SQL);
    }
}
