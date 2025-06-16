<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\{GetCollection, Post, Delete};
use App\Controller\UserFilmController;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\RequestBody;
use App\Enum\TypeListe;

#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['user_film:read']],
    denormalizationContext: ['groups' => ['user_film:write']],
    operations: [
        new GetCollection(
            uriTemplate: '/api/user/films',
            controller: UserFilmController::class . '::getUserFilms',
            security: "is_granted('ROLE_USER')",
            securityMessage: 'Vous devez être connecté pour accéder à cette ressource.',
            openapi: new Operation(
                summary: 'Récupère la liste des films de l\'utilisateur',
                description: 'Récupère les films associés à l\'utilisateur authentifié depuis TMDB',
                responses: [
                    '200' => [
                        'description' => 'Liste des films de l\'utilisateur',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    'type' => 'array',
                                    'items' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'tmdbId' => ['type' => 'integer'],
                                            'title' => ['type' => 'string'],
                                            'overview' => ['type' => 'string'],
                                            'posterPath' => ['type' => 'string'],
                                            'releaseDate' => ['type' => 'string'],
                                            'note' => ['type' => 'number'],
                                            'type' => ['type' => 'string'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    '401' => ['description' => 'Non authentifié'],
                    '500' => ['description' => 'Erreur serveur'],
                ]
            )
        ),
        new Post(
            uriTemplate: '/api/user/films',
            controller: UserFilmController::class . '::addUserFilm',
            security: "is_granted('ROLE_USER')",
            securityMessage: 'Vous devez être connecté pour accéder à cette ressource.',
            openapi: new Operation(
                summary: 'Ajoute un film à la liste de l\'utilisateur',
                description: 'Ajoute un film identifié par son tmdbId à la liste de l\'utilisateur',
                requestBody: new RequestBody(
                    description: 'Données du film à ajouter',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'tmdbId' => ['type' => 'integer'],
                                    'type' => ['type' => 'string', 'enum' => ['VUE', 'JAIME', 'FAVORIS']],
                                ],
                                'required' => ['tmdbId', 'type'],
                            ],
                        ],
                    ]),
                    required: true
                ),
                responses: [
                    '201' => ['description' => 'Film ajouté'],
                    '400' => ['description' => 'Données invalides'],
                    '404' => ['description' => 'Film non trouvé sur TMDB'],
                    '401' => ['description' => 'Non authentifié'],
                    '500' => ['description' => 'Erreur serveur'],
                ]
            )
        ),
        new Delete(
            uriTemplate: '/api/user/films/{tmdbId}',
            controller: UserFilmController::class . '::deleteUserFilm',
            security: "is_granted('ROLE_USER')",
            securityMessage: 'Vous devez être connecté pour accéder à cette ressource.',
            openapi: new Operation(
                summary: 'Supprime un film de la liste de l\'utilisateur',
                description: 'Supprime un film identifié par son tmdbId de la liste de l\'utilisateur authentifié',
                responses: [
                    '200' => ['description' => 'Film supprimé avec succès'],
                    '404' => ['description' => 'Film non trouvé'],
                    '401' => ['description' => 'Non authentifié'],
                    '500' => ['description' => 'Erreur serveur'],
                ]
            )
        ),
    ]
)]
class UserFilmReference
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['user_film:read', 'user_film:write'])]
    #[Assert\Positive(message: 'Le TMDB ID doit être positif.')]
    private int $tmdbId;

    #[ORM\Column(type: "string", enumType: TypeListe::class)]
    #[Groups(['user_film:read', 'user_film:write'])]
    private TypeListe $type;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'filmReferences')]
    #[Groups(['user_film:read'])]
    #[Assert\NotNull(message: "L'utilisateur est requis.")]
    private User $user;

    public function getId(): ?int { return $this->id; }

    public function getTmdbId(): int { return $this->tmdbId; }
    public function setTmdbId(int $tmdbId): self { $this->tmdbId = $tmdbId; return $this; }

    public function getType(): TypeListe { return $this->type; }
    public function setType(TypeListe $type): self { $this->type = $type; return $this; }

    public function getUser(): User { return $this->user; }
   public function setUser(?User $user): self
{
    $this->user = $user;
    return $this;
}
}