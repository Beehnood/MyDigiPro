<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model;

class JwtDecorator implements OpenApiFactoryInterface
{
    public function __construct(private OpenApiFactoryInterface $decorated) {}

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $paths = $openApi->getPaths()->getPaths();

        foreach ($paths as $path => $pathItem) {
            $operations = [];
            if ($get = $pathItem->getGet()) {
                $operations['get'] = $get;
            }
            if ($post = $pathItem->getPost()) {
                $operations['post'] = $post;
            }
            if ($put = $pathItem->getPut()) {
                $operations['put'] = $put;
            }
            if ($delete = $pathItem->getDelete()) {
                $operations['delete'] = $delete;
            }

            foreach ($operations as $method => $operation) {
                $security = $operation->getSecurity() ?? [];
                $security[] = ['bearerAuth' => []];
                $newOperation = $operation->withSecurity($security);
                $pathItem = $pathItem->{'with' . ucfirst($method)}($newOperation);
            }

            $openApi->getPaths()->addPath($path, $pathItem);
        }

        $schemas = $openApi->getComponents()->getSecuritySchemes() ?? [];
        $schemas['bearerAuth'] = new Model\SecurityScheme(
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        );
        $openApi->getComponents()->withSecuritySchemes($schemas);

        return $openApi;
    }
}