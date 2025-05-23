<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model\SecurityScheme;
use ApiPlatform\OpenApi\OpenApi;

final class JwtDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {}

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);

        $schemas = $openApi->getComponents()->getSecuritySchemes() ?? [];
        $schemas['JWT'] = new SecurityScheme('http', ['scheme' => 'bearer', 'bearerFormat' => 'JWT']);
        $openApi->getComponents()->setSecuritySchemes($schemas);

        // Add global security requirement
        foreach ($openApi->getPaths()->getPaths() as $pathItem) {
            foreach ($pathItem->getOperations() as $operation) {
                $operation->addSecurity(['JWT' => []]);
            }
        }

        return $openApi;
    }
}
