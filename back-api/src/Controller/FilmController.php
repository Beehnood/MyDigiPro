<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use App\Service\TMDBClient;

class FilmController extends AbstractController
{
    #[Route('/api/movies/popular', name: 'movies_popular', methods: ['GET'])]
    public function getPopularMovies(TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $tmdbMovies = $tmdbClient->fetchPopularMovies();
            $logger->info('Films populaires récupérés depuis TMDB.', ['count' => count($tmdbMovies['results'])]);
            $movies = array_map(function ($movie) {
                return [
                    'tmdbId' => $movie['id'],
                    'title' => $movie['title'],
                    'overview' => $movie['overview'] ?? '',
                    'posterPath' => $movie['poster_path'] ?? null,
                    'releaseDate' => $movie['release_date'] ?? null,
                    'genres' => $movie['genre_ids'] ?? [],
                    'voteAverage' => $movie['vote_average'] ?? 0.0,
                ];
            }, $tmdbMovies['results']);
            return new JsonResponse($movies);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des films populaires.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur lors de la récupération des films'], 500);
        }
    }

    #[Route('/api/movies/list', name: 'movies_list', methods: ['GET'])]
    public function getMovies(TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $tmdbMovies = $tmdbClient->fetchMovies();
            $logger->info('Films récupérés depuis TMDB.', ['count' => count($tmdbMovies['results'])]);
            $movies = array_map(function ($movie) {
                return [
                    'tmdbId' => $movie['id'],
                    'title' => $movie['title'],
                    'overview' => $movie['overview'] ?? '',
                    'posterPath' => $movie['poster_path'] ?? null,
                    'releaseDate' => $movie['release_date'] ?? null,
                    'genres' => $movie['genre_ids'] ?? [],
                    'voteAverage' => $movie['vote_average'] ?? 0.0,
                ];
            }, $tmdbMovies['results']);
            return new JsonResponse($movies);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des films.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur lors de la récupération des films'], 500);
        }
    }

    #[Route('/api/movies/by-genre/{genreId}', name: 'movies_by_genre', methods: ['GET'])]
    public function getMoviesByGenre(int $genreId, TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $tmdbMovies = $tmdbClient->fetchMoviesByGenre($genreId);
            $genresList = $tmdbClient->fetchGenres();
            $genreMap = [];
            foreach ($genresList['genres'] ?? [] as $genre) {
                $genreMap[$genre['id']] = $genre['name'];
            }

            $movies = array_map(function ($movie) use ($genreMap) {
                return [
                    'tmdbId' => $movie['id'],
                    'title' => $movie['title'],
                    'overview' => $movie['overview'] ?? '',
                    'posterPath' => $movie['poster_path'] ?? null,
                    'releaseDate' => $movie['release_date'] ?? null,
                    'genres' => array_map(fn($gid) => ['id' => $gid, 'name' => $genreMap[$gid] ?? 'Unknown'], $movie['genre_ids'] ?? []),
                    'voteAverage' => $movie['vote_average'] ?? 0.0,
                ];
            }, $tmdbMovies['results'] ?? []);

            $logger->info('Films récupérés par genre depuis TMDB.', ['genreId' => $genreId, 'count' => count($movies)]);
            return new JsonResponse($movies);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des films par genre.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur serveur'], 500);
        }
    }

    #[Route('/api/movies/genres', name: 'movies_genres', methods: ['GET'])]
    public function getGenres(TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $genresList = $tmdbClient->fetchGenres();
            $genres = array_map(function ($genre) {
                return [
                    'id' => $genre['id'],
                    'name' => $genre['name'],
                ];
            }, $genresList['genres'] ?? []);

            $logger->info('Genres récupérés depuis TMDB.', ['count' => count($genres)]);
            return new JsonResponse($genres);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des genres.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur serveur'], 500);
        }
    }

    #[Route('/api/movies/details/{id}', name: 'get_movie', methods: ['GET'])]
    public function getMovie(int $id, TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $tmdbMovie = $tmdbClient->fetchMovieDetails($id);
            if (!$tmdbMovie || !isset($tmdbMovie['id'])) {
                return new JsonResponse(['error' => 'Film non trouvé sur TMDB'], 404);
            }

            $logger->info('Film récupéré depuis TMDB.', ['tmdbId' => $tmdbMovie['id']]);
            return new JsonResponse([
                'tmdbId' => $tmdbMovie['id'],
                'title' => $tmdbMovie['title'],
                'overview' => $tmdbMovie['overview'] ?? '',
                'posterPath' => $tmdbMovie['poster_path'] ?? null,
                'releaseDate' => $tmdbMovie['release_date'] ?? null,
                'genres' => array_map(fn($genre) => $genre['id'], $tmdbMovie['genres'] ?? []),
                'voteAverage' => $tmdbMovie['vote_average'] ?? 0.0,
            ]);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération du film.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur lors de la récupération du film'], 500);
        }
    }

    #[Route('/api/movies/{id}', name: 'get_movie', methods: ['GET'])]
    public function getMovieId(int $id, TMDBClient $tmdbClient, LoggerInterface $logger): JsonResponse
    {
        try {
            $tmdbMovie = $tmdbClient->fetchMovieDetails($id);
            if (!$tmdbMovie || !isset($tmdbMovie['id'])) {
                return new JsonResponse(['error' => 'Film non trouvé sur TMDB'], 404);
            }

            $logger->info('Film récupéré depuis TMDB.', ['tmdbId' => $tmdbMovie['id']]);
            return new JsonResponse([
                'tmdbId' => $tmdbMovie['id'],
                'title' => $tmdbMovie['title'],
                'overview' => $tmdbMovie['overview'] ?? '',
                'posterPath' => $tmdbMovie['poster_path'] ?? null,
                'releaseDate' => $tmdbMovie['release_date'] ?? null,
                'genres' => array_map(fn($genre) => $genre['id'], $tmdbMovie['genres'] ?? []),
                'voteAverage' => $tmdbMovie['vote_average'] ?? 0.0,
            ]);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération du film.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return new JsonResponse(['error' => 'Erreur lors de la récupération du film'], 500);
        }
    }


    #[Route('/api/test', name: 'test_endpoint', methods: ['GET'])]
    public function test(): JsonResponse
    {
        return new JsonResponse(['message' => 'Test endpoint works!']);
    }
}