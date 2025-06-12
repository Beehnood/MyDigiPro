<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\{Get, GetCollection, Post, Put, Delete};
use App\Repository\FilmRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: FilmRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['film:read']],
    denormalizationContext: ['groups' => ['film:write']],
    operations: [
        new GetCollection(
            uriTemplate: '/api/films',
            security: "is_granted('ROLE_USER')",
            securityMessage: 'Vous devez être connecté pour accéder à cette ressource.'
        ),
        new GetCollection(
            uriTemplate: '/api/films/populaires',
            controller: \App\Controller\FilmController::class . '::getPopularFilms',
            name: 'films_populaires',
            security: "is_granted('ROLE_USER')",
            securityMessage: 'Vous devez être connecté pour accéder à cette ressource.'
        ),
        new Get(security: "is_granted('ROLE_USER')"),
        new Post(security: "is_granted('ROLE_SUPER_ADMIN')"),
        new Put(security: "is_granted('ROLE_SUPER_ADMIN')"),
        new Delete(security: "is_granted('ROLE_SUPER_ADMIN')"),
    ]
)]

class Film
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['film:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::INTEGER, unique: true)]
    #[Groups(['film:read', 'film:write'])]
    #[Assert\NotBlank(message: 'Le TMDB ID est requis.')]
    #[Assert\Positive(message: 'Le TMDB ID doit être positif.')]
    private ?int $tmdbId = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[Groups(['film:read'])]
    private ?User $user = null;

    #[ORM\Column(length: 100)]
    #[Groups(['film:read', 'film:write'])]
    #[Assert\NotBlank(message: 'Le titre est requis.')]
    #[Assert\Length(max: 100, maxMessage: 'Le titre ne peut pas dépasser 100 caractères.')]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['film:read', 'film:write'])]
    #[Assert\NotBlank(message: 'La description est requise.')]
    private ?string $overview = null;

    #[ORM\Column(type: Types::FLOAT, options: ["default" => 0.0])]
    #[Groups(['film:read'])]
    #[Assert\Range(min: 0, max: 10, notInRangeMessage: 'La note moyenne doit être entre 0 et 10.')]
    private float $noteMoyenne = 0.0;

    #[ORM\ManyToMany(targetEntity: Category::class, inversedBy: 'films')]
    #[ORM\JoinTable(name: 'film_category')]
    #[Groups(['film:read', 'film:write'])]
    private Collection $categories;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['film:read', 'film:write'])]
    private ?string $posterPath = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    #[Groups(['film:read'])]
    private ?\DateTimeInterface $releaseDate = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Groups(['film:read'])]
    private \DateTimeInterface $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Groups(['film:read'])]
    private \DateTimeInterface $updatedAt;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTmdbId(): ?int
    {
        return $this->tmdbId;
    }

    public function setTmdbId(int $tmdbId): self
    {
        $this->tmdbId = $tmdbId;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getOverview(): ?string
    {
        return $this->overview;
    }

    public function setOverview(string $overview): self
    {
        $this->overview = $overview;
        return $this;
    }

    public function getNoteMoyenne(): float
    {
        return $this->noteMoyenne;
    }

    public function setNoteMoyenne(float $noteMoyenne): self
    {
        $this->noteMoyenne = $noteMoyenne;
        return $this;
    }

    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
            $category->addFilm($this);
        }
        return $this;
    }

    public function removeCategory(Category $category): self
    {
        if ($this->categories->removeElement($category)) {
            $category->removeFilm($this);
        }
        return $this;
    }

    public function getPosterPath(): ?string
    {
        return $this->posterPath;
    }

    public function setPosterPath(?string $posterPath): self
    {
        $this->posterPath = $posterPath;
        return $this;
    }

    public function getReleaseDate(): ?\DateTimeInterface
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(?\DateTimeInterface $releaseDate): self
    {
        $this->releaseDate = $releaseDate;
        return $this;
    }

    public function getCreatedAt(): \DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): \DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}