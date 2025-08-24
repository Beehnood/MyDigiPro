<?php

// src/Controller/RandomizerController.php

// src/Controller/RandomizerController.php

namespace App\Controller;

use App\Service\TMDBClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Routing\Annotation\Route;

class RandomizerController extends AbstractController
{
    #[Route('/api/randomize', name: 'api_randomize', methods: ['GET'])]
    public function randomizeById(
        TMDBClient $tmdbClient,
        Security $security,
        Request $request
    ): JsonResponse {
        // $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $session = $request->getSession();
        $today = (new \DateTime())->format('Y-m-d');

        $lastTryDate = $session->get('randomize_last_date');
        $tries = $session->get('randomize_tries', 0);

        if ($lastTryDate !== $today) {
            $tries = 0;
            $session->set('randomize_last_date', $today);
            $session->set('randomize_tries', 0);
        }

        if ($tries >= 3) {
            return new JsonResponse(
                ['error' => 'Quota dépassé (3 essais/jour)'],
                Response::HTTP_FORBIDDEN
            );
        }

        try {
            $movie = $tmdbClient->fetchRandomMovie();
            // dd($movie);
            $session->set('randomize_tries', $tries + 1);


            return new JsonResponse([
                'id' => $movie['id'],
                'title' => $movie['title'],
                'poster_path' => $movie['poster_path']
                    ? 'https://image.tmdb.org/t/p/w200' . $movie['poster_path']
                    : null,
                'overview' => $movie['overview'],
                'vote_average' => $movie['vote_average'],
                'release_date' => $movie['release_date'],
                'tries_left' => 2 - $tries
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Erreur TMDB: ' . $e->getMessage()],
                Response::HTTP_SERVICE_UNAVAILABLE
            );
        }
    }
}
