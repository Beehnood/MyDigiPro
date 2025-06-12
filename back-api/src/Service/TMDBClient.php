<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\Exception\HttpExceptionInterface;

class TMDBClient
{
    private const DEFAULT_LANGUAGE = 'fr-FR';
    private const DEFAULT_INCLUDE_ADULT = false;
    private const DEFAULT_INCLUDE_VIDEO = false;
    private const DEFAULT_SORT_BY = 'popularity.desc';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly string $apiKey,
        private readonly string $baseUrl,
    ) {}

    public function fetchPopularMovies(int $page = 1): array
    {
        return $this->makeRequest('/movie/popular', [
            'page' => max(1, $page),
        ]);
    }

    public function fetchMovies(int $page = 1): array
    {
        return $this->makeRequest('/discover/movie', [
            'page' => max(1, $page),
        ]);
    }

    public function fetchMovieDetails(int $tmdbId): array
    {
        if ($tmdbId <= 0) {
            throw new \InvalidArgumentException('L\'ID TMDB doit être un entier positif.');
        }

        return $this->makeRequest(sprintf('/movie/%d', $tmdbId));
    }

    public function fetchMovieById(int $tmdbId): array
    {
        return $this->fetchMovieDetails($tmdbId);
    }

    public function fetchGenres(): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/genre/movie/list', [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => self::DEFAULT_LANGUAGE,
            ]
        ]);

        return $response->toArray()['genres'] ?? [];
    }

    private function makeRequest(string $endpoint, array $query = []): array
    {
        try {
            $response = $this->httpClient->request('GET', $this->baseUrl . $endpoint, [
                'query' => array_merge([
                    'api_key' => $this->apiKey,
                    'language' => self::DEFAULT_LANGUAGE,
                    'include_adult' => self::DEFAULT_INCLUDE_ADULT,
                    'include_video' => self::DEFAULT_INCLUDE_VIDEO,
                ], $query)
            ]);

            return $response->toArray();
        } catch (HttpExceptionInterface $e) {
            throw new \RuntimeException("Erreur TMDB ($endpoint) : " . $e->getMessage(), $e->getCode(), $e);
        } catch (\Exception $e) {
            throw new \RuntimeException("Erreur inattendue TMDB ($endpoint) : " . $e->getMessage(), 500, $e);
        }
    }
}
