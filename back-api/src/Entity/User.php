<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\{Get, GetCollection, Post, Put, Delete};
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['read:collection']],
    denormalizationContext: ['groups' => ['write:item']],
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Put(),
        new Delete()
    ]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:collection'])]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['read:collection', 'write:item'])]
    private string $lastName;

    #[ORM\Column(length: 50)]
    #[Groups(['read:collection', 'write:item'])]
    private string $firstName;

    #[ORM\Column(length: 100, unique: true)]
    #[Groups(['read:collection', 'write:item'])]
    private string $email;

    #[ORM\Column(length: 50)]
    #[Groups(['read:collection', 'write:item'])]
    private string $country;

    #[ORM\Column(length: 50)]
    #[Groups(['read:collection', 'write:item'])]
    private string $city;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['read:collection', 'write:item'])]
    private string $username;

    #[ORM\Column(length: 100)]
    #[Groups(['write:item'])] // mot de passe non exposé en lecture
    private string $password;

    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['read:collection', 'write:item'])]
    private int $points = 0;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups(['read:collection', 'write:item'])]
    private bool $isPremium = false;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['read:collection', 'write:item'])]
    private ?string $favoriteMovies = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['read:collection'])]
    private \DateTimeInterface $createdAt;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['read:collection'])]
    private \DateTimeInterface $updatedAt;

    #[ORM\Column(type: 'json')]
    #[Groups(['read:collection'])]
    private array $roles = [];

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: UserSubscription::class, cascade: ['persist', 'remove'])]
    #[Groups(['read:collection'])]
    private Collection $subscriptions;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
        $this->roles = ['ROLE_USER'];
        $this->subscriptions = new ArrayCollection();
    }
    public function getCurrentSubscription(): ?UserSubscription
{
    foreach ($this->subscriptions as $subscription) {
        if ($subscription->isActive()) {
            return $subscription;
        }
    }
    return null;
}


    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTime();
    }

    // Getters / Setters

    public function getId(): ?int { return $this->id; }

    public function getLastName(): string { return $this->lastName; }
    public function setLastName(string $lastName): static { $this->lastName = $lastName; return $this; }

    public function getFirstName(): string { return $this->firstName; }
    public function setFirstName(string $firstName): static { $this->firstName = $firstName; return $this; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }

    public function getCountry(): string { return $this->country; }
    public function setCountry(string $country): static { $this->country = $country; return $this; }

    public function getCity(): string { return $this->city; }
    public function setCity(string $city): static { $this->city = $city; return $this; }

    public function getUsername(): string { return $this->username; }
    public function setUsername(string $username): static { $this->username = $username; return $this; }

    public function getPassword(): string { return $this->password; }
    public function setPassword(string $password): static { $this->password = $password; return $this; }

    public function getPoints(): int { return $this->points; }
    public function setPoints(int $points): static { $this->points = $points; return $this; }
    public function isPremium(): bool { return $this->isPremium; }
    public function setIsPremium(bool $isPremium): static { $this->isPremium = $isPremium; return $this; }
    public function addPoints(int $points): static
    {
        $this->points += $points;
        return $this;
    }
    public function removePoints(int $points): static
    {
        $this->points -= $points;
        return $this;
    }

    public function getRoles(): array { return array_unique([...$this->roles, 'ROLE_USER']); }
    public function setRoles(array $roles): static { $this->roles = $roles; return $this; }

    public function getUserIdentifier(): string { return $this->email; }
    public function eraseCredentials(): void {}

    public function getFavoriteMovies(): ?string { return $this->favoriteMovies; }
    public function setFavoriteMovies(?string $favoriteMovies): static { $this->favoriteMovies = $favoriteMovies; return $this; }

    public function getCreatedAt(): \DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): static { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): \DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(\DateTimeInterface $updatedAt): static { $this->updatedAt = $updatedAt; return $this; }

    /**
     * @return Collection<int, UserSubscription>
     */
    public function getSubscriptions(): Collection
    {
        return $this->subscriptions;
    }

    public function setSubscription(UserSubscription $subscription): static
    {
        if (!$this->subscriptions->contains($subscription)) {
            $this->subscriptions->add($subscription);
            $subscription->setUser($this);
        }

        return $this;
    }

    public function removeSubscription(UserSubscription $subscription): static
    {
        if ($this->subscriptions->removeElement($subscription)) {
            if ($subscription->getUser() === $this) {
                $subscription->setUser(null);
            }
        }

        return $this;
    }
}
