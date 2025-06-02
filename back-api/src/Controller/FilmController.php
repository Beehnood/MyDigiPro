<?php

namespace App\Controller;

use App\Entity\Film;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\TMDBClient;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Delete;
use Psr\Log\LoggerInterface;
use ApiPlatform\OpenApi\Model\Operation;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/api/films/populaires',
            controller: FilmController::class,
            name: 'films_populaires',
            openapi: new Operation(
                summary: 'Récupère la liste des films populaires',
                description: 'Récupère les films populaires depuis l\'API TMDB',
                responses: [
                    '200' => [
                        'description' => 'Liste des films populaires',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'array',
                                    'items' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'tmdbId' => ['type' => 'integer'],
                                            'title' => ['type' => 'string'],
                                            'overview' => ['type' => 'string'],
                                            'posterPath' => ['type' => 'string'],
                                            'releaseDate' => ['type' => 'string'],
                                            'note' => ['type' => 'number'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    '404' => [
                        'description' => 'Ressource non trouvée',
                    ],
                ]
            )
        ),
    ]
)]
class FilmController extends AbstractController
{
    // #[Route('/api/films/sync', name: 'sync_films', methods: ['POST'])]
    // #[IsGranted('ROLE_ADMIN')]
    // public function syncPopular(
    //     TMDBClient $tmdbClient,
    //     EntityManagerInterface $em
    // ): JsonResponse {
    //     try {
    //         $tmdbMovies = $tmdbClient->fetchPopularMovies();
    //         $added = 0;

    //         foreach ($tmdbMovies['results'] as $tmdbMovie) {
    //             $existing = $em->getRepository(Film::class)->findOneBy(['tmdbId' => $tmdbMovie['id']]);
    //             if ($existing) {
    //                 continue;
    //             }

    //             $film = new Film();
    //             $film->setTitle($tmdbMovie['title']);
    //             $film->setTmdbId($tmdbMovie['id']);
    //             $film->setOverview($tmdbMovie['overview']);
    //             $film->setPosterPath($tmdbMovie['poster_path']);
    //             $film->setReleaseDate(new \DateTime($tmdbMovie['release_date']));

    //             $em->persist($film);
    //             $added++;
    //         }

    //         $em->flush();

    //         return $this->json(['message' => "$added films ajoutés."]);
    //     } catch (\Exception $e) {
    //         return $this->json(['error' => 'Erreur lors de la synchronisation: ' . $e->getMessage()], 500);
    //     }
    // }

    #[Route('/api/films/populaires', name: 'films_populaires', methods: ['GET'])]
    public function getPopularFilms(TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $tmdbMovies = $tmdbClient->fetchPopularMovies();
            $logger->info('Films populaires récupérés depuis TMDB.', ['count' => count($tmdbMovies['results'])]);
            $films = array_map(function ($movie) {
                return [
                    'tmdbId' => $movie['id'],
                    'title' => $movie['title'],
                    'overview' => $movie['overview'] ?? '',
                    'posterPath' => $movie['poster_path'] ?? null,
                    'releaseDate' => $movie['release_date'] ?? null,
                    'note' => $movie['vote_average'] ?? 0.0,
                ];
            }, $tmdbMovies['results']);
            return new JsonResponse($films);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des films populaires.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur lors de la récupération des films'], 500);
        }
    }

    // #[Route('/api/films/{id}', name: 'get_film', methods: ['GET'])]
    // public function getFilm(int $id, EntityManagerInterface $em): JsonResponse
    // {
    //     $film = $em->getRepository(Film::class)->find($id);

    //     if (!$film) {
    //         return $this->json(['message' => 'Film not found'], 404);
    //     }

    //     return $this->json([
    //         'id' => $film->getId(),
    //         'title' => $film->getTitle(),
    //         'tmdbId' => $film->getTmdbId(),
    //         'overview' => $film->getOverview(),
    //         'posterPath' => $film->getPosterPath(),
    //         'releaseDate' => $film->getReleaseDate()->format('Y-m-d'),
    //     ]);
    // }

    // #[Route('/api/films/{id}', name: 'delete_film', methods: ['DELETE'])]
    // #[IsGranted('ROLE_ADMIN')]
    // public function deleteFilm(int $id, EntityManagerInterface $em): JsonResponse
    // {
    //     $film = $em->getRepository(Film::class)->find($id);

    //     if (!$film) {
    //         return $this->json(['message' => 'Film not found'], 404);
    //     }

    //     $em->remove($film);
    //     $em->flush();

    //     return $this->json(['message' => 'Film deleted successfully']);
    // }

    // #[Route('/api/films', name: 'add_film', methods: ['POST'])]
    // #[IsGranted('ROLE_ADMIN')]
    // public function addFilm(TMDBClient $tmdbClient, EntityManagerInterface $em): JsonResponse
    // {
    //     try {
    //         $tmdbMovies = $tmdbClient->fetchMovies();
    //         $added = 0;

    //         foreach ($tmdbMovies['results'] as $tmdbMovie) {
    //             $existing = $em->getRepository(Film::class)->findOneBy(['tmdbId' => $tmdbMovie['id']]);
    //             if ($existing) {
    //                 continue;
    //             }

    //             $film = new Film();
    //             $film->setTitle($tmdbMovie['title']);
    //             $film->setTmdbId($tmdbMovie['id']);
    //             $film->setOverview($tmdbMovie['overview']);
    //             $film->setPosterPath($tmdbMovie['poster_path']);
    //             $film->setReleaseDate(new \DateTime($tmdbMovie['release_date']));

    //             $em->persist($film);
    //             $added++;
    //         }

    //         $em->flush();

    //         return $this->json(['message' => "$added films ajoutés."]);
    //     } catch (\Exception $e) {
    //         return $this->json(['error' => 'Erreur lors de l\'ajout des films: ' . $e->getMessage()], 500);
    //     }
    // }

    // test
    #[Route('/api/test', name: 'test_endpoint', methods: ['GET'])]
    public function test(): JsonResponse
    {
        return $this->json(['message' => 'Test endpoint works!']);
    }

}