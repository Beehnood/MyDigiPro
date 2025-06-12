<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model\SecurityScheme;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\PathItem;

final class JwtDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {}

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);

        // Configuration du schéma de sécurité JWT
        $securitySchemes = $openApi->getComponents()->getSecuritySchemes() ?: [];
        $securitySchemes['JWT'] = new SecurityScheme(
            scheme: 'bearer',
            type: 'http',
            bearerFormat: 'JWT'
        );

        // Mise à jour des composants OpenAPI
        $components = $openApi->getComponents()->withSecuritySchemes($securitySchemes);
        $openApi = $openApi->withComponents($components);

        // Ajout de la sécurité JWT à toutes les opérations
        $paths = $openApi->getPaths();
        foreach ($paths as $path => $pathItem) {
            $operations = [
                'get' => $pathItem->getGet(),
                'put' => $pathItem->getPut(),
                'post' => $pathItem->getPost(),
                'delete' => $pathItem->getDelete(),
                'patch' => $pathItem->getPatch(),
                'head' => $pathItem->getHead(),
                'options' => $pathItem->getOptions(),
                'trace' => $pathItem->getTrace(),
            ];

            foreach ($operations as $method => $operation) {
                if ($operation instanceof Operation) {
                    $operation = $operation->withSecurity(['JWT' => []]);
                    $pathItem = $pathItem->{'with'.ucfirst($method)}($operation);
                }
            }

            $paths->addPath($path, $pathItem);
        }

        return $openApi;
    }
}