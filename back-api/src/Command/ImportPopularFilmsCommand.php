<?php

namespace App\Command;

use App\Service\TMDBClient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:import:popular-films',
    description: 'Importe les films populaires depuis TMDB'
)]
class ImportPopularFilmsCommand extends Command
{
    private $tmdbClient;
    private $entityManager;

    public function __construct(TMDBClient $tmdbClient, EntityManagerInterface $entityManager)
    {
        $this->tmdbClient = $tmdbClient;
        $this->entityManager = $entityManager;
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        try {
            $tmdbMovies = $this->tmdbClient->fetchPopularMovies();
            $added = 0;

            foreach ($tmdbMovies['results'] as $tmdbMovie) {
                $existing = $this->entityManager->getRepository(\App\Entity\Film::class)->findOneBy(['tmdbId' => $tmdbMovie['id']]);
                if ($existing) {
                    continue;
                }

                $film = new \App\Entity\Film();
                $film->setTmdbId($tmdbMovie['id']);
                $film->setTitle($tmdbMovie['title']);
                $film->setOverview($tmdbMovie['overview'] ?? '');
                $film->setPosterPath($tmdbMovie['poster_path'] ?? null);
                $film->setReleaseDate($tmdbMovie['release_date'] ? new \DateTime($tmdbMovie['release_date']) : null);
                $film->setNoteMoyenne($tmdbMovie['vote_average'] ?? 0.0);

                $this->entityManager->persist($film);
                $added++;
            }

            $this->entityManager->flush();
            $output->writeln("$added films ajoutés.");
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $output->writeln('Erreur : ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}