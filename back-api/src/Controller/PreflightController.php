<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PreflightController
{
    #[Route('/{path}', name: 'preflight', requirements: ['path' => '.*'], methods: ['OPTIONS'])]
    public function preflight(): Response
    {
        return new Response('', 204);
    }
}