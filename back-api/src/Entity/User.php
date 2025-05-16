<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\{Get, GetCollection, Post, Put, Delete};
use App\Repository\UserRepository;
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
    #[Groups(['write:item'])] // Password is not exposed for reading
    private string $password;
    #[ORM\Column(type: Types::INTEGER)]
    #[Groups(['read:collection', 'write:item'])]
    private int $points = 0; // nombre de points accumulés
    
    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups(['read:collection', 'write:item'])]
    private bool $isPremium = false; // statut premium ou non

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['read:collection', 'write:item'])]
    private ?string $favoriteMovies = null;

    #[ORM\ManyToOne(targetEntity: Subscription::class, inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['read:collection', 'write:item'])]
    private ?Subscription $subscription = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['read:collection'])]
    private \DateTimeInterface $createdAt;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['read:collection'])]
    private \DateTimeInterface $updatedAt;

    #[ORM\Column(type: 'json')]
    #[Groups(['read:collection'])]
    private array $roles = [];

    public function __construct()
    {
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
        $this->roles = ['ROLE_USER'];
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

    public function getRoles(): array { return array_unique([...$this->roles, 'ROLE_USER']); }
    public function setRoles(array $roles): static { $this->roles = $roles; return $this; }

    public function getUserIdentifier(): string { return $this->email; }
    public function eraseCredentials(): void {}

    public function getFavoriteMovies(): ?string { return $this->favoriteMovies; }
    public function setFavoriteMovies(?string $favoriteMovies): static { $this->favoriteMovies = $favoriteMovies; return $this; }

    public function getSubscription(): ?Subscription { return $this->subscription; }
    public function setSubscription(?Subscription $subscription): static { $this->subscription = $subscription; return $this; }

    public function getCreatedAt(): \DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): static { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): \DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(\DateTimeInterface $updatedAt): static { $this->updatedAt = $updatedAt; return $this; }
}
