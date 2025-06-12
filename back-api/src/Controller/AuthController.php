<?php


// src/Controller/ApiLoginController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        // Cette méthode peut être vide si vous utilisez `json_login`
        // Le vrai travail est fait par le système de sécurité
        return $this->json([
            'message' => 'Utilisez /api/login avec email et mot de passe en JSON',
        ]);
    }
}

