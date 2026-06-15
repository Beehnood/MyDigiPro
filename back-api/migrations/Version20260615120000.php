<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260615120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Allow registration without first name, last name, country, and city.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user CHANGE last_name last_name VARCHAR(50) DEFAULT NULL, CHANGE first_name first_name VARCHAR(50) DEFAULT NULL, CHANGE country country VARCHAR(50) DEFAULT NULL, CHANGE city city VARCHAR(50) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql("UPDATE user SET last_name = '' WHERE last_name IS NULL");
        $this->addSql("UPDATE user SET first_name = '' WHERE first_name IS NULL");
        $this->addSql("UPDATE user SET country = '' WHERE country IS NULL");
        $this->addSql("UPDATE user SET city = '' WHERE city IS NULL");
        $this->addSql('ALTER TABLE user CHANGE last_name last_name VARCHAR(50) NOT NULL, CHANGE first_name first_name VARCHAR(50) NOT NULL, CHANGE country country VARCHAR(50) NOT NULL, CHANGE city city VARCHAR(50) NOT NULL');
    }
}
