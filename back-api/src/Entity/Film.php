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

#[ORM\Entity(repositoryClass: FilmRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: ['groups' => ['film:read']],
    denormalizationContext: ['groups' => ['film:write']],
    operations: [
        new GetCollection(),
        new Get(),
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

    #[ORM\Column(type: 'integer', unique: true)]
    #[Groups(['film:read', 'film:write'])]
    private int $tmdbId;

    #[ORM\Column(length: 100)]
    #[Groups(['film:read', 'film:write'])]
    private string $title;

    #[ORM\Column(type: "text")]
    #[Groups(['film:read', 'film:write'])]
    private string $overview;

    #[ORM\Column(type: "float", options: ["default" => 0])]
    #[Groups(['film:read'])]
    private float $noteMoyenne = 0;

    #[ORM\ManyToMany(targetEntity: Category::class, inversedBy: "films")]
    #[ORM\JoinTable(name: "film_category")]
    #[Groups(['film:read', 'film:write'])]
    private Collection $categories;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['film:read', 'film:write'])]
    private ?string $posterPath = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['film:read'])]
    private ?\DateTimeInterface $releaseDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['film:read'])]
    private \DateTimeInterface $createdAt;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['film:read'])]
    private \DateTimeInterface $updatedAt;

    public function __construct()
    {
        $this->categories = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->updatedAt = new \DateTime();
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

    // --- Getters / Setters ---
    
    public function getId(): ?int { return $this->id; }

    public function getTmdbId(): int { return $this->tmdbId; }
    public function setTmdbId(int $tmdbId): static { $this->tmdbId = $tmdbId; return $this; }

    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }

    public function getOverview(): string { return $this->overview; }
    public function setOverview(string $overview): static { $this->overview = $overview; return $this; }

    public function getNoteMoyenne(): float { return $this->noteMoyenne; }
    public function setNoteMoyenne(float $noteMoyenne): static { $this->noteMoyenne = $noteMoyenne; return $this; }

    public function getCategories(): Collection { return $this->categories; }

    public function addCategory(Category $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
            $category->addFilm($this);
        }
        return $this;
    }

    public function removeCategory(Category $category): static
    {
        if ($this->categories->removeElement($category)) {
            $category->removeFilm($this);
        }
        return $this;
    }

    public function getPosterPath(): ?string { return $this->posterPath; }
    public function setPosterPath(?string $posterPath): static { $this->posterPath = $posterPath; return $this; }

    public function getReleaseDate(): ?\DateTimeInterface { return $this->releaseDate; }
    public function setReleaseDate(?\DateTimeInterface $releaseDate): static
    {
        $this->releaseDate = $releaseDate;
        return $this;
    }
    /**
     * @return \DateTimeInterface
     */

    public function getCreatedAt(): \DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): static { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): \DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(\DateTimeInterface $updatedAt): static { $this->updatedAt = $updatedAt; return $this; }
}
