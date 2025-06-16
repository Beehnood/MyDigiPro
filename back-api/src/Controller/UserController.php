<?php

// src/Controller/UserController.php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Psr\Log\LoggerInterface;


class UserController extends AbstractController
{
    // Register a new user
    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     */
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setFirstName($data['firstName'] ?? '');
        $user->setLastName($data['lastName'] ?? '');
        $user->setCountry($data['country'] ?? '');
        $user->setCity($data['city'] ?? '');
        $user->setUsername($data['username'] ?? '');
        if (!filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Adresse e-mail invalide'], 400);
        }
        $user->setEmail($data['email'] ?? '');
        $user->setRoles(['ROLE_USER']);
        if (empty($data['password']) || strlen($data['password']) < 6) {
            return $this->json(['error' => 'Le mot de passe doit contenir au moins 6 caractères'], 400);
        }
        $user->setPassword($passwordHasher->hashPassword($user, $data['password'] ?? ''));
        $user->setFavoriteMovies($data['favoriteMovies'] ?? null);

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            return $this->json(['error' => (string) $errors], 400);
        }

        // Check if user already exists
        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $data['email'] && $data['username']]);
        if ($existingUser) {
            return $this->json(['error' => 'User is already exist.'], 409);

        }

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Utilisateur créé avec succès !']);
    }



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
            $user->setFavoriteMovies($data['favoriteMovies']);
        }

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Utilisateur mis à jour avec succès !']);
    }


}
