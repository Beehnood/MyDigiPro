<?php

namespace App\Controller;

use App\Service\TMDBClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class TMDBController extends AbstractController
{
    #[Route('/api/tmdb/config', name: 'api_tmdb_config', methods: ['GET'])]
    public function getTmdbConfig(TMDBClient $tmdbClient): JsonResponse
    {
        try {
            $config = $tmdbClient->fetchConfiguration();
            return $this->json($config);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}