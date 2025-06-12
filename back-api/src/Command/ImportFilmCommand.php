<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Film;
use App\Service\TMDBClient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:import:film',
    description: 'Importe un film spécifique depuis TMDB par son ID'
)]
class ImportFilmCommand extends Command
{
    public function __construct(
        private readonly TMDBClient $tmdbClient,
        private readonly EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('tmdbId', InputArgument::REQUIRED, 'L\'ID TMDB du film à importer (doit être un entier positif)');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $tmdbId = $input->getArgument('tmdbId');

        // Validation de l'argument
        if (!is_numeric($tmdbId) || (int) $tmdbId <= 0) {
            $io->error('L\'ID TMDB doit être un entier positif.');
            return Command::FAILURE;
        }

        $tmdbId = (int) $tmdbId;

        try {
            $io->section(sprintf('Importation du film TMDB ID %d', $tmdbId));

            // Vérifier si le film existe déjà
            $existingFilm = $this->entityManager->getRepository(Film::class)->findOneBy(['tmdbId' => $tmdbId]);
            if ($existingFilm) {
                $io->warning(sprintf('Le film "%s" (TMDB ID: %d) existe déjà.', $existingFilm->getTitle(), $tmdbId));
                return Command::SUCCESS;
            }

            // Récupérer les données du film depuis TMDB
            $tmdbMovie = $this->tmdbClient->fetchMovieDetails($tmdbId);

            // Créer l'entité Film
            $film = $this->createFilmFromTmdbData($tmdbMovie);
            $this->entityManager->persist($film);
            $this->entityManager->flush();

            $io->success(sprintf('Film "%s" (TMDB ID: %d) importé avec succès.', $film->getTitle(), $tmdbId));
            return Command::SUCCESS;
        } catch (\RuntimeException $e) {
            $io->error(sprintf('Erreur lors de la récupération des données TMDB : %s', $e->getMessage()));
            return Command::FAILURE;
        } catch (\Exception $e) {
            $io->error(sprintf('Erreur lors de l\'importation du film : %s', $e->getMessage()));
            return Command::FAILURE;
        }
    }

    /**
     * Crée une entité Film à partir des données TMDB.
     */
    private function createFilmFromTmdbData(array $tmdbMovie): Film
    {
        $film = new Film();
        $film->setTmdbId($tmdbMovie['id']);
        $film->setTitle($tmdbMovie['title'] ?? 'Titre inconnu');
        $film->setOverview($tmdbMovie['overview'] ?? '');
        $film->setPosterPath($tmdbMovie['poster_path'] ?? null);
        $film->setReleaseDate(
            !empty($tmdbMovie['release_date']) ? new \DateTime($tmdbMovie['release_date']) : null
        );
        $film->setNoteMoyenne($tmdbMovie['vote_average'] ?? 0.0);

        return $film;
    }
}