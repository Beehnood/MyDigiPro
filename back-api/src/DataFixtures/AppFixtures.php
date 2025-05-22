<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Subscription;
use App\Entity\UserSubscription;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $subscriptions = [];

        // Crée 2 abonnements
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

        // Crée 10 utilisateurs avec un historique d'abonnement
        for ($i = 0; $i < 10; $i++) {
            $user = new User();
            $user->setFirstName($faker->firstName);
            $user->setLastName($faker->lastName);
            $user->setEmail($faker->unique()->email);
            $user->setUsername($faker->unique()->userName);
            $user->setPassword('password'); // À encoder dans un vrai contexte
            $user->setCountry($faker->country);
            $user->setCity($faker->city);
            $user->setPoints($faker->numberBetween(0, 1000));
            $user->setIsPremium($faker->boolean);
            $user->setCreatedAt(new \DateTimeImmutable());
            $user->setUpdatedAt(new \DateTimeImmutable());

            // Abonnement actif (ex: commence aujourd'hui, fini dans 30 jours)
            $activeSubscription = new UserSubscription();
            $activeSubscription->setUser($user);
            $subscription = $faker->randomElement($subscriptions);
            $activeSubscription->setSubscription($subscription);
            $activeSubscription->setStartedAt(new \DateTimeImmutable());
            $activeSubscription->setEndedAt((new \DateTimeImmutable())->modify("+{$subscription->getDurationInDays()} days"));

            $user->setSubscription($activeSubscription); // méthode setSubscription attend un UserSubscription

            $manager->persist($activeSubscription);

            // Historique d’abonnement
            $nbOldSubscriptions = $faker->numberBetween(0, 2);
            for ($j = 0; $j < $nbOldSubscriptions; $j++) {
                $pastSubscription = new UserSubscription();
                $pastSubscription->setUser($user);
                $pastSubscription->setSubscription($faker->randomElement($subscriptions));
                $started = $faker->dateTimeBetween('-2 years', '-1 month');
                $ended = (clone $started)->modify('+30 days');
                $pastSubscription->setStartedAt($started);
                $pastSubscription->setEndedAt($ended);

                $manager->persist($pastSubscription);
            }

            $manager->persist($user);
        }

        $manager->flush();
    }
}
