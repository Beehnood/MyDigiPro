<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpFoundation\Request;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST', 'OPTIONS'])]
public function login(Request $request, JWTTokenManagerInterface $jwtManager): JsonResponse
{
    if ($request->getMethod() === 'OPTIONS') {
        return new JsonResponse(null, 204);
    }
    $user = $this->getUser();
    if (!$user instanceof UserInterface) {
        return new JsonResponse(['error' => 'Identifiants incorrects'], 401);
    }
    $token = $jwtManager->create($user);
    return new JsonResponse(['token' => $token]);
}

}