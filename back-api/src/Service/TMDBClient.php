<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\Exception\HttpExceptionInterface;

class TMDBClient
{
    
    private $tmdbApiKey;
    private $tmdbBaseUrl;
    private string $apiKey;
    private string $baseUrl;
    private HttpClientInterface $httpClient;

    public function __construct(HttpClientInterface $httpClient, string $tmdbApiKey, string $tmdbBaseUrl)
    {
        $this->httpClient = $httpClient;
        $this->apiKey = $tmdbApiKey;
        $this->baseUrl = rtrim($tmdbBaseUrl, '/');
    }

    public function fetchPopularMovies(): array
{
    $url = sprintf(
        // '%s/movie/popular?api_key=%s&language=fr-FR&page=1&include_adult=false&include_video=false',
'https://api.themoviedb.org/3/movie/popular?api_key=86533c13f5646bdeb5295938d02a5d82&language=fr-FR&page=1&include_adult=false&include_video=false',        
rtrim($this->tmdbBaseUrl, '/'),
        $this->tmdbApiKey
    );
    $response = $this->httpClient->request('GET', $url);
    return $response->toArray();
}


    public function fetchMovies(int $page = 1): array
    {
        try {
            $response = $this->httpClient->request('GET', $this->baseUrl . '/discover/movie', [
                'query' => [
                    'api_key' => $this->apiKey,
                    'language' => 'fr-FR',
                    'page' => $page,
                    'include_adult' => 'false',
                    'include_video' => 'false',
                    'sort_by' => 'popularity.desc',
                ]
            ]);

            return $response->toArray();
        } catch (HttpExceptionInterface $e) {
            throw new \RuntimeException('Erreur lors de la récupération des films depuis TMDB: ' . $e->getMessage(), $e->getCode(), $e);
        } catch (\Exception $e) {
            throw new \RuntimeException('Erreur inattendue lors de la récupération des films: ' . $e->getMessage(), 500, $e);
        }
    }

    public function fetchMovieDetails(int $tmdbId): array
    {
        try {
            $response = $this->httpClient->request('GET', $this->baseUrl . '/movie/' . $tmdbId, [
                'query' => [
                    'api_key' => $this->apiKey,
                    'language' => 'fr-FR',
                ]
            ]);

            return $response->toArray();
        } catch (HttpExceptionInterface $e) {
            throw new \RuntimeException('Erreur lors de la récupération des détails du film depuis TMDB: ' . $e->getMessage(), $e->getCode(), $e);
        } catch (\Exception $e) {
            throw new \RuntimeException('Erreur inattendue lors de la récupération des détails du film: ' . $e->getMessage(), 500, $e);
        }
    }
}