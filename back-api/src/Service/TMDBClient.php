<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class TMDBClient
{
    private $httpClient;
    private $apiKey;
    private $baseUrl;

    public function __construct(HttpClientInterface $httpClient, string $tmdbApiKey, string $tmdbBaseUrl)
    {
        $this->httpClient = $httpClient;
        $this->apiKey = $tmdbApiKey;
        $this->baseUrl = $tmdbBaseUrl;
    }

    public function fetchConfiguration(): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/configuration', [
            'query' => [
                'api_key' => $this->apiKey,
            ],
        ]);

        return $response->toArray();
    }

    public function fetchMovies(): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/discover/movie', [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => 'fr-FR',
                'include_adult' => false,
                'include_video' => false,
                'page' => 1,
                'sort_by' => 'popularity.desc',
            ],
        ]);

        return $response->toArray();
    }

    public function fetchPopularMovies(): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/movie/popular', [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => 'fr-FR',
                'page' => 1,
            ],
        ]);

        return $response->toArray();
    }

    public function fetchMoviesByGenre(int $genreId): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/discover/movie', [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => 'fr-FR',
                'include_adult' => false,
                'include_video' => false,
                'page' => 1,
                'with_genres' => $genreId,
            ],
        ]);

        return $response->toArray();
    }

    public function fetchGenres(): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/genre/movie/list', [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => 'fr-FR',
            ],
        ]);

        return $response->toArray();
    }

    public function fetchMovieDetails(int $id): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/movie/' . $id, [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => 'fr-FR',
            ],
        ]);

        return $response->toArray();
    }

    public function fetchRandomMovie(): array
{
    $page = random_int(1, 20); // Max TMDB: 500
    $response = $this->httpClient->request('GET', $this->baseUrl . '/discover/movie', [
        'query' => [
            'api_key' => $this->apiKey,
            'language' => 'fr-FR',
            'page' => $page,
            'include_adult' => false,
            'sort_by' => 'popularity.desc',
        ],
    ]);

    $movies = $response->toArray();

    if (!isset($movies['results']) || empty($movies['results'])) {
        throw new \RuntimeException('Aucun film trouvé');
    }

    return $movies['results'][array_rand($movies['results'])];
}
}