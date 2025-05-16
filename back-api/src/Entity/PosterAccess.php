<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\{Get, GetCollection, Post};
use App\Repository\PosterAccessRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PosterAccessRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['poster_access:read']],
    denormalizationContext: ['groups' => ['poster_access:write']],
    operations: [
        new GetCollection(),
        new Get(),
        new Post()
    ]
)]
class PosterAccess
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['poster_access:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['poster_access:read', 'poster_access:write'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Poster::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['poster_access:read', 'poster_access:write'])]
    private ?Poster $poster = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['poster_access:read'])]
    private \DateTimeInterface $accessedAt;

    public function __construct()
    {
        $this->accessedAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getPoster(): ?Poster
    {
        return $this->poster;
    }

    public function setPoster(?Poster $poster): static
    {
        $this->poster = $poster;
        return $this;
    }

    public function getAccessedAt(): \DateTimeInterface
    {
        return $this->accessedAt;
    }

    public function setAccessedAt(\DateTimeInterface $accessedAt): static
    {
        $this->accessedAt = $accessedAt;
        return $this;
    }
}
