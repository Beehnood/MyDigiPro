<?php




namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model;
use ApiPlatform\OpenApi\OpenApi;


final class OpenApiFactory implements OpenApiFactoryInterface
{
    private OpenApiFactoryInterface $decorated;

    public function __construct(OpenApiFactoryInterface $decorated)
    {
        $this->decorated = $decorated;
    }

    public function __invoke(array $context = []): OpenApi
    {
        file_put_contents(__DIR__ . '/../../../login_log.txt', "OpenApiFactory executed\n", FILE_APPEND);
        $openApi = $this->decorated->__invoke($context);
        $paths = $openApi->getPaths();

$paths->addPath('/api/login', new Model\PathItem(
    post: new Model\Operation(
        operationId: 'postLogin',
        tags: ['Auth'],
        summary: 'Authentifie un utilisateur',
        requestBody: new Model\RequestBody(
            description: 'Identifiants utilisateur',
            content: new \ArrayObject([
                'application/json' => [
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'email' => ['type' => 'string', 'example' => 'user@example.com'],
                            'password' => ['type' => 'string', 'example' => 'password123']
                        ],
                        'required' => ['email', 'password']
                    ]
                ]
            ])
        ),
        responses: [
            '200' => [
                'description' => 'Token JWT retourné',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'token' => ['type' => 'string']
                            ]
                        ]
                    ]
                ]
            ],
            '401' => ['description' => 'Échec d’authentification']
        ]
    )
));
        return $openApi;
    }
}
