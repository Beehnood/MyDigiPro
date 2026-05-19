<?php

// src/Controller/UserController.php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Psr\Log\LoggerInterface;


class UserController extends AbstractController
{
    // List all users (Admin only)
    #[Route('/api/users', name: 'api_users_list', methods: ['GET'])]
    public function listUsers(EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $users = $em->getRepository(User::class)->findAll();
        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles()
            ];
        }

        return $this->json($data);
    }

   #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function getCurrentUser(Request $request, SerializerInterface $serializer, LoggerInterface $logger): JsonResponse
    {
        try {
            // Récupérer l'utilisateur connecté via le système de sécurité de Symfony
            $user = $this->getUser();
            // Sérialiser l'utilisateur avec le groupe de sérialisation 'read:item'
            $data = $serializer->serialize($user, 'json', ['groups' => ['read:item']]);

            return new JsonResponse(json_decode($data), 200);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Authentication error: ' . $e->getMessage()], 401);
        }
    }


    

    // Get a single user by ID (Admin only)
    #[Route('/api/users/{id}', name: 'user_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteUser(User $user, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($user);
        $em->flush();

        return $this->json(['message' => 'Utilisateur supprimé']);
    }

    // Update user details (Authenticated user)
    /**
     * @Route("/api/users/{id}", name="user_update", methods={"PUT"})
     */
    #[Route('/api/users/{id}', name: 'user_update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER', )]
    public function updateUser(
        User $user,
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (isset($data['firstName'])) {
            $user->setFirstName($data['firstName']);
        }
        if (isset($data['lastName'])) {
            $user->setLastName($data['lastName']);
        }
        if (isset($data['country'])) {
            $user->setCountry($data['country']);
        }
        if (isset($data['city'])) {
            $user->setCity($data['city']);
        }
        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }
        if (isset($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $user->setEmail($data['email']);
        } else {
            return $this->json(['error' => 'Adresse e-mail invalide'], 400);
        }
        if (isset($data['password']) && strlen($data['password']) >= 6) {
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        } elseif (isset($data['password'])) {
            return $this->json(['error' => 'Le mot de passe doit contenir au moins 6 caractères'], 400);
        }

        if (isset($data['favoriteMovies'])) {
            $user->setInterests($data['favoriteMovies']);
        }

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Utilisateur mis à jour avec succès !']);
    }


}
