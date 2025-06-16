<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\TMDBClient;
use Psr\Log\LoggerInterface;
use App\Entity\UserFilmReference;
use App\Entity\User;
use App\Enum\TypeListe;

class UserFilmController extends AbstractController
{
    #[Route('/api/user/films', name: 'add_user_film', methods: ['POST'])]
    public function addUserFilm(Request $request, EntityManagerInterface $em, TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            if (!$user instanceof User) {
                return new JsonResponse(['error' => 'Utilisateur non authentifié ou invalide'], 401);
            }

            $data = json_decode($request->getContent(), true);
            $tmdbId = $data['tmdbId'] ?? null;
            $type = $data['type'] ?? null;

            if (!$tmdbId || !is_numeric($tmdbId)) {
                return new JsonResponse(['error' => 'TMDB ID invalide'], 400);
            }

            $typeEnum = TypeListe::tryFrom($type);
            if (!$typeEnum) {
                return new JsonResponse(['error' => 'Type de liste invalide'], 400);
            }

            $tmdbMovie = $tmdbClient->fetchMovieDetails($tmdbId);
            if (!$tmdbMovie || !isset($tmdbMovie['id'])) {
                return new JsonResponse(['error' => 'Film non trouvé sur TMDB'], 404);
            }

            // Vérifier si la référence existe déjà
            $existingReference = $em->getRepository(UserFilmReference::class)->findOneBy([
                'tmdbId' => $tmdbId,
                'user' => $user,
                'type' => $typeEnum,
            ]);

            if ($existingReference) {
                return new JsonResponse(['message' => 'Film déjà dans la liste'], 200);
            }

            $filmReference = new UserFilmReference();
            $filmReference->setTmdbId($tmdbId);
            $filmReference->setType($typeEnum);
            $filmReference->setUser($user);

            $em->persist($filmReference);
            $em->flush();

            $logger->info('Film ajouté à la liste.', ['tmdbId' => $tmdbId, 'type' => $typeEnum->value, 'user' => $user->getUserIdentifier()]);

            return new JsonResponse(['message' => 'Film ajouté à la liste'], 201);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de l\'ajout du film.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur serveur'], 500);
        }
    }

    #[Route('/api/user/films', name: 'get_user_films', methods: ['GET'])]
    public function getUserFilms(TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            if (!$user instanceof User) {
                return new JsonResponse(['error' => 'Utilisateur non authentifié ou invalide'], 401);
            }

            $filmReferences = $user->getFilmReferences();
            $movies = [];
            foreach ($filmReferences as $reference) {
                $tmdbMovie = $tmdbClient->fetchMovieDetails($reference->getTmdbId());
                if ($tmdbMovie && isset($tmdbMovie['id'])) {
                    $movies[] = [
                        'tmdbId' => $tmdbMovie['id'],
                        'title' => $tmdbMovie['title'],
                        'overview' => $tmdbMovie['overview'] ?? '',
                        'posterPath' => $tmdbMovie['poster_path'] ?? null,
                        'releaseDate' => $tmdbMovie['release_date'] ?? null,
                        'genres' => array_map(fn($genre) => $genre['id'], $tmdbMovie['genres'] ?? []),
                        'note' => $tmdbMovie['vote_average'] ?? 0.0,
                        'type' => $reference->getType()->value,
                    ];
                }
            }

            $logger->info('Films récupérés pour l\'utilisateur.', ['user' => $user->getUserIdentifier(), 'count' => count($movies)]);
            return new JsonResponse($movies);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des films.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur serveur'], 500);
        }
    }

    #[Route('/api/user/films/{tmdbId}/{type}', name: 'delete_user_film', methods: ['DELETE'])]
    public function deleteUserFilm(int $tmdbId, string $type, EntityManagerInterface $em, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            if (!$user instanceof User) {
                return new JsonResponse(['error' => 'Utilisateur non authentifié ou invalide'], 401);
            }

            $typeEnum = TypeListe::tryFrom($type);
            if (!$typeEnum) {
                return new JsonResponse(['error' => 'Type de liste invalide'], 400);
            }

            $filmReference = $em->getRepository(UserFilmReference::class)->findOneBy([
                'tmdbId' => $tmdbId,
                'user' => $user,
                'type' => $typeEnum,
            ]);

            if (!$filmReference) {
                return new JsonResponse(['error' => 'Film non trouvé dans la liste'], 404);
            }

            $em->remove($filmReference);
            $em->flush();

            $logger->info('Film supprimé de la liste.', ['tmdbId' => $tmdbId, 'type' => $typeEnum->value, 'user' => $user->getUserIdentifier()]);
            return new JsonResponse(['message' => 'Film supprimé avec succès']);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la suppression du film.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur serveur'], 500);
        }
    }
}