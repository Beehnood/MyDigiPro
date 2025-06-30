<?php

// src/Controller/RandomizerController.php

// src/Controller/RandomizerController.php

namespace App\Controller;

use App\Service\TMDBClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security as SecurityBundleSecurity;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;

class RandomizerController extends AbstractController
{
    #[Route('/api/randomize', name: 'api_randomize', methods: ['POST'])]
    public function randomize(
        TMDBClient $tmdbClient,
       SecurityBundleSecurity $security
    ): JsonResponse {
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        // Simuler quota Freemium (ex: tirer depuis session ou token usage ?)
        // Pour ce MVP on n’utilise pas encore d’entité log -> à faire plus tard
        // Tu peux juste retourner 403 si l’utilisateur a dépassé 3 fois/jour (à implémenter côté front pour le moment)

        $movie = $tmdbClient->fetchRandomMovie();

        return new JsonResponse($movie);
    }

}
