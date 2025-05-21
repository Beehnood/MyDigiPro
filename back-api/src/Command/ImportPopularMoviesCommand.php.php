<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use App\Service\TMDBClient; // Make sure this path matches the actual location of TMDBClient
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Film;

#[AsCommand(
    name: 'FilmImporterCommand',
    description: 'Add a short description for your command',
)]// src/Command/ImportPopularMoviesCommand.php

#[AsCommand(name: 'app:import:popular-movies')]
class ImportPopularMoviesCommand extends Command
{
    public function __construct(
        private TMDBClient $tmdbClient,
        private EntityManagerInterface $em
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $movies = $this->tmdbClient->fetchPopularMovies();

        foreach ($movies['results'] as $data) {
            $existing = $this->em->getRepository(Film::class)->findOneBy(['tmdbId' => $data['id']]);
            if ($existing) continue;

            $film = new Film();
            $film->setTmdbId($data['id']);
            $film->setTitle($data['title']);
            $film->setOverview($data['overview'] ?? '');
            $film->setPosterPath($data['poster_path'] ?? null);

            $this->em->persist($film);
        }

        $this->em->flush();
        $output->writeln('Films importés avec succès.');
        return Command::SUCCESS;
    }
}

class FilmImporterCommand extends Command
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $arg1 = $input->getArgument('arg1');

        if ($arg1) {
            $io->note(sprintf('You passed an argument: %s', $arg1));
        }

        if ($input->getOption('option1')) {
            // ...
        }

        $io->success('You have a new command! Now make it your own! Pass --help to see your options.');

        return Command::SUCCESS;
    }
}
