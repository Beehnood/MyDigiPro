<?php

namespace App\Command;

use App\Service\TMDBClient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:import:film',
    description: 'Importe un film spécifique depuis TMDB par tmdbId'
)]
class ImportFilmCommand extends Command
{
    private $tmdbClient;
    private $entityManager;

    public function __construct(TMDBClient $tmdbClient, EntityManagerInterface $entityManager)
    {
        $this->tmdbClient = $tmdbClient;
        $this->entityManager = $entityManager;
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('tmdbId', InputArgument::REQUIRED, 'L\'ID TMDB du film à importer');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $tmdbId = $input->getArgument('tmdbId');
            $tmdbMovie = $this->tmdbClient->fetchMovieById($tmdbId);

            $existing = $this->entityManager->getRepository(\App\Entity\Film::class)->findOneBy(['tmdbId' => $tmdbMovie['id']]);
            if ($existing) {
                $output->writeln('Film déjà existant.');
                return Command::SUCCESS;
            }

            $film = new \App\Entity\Film();
            $film->setTmdbId($tmdbMovie['id']);
            $film->setTitle($tmdbMovie['title']);
            $film->setOverview($tmdbMovie['overview'] ?? '');
            $film->setPosterPath($tmdbMovie['poster_path'] ?? null);
            $film->setReleaseDate($tmdbMovie['release_date'] ? new \DateTime($tmdbMovie['release_date']) : null);
            $film->setNoteMoyenne($tmdbMovie['vote_average'] ?? 0.0);

            $this->entityManager->persist($film);
            $this->entityManager->flush();
            $output->writeln('Film ajouté.');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $output->writeln('Erreur : ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}