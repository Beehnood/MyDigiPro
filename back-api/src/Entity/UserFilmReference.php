<?php

namespace App\Entity;

use App\Repository\UserFilmReferenceRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserFilmReferenceRepository::class)]

class UserFilmReference
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private int $tmdbId;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private User $user;

    public function getId(): ?int { return $this->id; }

    public function getTmdbId(): int { return $this->tmdbId; }
    public function setTmdbId(int $tmdbId): self { $this->tmdbId = $tmdbId; return $this; }

    public function getUser(): User { return $this->user; }
    public function setUser(User $user): self { $this->user = $user; return $this; }
}