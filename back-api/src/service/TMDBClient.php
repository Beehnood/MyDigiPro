<?php


namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class TMDBClient
{
    private string $apiKey;
    private string $baseUrl;
    private HttpClientInterface $httpClient;

    public function __construct(HttpClientInterface $httpClient, string $tmdbApiKey, string $tmdbBaseUrl)
    {
        $this->httpClient = $httpClient;
        $this->apiKey = $tmdbApiKey;
        $this->baseUrl = rtrim($tmdbBaseUrl, '/');
    }

    public function fetchPopularMovies(int $page = 1): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/movie/popular', [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => 'fr-FR',
                'page' => $page,
            ]
        ]);

        return $response->toArray();
    }

    public function fetchMovieDetails(int $tmdbId): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/movie/' . $tmdbId, [
            'query' => [
                'api_key' => $this->apiKey,
                'language' => 'fr-FR',
            ]
        ]);

        return $response->toArray();
    }
}
