<?php

namespace App\Controller;

use App\Entity\UserFilmReference;
use App\Service\TMDBClient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserFilmController extends AbstractController
{
    #[Route('/api/user/films', name: 'add_user_film', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function addUserFilm(
        Request $request,
        TMDBClient $tmdbClient,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            if (!isset($data['tmdbId']) || !is_int($data['tmdbId'])) {
                return new JsonResponse(['error' => 'tmdbId doit être un entier valide'], 400);
            }

            $tmdbId = $data['tmdbId'];
            $existing = $em->getRepository(UserFilmReference::class)->findOneBy(['tmdbId' => $tmdbId, 'user' => $this->getUser()]);
            if ($existing) {
                return new JsonResponse(['message' => 'Film déjà ajouté'], 200);
            }

            // Vérifier que le film existe sur TMDB
            $tmdbMovie = $tmdbClient->fetchMovieDetails($tmdbId);
            if (!$tmdbMovie || !isset($tmdbMovie['id'])) {
                return new JsonResponse(['error' => 'Film non trouvé sur TMDB'], 404);
            }

            $reference = new UserFilmReference();
            $reference->setTmdbId($tmdbId);
            $reference->setUser($this->getUser());

            $errors = $validator->validate($reference);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return new JsonResponse(['errors' => $errorMessages], 400);
            }

            $em->persist($reference);
            $em->flush();

            return new JsonResponse(['message' => 'Film ajouté', 'tmdbId' => $tmdbId], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur serveur : ' . $e->getMessage()], 500);
        }
    }

    #[Route('/api/user/films', name: 'get_user_films', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getUserFilms(EntityManagerInterface $em, TMDBClient $tmdbClient): JsonResponse
    {
        try {
            $user = $this->getUser();
            if (!$user) {
                return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
            }

            $references = $em->getRepository(UserFilmReference::class)->findBy(['user' => $user]);
            $films = [];
            foreach ($references as $reference) {
                $tmdbMovie = $tmdbClient->fetchMovieDetails($reference->getTmdbId());
                if ($tmdbMovie && isset($tmdbMovie['id'])) {
                    $films[] = [
                        'tmdbId' => $tmdbMovie['id'],
                        'title' => $tmdbMovie['title'] ?? 'Titre inconnu',
                        'overview' => $tmdbMovie['overview'] ?? '',
                        'posterPath' => $tmdbMovie['poster_path'] ?? null,
                        'releaseDate' => $tmdbMovie['release_date'] ?? null,
                        'noteMoyenne' => $tmdbMovie['vote_average'] ?? 0.0,
                    ];
                }
            }

            // Trier par date de sortie
            usort($films, function ($a, $b) {
                return ($b['releaseDate'] ?? '') <=> ($a['releaseDate'] ?? '');
            });

            return new JsonResponse($films, 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur serveur : ' . $e->getMessage()], 500);
        }
    }
}