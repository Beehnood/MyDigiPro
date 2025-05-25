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

        $components = $openApi->getComponents();
        $schemas = $components->getSecuritySchemes() ?? [];
        $schemas['JWT'] = new SecurityScheme('http', 'bearer', null, 'JWT');

        // Use reflection to set the private property 'securitySchemes'
        $ref = new \ReflectionClass($components);
        if ($ref->hasProperty('securitySchemes')) {
            $prop = $ref->getProperty('securitySchemes');
            $prop->setAccessible(true);
            $prop->setValue($components, $schemas);
        }

        // Add global security requirement
        foreach ($openApi->getPaths()->getPaths() as $pathItem) {
            foreach ($pathItem->getOperations() as $operation) {
                $operation->addSecurity(['JWT' => []]);
            }
        }

        return $openApi;
    }
}
