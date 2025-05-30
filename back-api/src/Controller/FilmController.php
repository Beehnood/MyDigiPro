<?php

namespace App\Controller;

use App\Entity\Film;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\TMDBClient;

class FilmController extends AbstractController
{
    #[Route('/api/films/sync', name: 'sync_films', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function syncPopular(
        TMDBClient $tmdbClient,
        EntityManagerInterface $em
    ): JsonResponse {
        $tmdbMovies = $tmdbClient->fetchPopularMovies();
        $added = 0;

        foreach ($tmdbMovies['results'] as $tmdbMovie) {
            $existing = $em->getRepository(Film::class)->findOneBy(['tmdbId' => $tmdbMovie['id']]);
            if ($existing) {
                continue;
            }

            $film = new Film();
            $film->setTitle($tmdbMovie['title']);
            $film->setTmdbId($tmdbMovie['id']);
            $film->setOverview($tmdbMovie['overview']);
            $film->setPosterPath($tmdbMovie['poster_path']);
            $film->setReleaseDate(new \DateTime($tmdbMovie['release_date']));

            $em->persist($film);
            $added++;
        }

        $em->flush();

        return $this->json(['message' => "$added films ajoutés."]);
    }
}

