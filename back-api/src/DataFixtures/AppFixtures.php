<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Subscription;
use App\Entity\UserSubscription;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $subscriptions = [];

        foreach (['Basic', 'Premium'] as $name) {
            $subscription = new Subscription();
            $subscription->setName($name);
            $subscription->setPrice($faker->randomFloat(2, 5, 50));
            $subscription->setDurationInDays($faker->randomElement([30, 90, 180]));
            $subscription->setCreatedAt(new \DateTimeImmutable());
            $subscription->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($subscription);
            $subscriptions[] = $subscription;
        }

        for ($i = 0; $i < 10; $i++) {
            $user = new User();
            $user->setFirstName($faker->firstName);
            $user->setLastName($faker->lastName);
            $user->setEmail("user$i@example.com");
            $user->setUsername($faker->unique()->userName);



            // Hash du mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, 'password123');
            $user->setPassword($hashedPassword);

            // 👇 AJOUT DES RÔLES
            if ($i === 0) {
                $user->setEmail('admin@example.com');
                $user->setRoles(['ROLE_SUPER_ADMIN']);
            } else {
                $user->setEmail("user$i@example.com");
                $user->setRoles(['ROLE_USER']);
            }

            $user->setCountry($faker->country);
            $user->setCity($faker->city);
            $user->setPoints($faker->numberBetween(0, 1000));
            $user->setIsPremium($faker->boolean);
            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setUpdatedAt(new \DateTimeImmutable());

            // Abonnement actif
            $activeSubscription = new UserSubscription();
            $activeSubscription->setUser($user);
            $subscription = $faker->randomElement($subscriptions);
            $activeSubscription->setSubscription($subscription);
            $activeSubscription->setStartedAt(new \DateTimeImmutable());
            $activeSubscription->setEndedAt((new \DateTimeImmutable())->modify("+{$subscription->getDurationInDays()} days"));

            $user->setSubscription($activeSubscription);
            $manager->persist($activeSubscription);

            // Abonnements passés
            for ($j = 0; $j < $faker->numberBetween(0, 2); $j++) {
                $past = new UserSubscription();
                $past->setUser($user);
                $past->setSubscription($faker->randomElement($subscriptions));
                $started = $faker->dateTimeBetween('-2 years', '-1 month');
                $ended = (clone $started)->modify('+30 days');
                $past->setStartedAt($started);
                $past->setEndedAt($ended);
                $manager->persist($past);
            }

            $manager->persist($user);
        }

        $manager->flush();
    }
}
