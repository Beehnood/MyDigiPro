<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250516102246 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE poster_access (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, poster_id INT NOT NULL, accessed_at DATETIME NOT NULL, INDEX IDX_ED9399C0A76ED395 (user_id), INDEX IDX_ED9399C05BB66C05 (poster_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster_access ADD CONSTRAINT FK_ED9399C0A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster_access ADD CONSTRAINT FK_ED9399C05BB66C05 FOREIGN KEY (poster_id) REFERENCES poster (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD points INT NOT NULL, ADD is_premium TINYINT(1) NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE poster_access DROP FOREIGN KEY FK_ED9399C0A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE poster_access DROP FOREIGN KEY FK_ED9399C05BB66C05
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE poster_access
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user DROP points, DROP is_premium
        SQL);
    }
}
