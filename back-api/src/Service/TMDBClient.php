<?php

<<<<<<< HEAD
declare(strict_types=1);

=======
>>>>>>> 3eaf7263c3f02f26cf17187fcfacae450847db8d
namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\Exception\HttpExceptionInterface;

class TMDBClient
{
<<<<<<< HEAD
    private const DEFAULT_LANGUAGE = 'fr-FR';
    private const DEFAULT_INCLUDE_ADULT = false;
    private const DEFAULT_INCLUDE_VIDEO = false;
    private const DEFAULT_SORT_BY = 'popularity.desc';
=======
    
    private $tmdbApiKey;
    private $tmdbBaseUrl;
    private string $apiKey;
    private string $baseUrl;
    private HttpClientInterface $httpClient;
>>>>>>> 3eaf7263c3f02f26cf17187fcfacae450847db8d

    private string $baseUrl;

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly string $apiKey,
        string $baseUrl

    ) {
        $this->baseUrl = rtrim($baseUrl, '/');
    }

<<<<<<< HEAD
    /**
     * Récupère une liste de films populaires depuis TMDB.
     *
     * @param int $page Numéro de la page (par défaut: 1)
     * @return array Données des films populaires
     * @throws \RuntimeException En cas d'erreur API ou réseau
     */
    public function fetchPopularMovies(int $page = 1): array
    {
        return $this->makeRequest('/movie/popular', [
            'page' => max(1, $page),
        ]);
=======
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
>>>>>>> 3eaf7263c3f02f26cf17187fcfacae450847db8d
    }

    /**
     * Récupère une liste de films depuis TMDB via l'endpoint discover.
     *
     * @param int $page Numéro de la page (par défaut: 1)
     * @return array Données des films
     * @throws \RuntimeException En cas d'erreur API ou réseau
     */
    public function fetchMovies(int $page = 1): array
    {
        return $this->makeRequest('/discover/movie', [
            'page' => max(1, $page),
        ]);
    }

    /**
     * Récupère les détails d'un film spécifique par son ID TMDB.
     *
     * @param int $tmdbId ID TMDB du film
     * @return array Données du film
     * @throws \RuntimeException En cas d'erreur API ou réseau
     */
    public function fetchMovieDetails(int $tmdbId): array
    {
<<<<<<< HEAD
        if ($tmdbId <= 0) {
            throw new \InvalidArgumentException('L\'ID TMDB doit être un entier positif.');
        }

        $data = $this->makeRequest(sprintf('/movie/%d', $tmdbId));

        if (!isset($data['id']) || $data['id'] !== $tmdbId) {
            throw new \RuntimeException(sprintf('Film avec l\'ID TMDB %d non trouvé.', $tmdbId));
        }

        return $data;
    }

    /**
     * Alias pour fetchMovieDetails (pour compatibilité avec la commande).
     *
     * @param int $tmdbId ID TMDB du film
     * @return array Données du film
     */
    public function fetchMovieById(int $tmdbId): array
    {
        return $this->fetchMovieDetails($tmdbId);
    }

    /**
     * Récupère la configuration générale de l'API TMDB.
     *
     * @return array Données de configuration
     * @throws \RuntimeException En cas d'erreur API ou réseau
     */
    public function fetchConfiguration(): array
    {
        return $this->makeRequest('/configuration');
    }


    /**
     * Récupère la liste des genres de films depuis TMDB.
     *
     * @return array Liste des genres
     * @throws \RuntimeException En cas d'erreur API ou réseau
     */

    public function fetchGenres(): array
    {
        $response = $this->httpClient->request('GET', $this->baseUrl . '/genre/movie/list', [
            'query' => [
                'api_key' => $this->apiKey,
                'include_adult' => self::DEFAULT_INCLUDE_ADULT,
                'base_url' => $this->baseUrl,
                'language' => 'fr-FR',
            ]
        ]);

        return $response->toArray()['genres'];
    }


    /**
     * Effectue une requête GET vers l'API TMDB.
     *
     * @param string $endpoint Endpoint de l'API (ex. /movie/popular)
     * @param array $query Paramètres de requête supplémentaires
     * @return array Réponse décodée
     * @throws \RuntimeException En cas d'erreur
     */
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

            $data = $response->toArray();

            if (isset($data['status_code']) && $data['status_code'] !== 1) {
                throw new \RuntimeException(
                    $data['status_message'] ?? sprintf('Erreur API TMDB pour %s', $endpoint),
                    $data['status_code'] ?? 500
                );
            }

            return $data;
        } catch (HttpExceptionInterface $e) {
            throw new \RuntimeException(
                sprintf('Erreur lors de la requête TMDB (%s): %s', $endpoint, $e->getMessage()),
                $e->getCode(),
                $e
            );
        } catch (\Exception $e) {
            throw new \RuntimeException(
                sprintf('Erreur inattendue lors de la requête TMDB (%s): %s', $endpoint, $e->getMessage()),
                500,
                $e
            );
        }
    }
=======
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
>>>>>>> 3eaf7263c3f02f26cf17187fcfacae450847db8d
}