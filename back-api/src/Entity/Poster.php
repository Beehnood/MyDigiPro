<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\{Get, GetCollection, Post, Delete};
use App\Repository\PosterRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: PosterRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['poster:read']],
    denormalizationContext: ['groups' => ['poster:write']],
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Delete()
    ]
)]
class Poster
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['poster:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['poster:read', 'poster:write'])]
    private ?User $user = null;

    #[ORM\Column]
    #[Groups(['poster:read', 'poster:write'])]
    #[Assert\Positive(message: 'Le TMDB ID doit être positif.')]
    private int $tmdbId;

    #[ORM\Column(length: 255)]
    #[Groups(['poster:read', 'poster:write'])]
    private string $filePath;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['poster:read'])]
    private \DateTimeInterface $uploadedAt;

    public function __construct()
    {
        $this->uploadedAt = new \DateTime();
    }

    public function getId(): ?int { return $this->id; }

    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): static { $this->user = $user; return $this; }

    public function getTmdbId(): int { return $this->tmdbId; }
    public function setTmdbId(int $tmdbId): static { $this->tmdbId = $tmdbId; return $this; }

    public function getFilePath(): string { return $this->filePath; }
    public function setFilePath(string $filePath): static { $this->filePath = $filePath; return $this; }

    public function getUploadedAt(): \DateTimeInterface { return $this->uploadedAt; }
    public function setUploadedAt(\DateTimeInterface $uploadedAt): static { $this->uploadedAt = $uploadedAt; return $this; }
}