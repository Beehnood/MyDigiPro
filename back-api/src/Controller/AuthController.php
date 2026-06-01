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
        if (!is_array($data)) {
            return new JsonResponse(['error' => 'Le formulaire envoyé est invalide. Vérifiez les informations saisies.'], 400);
        }

        $requiredFields = [
            'email' => 'adresse e-mail',
            'password' => 'mot de passe',
            'username' => 'nom d’utilisateur',
            'firstName' => 'prénom',
            'lastName' => 'nom',
            'country' => 'pays',
            'city' => 'ville',
        ];

        foreach ($requiredFields as $field => $label) {
            if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
                return new JsonResponse(['error' => sprintf('Le champ "%s" est obligatoire.', $label)], 400);
            }
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['error' => 'Adresse e-mail invalide. Exemple attendu : nom@example.com.'], 400);
        }

        $passwordError = $this->validatePassword((string) $data['password']);
        if ($passwordError !== null) {
            return new JsonResponse(['error' => $passwordError], 400);
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
        $interests = $data['interests'] ?? null;
        if (is_array($interests)) {
            $interests = implode(',', array_filter($interests, static fn ($interest) => $interest !== ''));
        }
        $user->setInterests($interests ?: null);
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

    private function validatePassword(string $password): ?string
    {
        if (strlen($password) < 8) {
            return 'Le mot de passe doit contenir au moins 8 caractères.';
        }

        if (!preg_match('/[a-z]/', $password)) {
            return 'Le mot de passe doit contenir au moins une lettre minuscule.';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            return 'Le mot de passe doit contenir au moins une lettre majuscule.';
        }

        if (!preg_match('/\d/', $password)) {
            return 'Le mot de passe doit contenir au moins un chiffre.';
        }

        return null;
    }

}
