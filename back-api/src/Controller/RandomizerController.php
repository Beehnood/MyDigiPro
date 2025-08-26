<?php

namespace App\Controller;

use App\Entity\RandomizerLog;
use App\Service\TMDBClient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RandomizerController extends AbstractController
{
    #[Route('/api/randomize', name: 'api_randomize', methods: ['GET'])]
    public function randomizeById(
        TMDBClient $tmdbClient,
        Security $security,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], Response::HTTP_UNAUTHORIZED);
        }

        // Définir les bornes du jour
        $todayStart = (new \DateTime())->setTime(0, 0, 0);
        $todayEnd   = (new \DateTime())->setTime(23, 59, 59);

        // Compter les tirages de l'utilisateur aujourd'hui
        $qb = $em->getRepository(RandomizerLog::class)->createQueryBuilder('r');
        $count = $qb
            ->select('COUNT(r.id)')
            ->where('r.user = :user')
            ->andWhere('r.createdAt BETWEEN :start AND :end')
            ->setParameter('user', $user)
            ->setParameter('start', $todayStart)
            ->setParameter('end', $todayEnd)
            ->getQuery()
            ->getSingleScalarResult();

        if ($count >= 3) {
            return new JsonResponse(
                ['error' => 'Quota dépassé (3 essais/jour)'],
                Response::HTTP_FORBIDDEN
            );
        }

        try {
            $movie = $tmdbClient->fetchRandomMovie();

            // Sauvegarde du tirage en base
            $log = new RandomizerLog();
            $log->setUser($user);
            $em->persist($log);
            $em->flush();

            return new JsonResponse([
                'id' => $movie['id'],
                'title' => $movie['title'],
                'poster_path' => $movie['poster_path']
                    ? 'https://image.tmdb.org/t/p/w200' . $movie['poster_path']
                    : null,
                'overview' => $movie['overview'],
                'vote_average' => $movie['vote_average'],
                'release_date' => $movie['release_date'],
                'tries_left' => 3 - ($count + 1)
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Erreur TMDB: ' . $e->getMessage()],
                Response::HTTP_SERVICE_UNAVAILABLE
            );
        }
    }
}
