<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\Security; 
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class AdminController extends AbstractController
{
    #[Route('/api/admin/secret', name: 'admin_secret', methods: ['GET'])]
    #[IsGranted('ROLE_SUPER_ADMIN')]
    public function secretRoute(): JsonResponse
    {
        
        // dd($this);
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }

        return $this->json([
            'message' => 'Bienvenue, admin ! 🎉',
            'user' => $user->getUserIdentifier(),
            'roles' => $user->getRoles(),
        ]);
    }


}