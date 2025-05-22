<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250521202237 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE user_subscription (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, subscription_id INT NOT NULL, started_at DATETIME NOT NULL, ended_at DATETIME DEFAULT NULL, is_active TINYINT(1) NOT NULL, INDEX IDX_230A18D1A76ED395 (user_id), INDEX IDX_230A18D19A1887DC (subscription_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_subscription ADD CONSTRAINT FK_230A18D1A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_subscription ADD CONSTRAINT FK_230A18D19A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user DROP FOREIGN KEY FK_8D93D6499A1887DC
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_8D93D6499A1887DC ON user
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user DROP subscription_id
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE user_subscription DROP FOREIGN KEY FK_230A18D1A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_subscription DROP FOREIGN KEY FK_230A18D19A1887DC
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_subscription
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD subscription_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user ADD CONSTRAINT FK_8D93D6499A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id) ON UPDATE NO ACTION ON DELETE NO ACTION
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_8D93D6499A1887DC ON user (subscription_id)
        SQL);
    }
}
