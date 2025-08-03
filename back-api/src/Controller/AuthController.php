<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST', 'OPTIONS'])]
    public function login(
        Request $request,
        JWTTokenManagerInterface $jwtManager,
        RateLimiterFactory $loginLimiter
    ): JsonResponse {
        $limiter = $loginLimiter->create($request->getClientIp());

        if (!$limiter->consume(1)->isAccepted()) {
            throw new TooManyRequestsHttpException('Trop de tentatives. Réessayez plus tard.');
        }

        $user = $this->getUser();
        if (!$user instanceof UserInterface) {
            return new JsonResponse(['error' => 'Identifiants incorrects'], 401);
        }

        $token = $jwtManager->create($user);
        return new JsonResponse(['token' => $token]);
    }

    
    #[Route('/api/register', name: 'api_register', methods: ['POST', 'OPTIONS'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['email'], $data['password'], $data['username'], $data['firstName'], $data['lastName'], $data['country'], $data['city'])) {
            return new JsonResponse(['error' => 'Données manquantes'], 400);
        }

        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Cet email est déjà utilisé'], 400);
        }
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['username' => $data['username']]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Ce nom d’utilisateur est déjà pris'], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setCountry($data['country']);
        $user->setCity($data['city']);
        $user->setInterests($data['interests'] ?? null);
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        $user->setRoles(['ROLE_USER']);

        try {
            $entityManager->persist($user);
            $entityManager->flush();
            return new JsonResponse(['message' => 'Utilisateur créé avec succès'], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de l\'inscription : ' . $e->getMessage()], 500);
        }
    }
}