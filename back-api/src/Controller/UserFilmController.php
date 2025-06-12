<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserFilmReference;
use App\Service\TMDBClient;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\Cache\CacheInterface;

class UserFilmController extends AbstractController
{
    public function addUserFilm(
        Request $request,
        TMDBClient $tmdbClient,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        LoggerInterface $logger,
        CacheInterface $cache
    ): JsonResponse {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user) {
                $logger->warning('Utilisateur non authentifié.');
                return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
            }

            $data = json_decode($request->getContent(), true);
            if (!isset($data['tmdbId']) || !is_int($data['tmdbId'])) {
                $logger->warning('tmdbId invalide dans la requête.', ['data' => $data]);
                return new JsonResponse(['error' => 'tmdbId doit être un entier valide'], 400);
            }

            $tmdbId = $data['tmdbId'];
            $existing = $em->getRepository(UserFilmReference::class)->findOneBy(['tmdbId' => $tmdbId, 'user' => $user]);
            if ($existing) {
                $logger->info('Film déjà ajouté.', ['tmdbId' => $tmdbId, 'user' => $user->getEmail()]);
                return new JsonResponse(['message' => 'Film déjà ajouté'], 200);
            }

            $tmdbMovie = $cache->get("tmdb_movie_$tmdbId", function () use ($tmdbClient, $tmdbId) {
                return $tmdbClient->fetchMovieDetails($tmdbId) ?: [];
            });
            if (!$tmdbMovie || !isset($tmdbMovie['id'])) {
                $logger->warning('Film non trouvé sur TMDB.', ['tmdbId' => $tmdbId]);
                return new JsonResponse(['error' => 'Film non trouvé sur TMDB'], 404);
            }

            $reference = new UserFilmReference();
            $reference->setTmdbId($tmdbId);
            $reference->setUser($user);

            $errors = $validator->validate($reference);
            if (count($errors) > 0) {
                $errorMessages = array_map(fn($error) => $error->getMessage(), iterator_to_array($errors));
                $logger->warning('Erreurs de validation.', ['errors' => $errorMessages]);
                return new JsonResponse(['errors' => $errorMessages], 400);
            }

            $em->persist($reference);
            $em->flush();

            $logger->info('Film ajouté à la liste de l\'utilisateur.', ['tmdbId' => $tmdbId, 'user' => $user->getEmail()]);
            return new JsonResponse(['message' => 'Film ajouté', 'tmdbId' => $tmdbId], 201);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de l\'ajout du film.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur lors de l\'ajout du film'], 500);
        }
    }

    public function getUserFilms(
        EntityManagerInterface $em,
        TMDBClient $tmdbClient,
        LoggerInterface $logger,
        CacheInterface $cache
    ): JsonResponse {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user) {
                $logger->warning('Utilisateur non authentifié.');
                return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
            }

            $references = $em->getRepository(UserFilmReference::class)->findBy(['user' => $user]);
            $films = [];
            foreach ($references as $reference) {
                $tmdbId = $reference->getTmdbId();
                $tmdbMovie = $cache->get("tmdb_movie_$tmdbId", function () use ($tmdbClient, $tmdbId) {
                    return $tmdbClient->fetchMovieDetails($tmdbId) ?: [];
                });

                if ($tmdbMovie && isset($tmdbMovie['id'])) {
                    $films[] = [
                        'tmdbId' => $tmdbMovie['id'],
                        'title' => $tmdbMovie['title'] ?? 'Titre inconnu',
                        'overview' => $tmdbMovie['overview'] ?? '',
                        'posterPath' => $tmdbMovie['poster_path'] ?? null,
                        'releaseDate' => $tmdbMovie['release_date'] ?? null,
                        'note' => $tmdbMovie['vote_average'] ?? 0.0,
                    ];
                }
            }

            usort($films, fn($a, $b) => ($b['releaseDate'] ?? '') <=> ($a['releaseDate'] ?? ''));
            $logger->info('Films de l\'utilisateur récupérés.', ['user' => $user->getEmail(), 'count' => count($films)]);
            return new JsonResponse($films, 200);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des films.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur lors de la récupération des films'], 500);
        }
    }

    public function deleteUserFilm(
        int $tmdbId,
        EntityManagerInterface $em,
        LoggerInterface $logger
    ): JsonResponse {
        try {
            /** @var User|null $user */
            $user = $this->getUser();
            if (!$user) {
                $logger->warning('Utilisateur non authentifié.');
                return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
            }

            $reference = $em->getRepository(UserFilmReference::class)->findOneBy(['tmdbId' => $tmdbId, 'user' => $user]);
            if (!$reference) {
                $logger->warning('Film non trouvé dans la liste de l\'utilisateur.', ['tmdbId' => $tmdbId]);
                return new JsonResponse(['error' => 'Film non trouvé'], 404);
            }

            $em->remove($reference);
            $em->flush();

            $logger->info('Film supprimé de la liste de l\'utilisateur.', ['tmdbId' => $tmdbId, 'user' => $user->getEmail()]);
            return new JsonResponse(['message' => 'Film supprimé avec succès'], 200);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la suppression du film.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur lors de la suppression du film'], 500);
        }
    }
}